<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\MatchPreview;
use App\Models\JobPosting;

class ApplicationController extends Controller
{
    // ============================================
    // 求人に応募するメソッド
    // ============================================
    public function apply(Request $request, $jobId)
    {
        $already = Application::where('user_id', $request->user()->id)
            ->where('job_posting_id', $jobId)
            ->exists();

        if($already){
            return response()->json(
                ['message' => 'すでにこの求人は応募済みです'],
                422
            );
        }

        // ===== 2. match_previews から診断結果を取得（あれば使う） =====
        $preview = MatchPreview::where('user_id',$request->user()->id)
            ->where('job_posting_id', $jobId)
            ->first();

        // ===== 3. applications テーブルに保存 =====
        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_posting_id' => $jobId,
            'status' => 'applying',
            'match_score' => $preview?->match_score ?? null,
            'match_reason' => $preview?->match_reason ?? null,
        ]);

        return response()->json([
            'message' => '応募が完了しました',
            'application' => $application,
        ],201);
    }


    // ============================================
    // 自分の応募一覧を取得するメソッド
    // ============================================
    public function myApplications(Request $request)
    {
        $applications = Application::with(['jobPosting', 'jobPosting.company'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json(['applications' => $applications]);
    }
}
