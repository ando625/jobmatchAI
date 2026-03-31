<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\JobPosting;
use App\Models\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\JobPostingRequest;
use App\Http\Requests\StoreCompanyRequest;

class JobController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = JobPosting::where('status', 'open');
        //statusがopenのものだけ取得

        //キーワード検索
        if($request->filled('search')){
            $search = $request->search;
            $query->where(function ($q) use ($search){
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // required_skills での絞り込み
        // JSONカラムの中を検索する（MySQL 8対応）
        if($request->filled('skill')){
            $skill = $request->skill;
            $query->whereJsonContains('required_skills', $skill);
        }

        // 場所で絞り込み
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // データの取得
        $jobs = $query->orderBy('created_at', 'desc')
            ->paginate(10);


        //ログイン中のユーザーのスキルを取得してスコアを計算
        $user = Auth::user();
        //プロフィールにスキルを登録してる想定
        $userSkills = $user && $user->profile ? ($user->profile->skills ?? []) : [];


        //各く求人データを作り替える
        $jobs->getCollection()->transform(function ($job) use ($userSkills){
            $job->skill_score = $this->calculateScore($userSkills, $job->required_skills ?? []);
            return $job;
        });

        return response()->json([
            'success' => true,
            'data' => $jobs,
        ]);


    }

    // 求人票に常に適合スコアを表示させるため取得
    public function calculateScore($userSkills, $jobSkills)
    {
        //どちらかが空なら０
        if (empty($userSkills) || empty($jobSkills)) return 0;

        // 重複を消して整理
        // すべて小文字に変換してから比較する
        $userSet = array_unique(array_map('strtolower', $userSkills));
        $jobSet = array_unique(array_map('strtolower', $jobSkills));

        //共通するスキル
        $intersection = array_intersect($userSet, $jobSet);
        //全てのスキル
        $union = array_unique(array_merge($userSet, $jobSet));

        //計算
        return (int)(count($intersection) / count($union) * 100);
    }


    //求人１件の詳細を返す
    public function show($id)
    {
        $job = JobPosting::where('status', 'open')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $job,
        ]);


    }

    /**
     * 自社の求人一覧を返す（企業専用）
     */
    public function companyJobs(Request $request)
    {

        $user = Auth::user();

        $company = Company::where('user_id', $user->id)->first();

        if (!$company) {
            return response()->json(['success' => false, 'message' => '会社データが紐付いていません'], 404);
        }


        $jobs = JobPosting::where('company_id', $company->id)
                    ->withCount('applications')
                    // withCount('applications') = 各求人に何件応募があるかを
                    ->orderBy('created_at', 'desc')
                    ->get();


        return response()->json([
            'success' => true,
            'data' => $jobs,
        ]);
    }


    /**
     * 求人のステータスを切り替える（公開 ↔ 非公開）
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = Auth::user();
        $company = Company::where('user_id', $user->id)->firstOrFail();

        $job = JobPosting::where('id', $id)
                    ->where('company_id', $company->id)
                    ->firstOrFail();
        
        $job->status = $job->status === 'open' ? 'closed' : 'open';

        $job->save();

        return response()->json([
            'success' => true,
            'data' => $job,
        ]);
    }


    // ============================================================
    // 「新しい求人を作る」
    // ============================================================
    public function store(JobPostingRequest $request)
    {


        //今ログインしているユーザーの会社情報を取得
        $company = Auth::user()->company;

        //会社情報がない場合はエラー
        if(!$company){
            return response()->json([
                'success' => false,
                'message' => '企業アカウントのみ求人を投稿できます',
            ],403);
        }

        $validated = $request->validated();

        //求人を作成
        $job = JobPosting::create([
            'title'           => $validated['title'],
            'description'     => $validated['description'],
            'location'        => $validated['location'],
            'salary_min'      => $validated['salary_min'] ?? null,
            'salary_max'      => $validated['salary_max'] ?? null,
            'required_skills' => $validated['required_skills'] ?? [],

            'company_id' => $company->id,
            'company_name' => $company->company_name,
            'status' => $validated['status'] ?? 'open',
        ]);



        return response()->json([
            'success' => true,
            'data' => $job,
        ]);

    }


    // ============================================================
    // 「求人を更新する」
    // ============================================================
    public function update(JobPostingRequest $request, JobPosting $job)
    {
        $company = Auth::user()->company;

        if (!$company || $job->company_id !== $company->id) {
            return response()->json([
                'success' => false,
                'message' => 'この求人を編集する権限がありません',
            ], 403);
            // 403 = Forbidden（禁止）他社の求人を勝手に編集できないようにする
        }


        $job->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $job->fresh(),
        ]);
    }


    // ============================================================
    //  「企業が編集用に求人1件取得」
    // ============================================================
    public function showForCompany(JobPosting $job)
    {

        $company = Auth::user()->company;

        if (!$company || $job->company_id !== $company->id) {
            return response()->json([
                'success' => false,
                'message' => 'この求人を閲覧する権限がありません',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $job,
        ]);
    }

    // ============================================================
    // 「求人を削除する」
    // ============================================================
    public function destroy(JobPosting $job)
    {

        $job->delete();

        return response()->json([
            'success' => true,
            'message' => '求人を削除しました',
        ]);
    }


    /**
     * 特定の求人の応募者一覧を取得する
     */
    public function applicants(Request $request, $jobId)
    {
        $company = Auth::user()->company;

        $job = JobPosting::where('id', $jobId)
                    ->where('company_id', $company->id)
                    ->firstOrFail();
        
        $applicants = Application::with(['user.profile'])
                        ->where('job_posting_id', $jobId)
                        ->orderBy('match_score', 'desc')
                        ->get();
        
        return response()->json([
            'success' => true,
            'applicants' => $applicants,
        ]);
    }

    /**
     * 応募者のステータス（選考状況）を更新する
     */
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $request->validate([
            'status' => 'required|in:applying,screening,interview,offered,rejected',
        ]);

        $application = \App\Models\Application::findOrFail($applicationId);

        // 自分の会社の求人への応募かチェック（セキュリティ）
        if ($application->jobPosting->company_id !== Auth::user()->company->id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $application->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'ステータスを更新しました',
            'data' => $application
        ]);
    }


    /**
     * 応募者1人の詳細情報を取得する
     */
    public function showApplicant($id)
    {
        // Applicationテーブルから、指定されたIDの人をプロフィール付きで1人だけ連れてくる
        $applicant = Application::with(['user.profile', 'jobPosting'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $applicant,
        ]);
    }

    /**
     * 会社情報を新しく登録する
     */
    public function storeCompany(StoreCompanyRequest $request)
    {
        $validated = $request->validated();

        $company = Company::create([
            'user_id' => Auth::id(),
            'company_name' => $validated['company_name'],
            'location' => $validated['location'],
            'description' => $validated['description'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $company,
        ]);

    }
}
