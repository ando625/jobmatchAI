<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\JobPosting;
use App\Models\Application;
use App\Enums\UserRole;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // 管理者用全ユーザー　一覧
    public function users()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    //管理者用　全求人一覧
    public function jobs()
    {
        $jobs = JobPosting::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $jobs,
        ]);
    }

    // 管理者用　統計サマリー
    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'jobseeker_count' => User::where('role', UserRole::Jobseeker)->count(),
                'company_count' => User::where('role', UserRole::Company)->count(),
                'total_jobs' => JobPosting::count(),
                'open_jobs' => JobPosting::where('status', 'open')->count(),
                'total_applications' => Application::count(),
            ],
        ]);
    }

    // 管理者用：求人の公開/非公開を切り替える
    public function toggleJobStatus($id)
    {
        // 1. 指定されたIDの求人を探す
        $job = JobPosting::findOrFail($id);

        // 2. 現在のステータスを見て、逆転させる
        // open なら closed に、それ以外（closed）なら open にする
        $newStatus = ($job->status === 'open') ? 'closed' : 'open';

        // 3. データベースを更新
        $job->update(['status' => $newStatus]);

        // 4. 新しい状態を返してあげる
        return response()->json([
            'success' => true,
            'data' => $job
        ]);
    }

}
