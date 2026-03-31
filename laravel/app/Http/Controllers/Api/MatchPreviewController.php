<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MatchPreview;
use App\Models\Profile;
use App\Models\JobPosting;
use Illuminate\Support\Facades\Http;
use App\Models\Application;


class MatchPreviewController extends Controller
{
    // ============================================
    // AIマッチ診断ボタン押下時の処理
    // ============================================
    public function preview(Request $request, $jobId)
    {
        //ユーザーのスキルを取得
        $user = $request->user();
        $userSkills = $user->profile?->skills ?? [];

        //プロフィールの自己紹介文を取得
        $userIntro = $user->profile?->introduction ?? "";

        //求人の必須スキルを取得
        $job = JobPosting::findOrFail($jobId);
        $jobSkills = $job->required_skills ?? [];

        //Python FastAPI にスコア計算を依頼
        $response = Http::post('http://python:8000/match', [
            'user_skills' => $userSkills,
            'job_skills' => $jobSkills,
            'user_intro' => $userIntro,
        ]);

        //Pythonからのレスポンスが失敗ならエラーを返す
        if ($response->failed()){
            return response()->json([
                'message' => 'AI診断サービスに接続できませんでした'
            ],503);
        }

        //レスポンスのJSONを配列に変換する
        $result = $response->json();

        // match_previews テーブルに保存する
        $preview = MatchPreview::updateOrCreate(
            [
                'user_id' => $user->id,
                'job_posting_id' => $jobId,
            ],
            [
                'match_score' => $result['score'],
                'match_reason' => $result['reason'],
            ]
        );

        return response()->json([
            'score' => $preview->match_score,
            'reason' => $preview->match_reason,
        ]);
    }


    // ============================================
    // 自分の診断結果一覧を取得する
    // ============================================
    public function myPreviews(Request $request)
    {
        $previews = MatchPreview::with('jobPosting')
            ->where('user_id', $request->user()->id)
            ->orderBy('match_score', 'desc')
            ->get();

        return response()->json(['previews' => $previews]);
    }



    /**
     * 企業担当者が応募者をAI診断するための処理
     */
    public function analyzeForCompany(Application $application)
    {
        // 応募者のスキルと自己紹介を取得
        $userSkills = $application->user->profile?->skills ?? [];
        $userIntro = $application->user->profile?->introduction ?? "";

        // 求人の必須スキルを取得
        $jobSkills = $application->job_posting?->required_skills ?? [];

        // 応募時のマッチスコアを取得
        $score = $application->match_score ?? 0;

        // Python FastAPI の「企業専用窓口」を呼び出す
        $response = Http::post('http://python:8000/match/company', [
            'user_skills' => $userSkills,
            'job_skills' => $jobSkills,
            'score' => $score,
            'user_intro' => $userIntro,
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'AI診断サービスに接続できませんでした'], 503);
        }

        $result = $response->json();

        // applications テーブルの「企業用コメント欄」に保存する
        $application->update([
            'company_ai_comment' => $result['reason']
        ]);

        return response()->json([
            'comment' => $application->company_ai_comment
        ]);
    }
}
