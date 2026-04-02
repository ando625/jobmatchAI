<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\MatchPreviewController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\MessageController;


Route::prefix('auth')->group(function (){
    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);
});




Route::middleware('auth:sanctum')->group(function (){
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/me', function () {
        // auth()->user() = 今ログイン中のユーザー情報を返す
        return response()->json([
            'user' => auth()->user(),
        ]);
    });

    //求人API　一覧
    Route::get('/jobs', [JobController::class, 'index']);

    //詳細
    Route::get('/jobs/{id}', [JobController::class, 'show']);

    //プロフィール表示
    Route::get('/profile', [ProfileController::class, 'show']);

    // プロフィール作成編集
    Route::post('/profile', [ProfileController::class, 'upsert']);

    //応募
    Route::post('/jobs/{id}/apply', [ApplicationController::class, 'apply']);

    // 自分の応募一覧を取得
    Route::get('/applications', [ApplicationController::class, 'myApplications']);

    //AI診断プレビュー
    Route::post('/jobs/{id}/preview', [MatchPreviewController::class, 'preview']);

    Route::get('/match-previews', [MatchPreviewController::class, 'myPreviews']);

    //メッセージ通知
    Route::get('/messages/unread-count',[MessageController::class, 'unreadCount']);

    //メッセージ一覧
    Route::get('/messages/{applicationId}', [MessageController::class, 'index']);

    //メッセージ作成
    Route::post('/messages', [MessageController::class, 'store']);

    //メッセージ削除
    Route::delete('/messages/{id}', [MessageController::class,'destroy']);
});


// ==========================================
// 企業・管理者だけ使えるルート
// ==========================================
// auth:sanctum = ログイン済みチェック
// role:company,admin = 企業か管理者だけ通過できる
Route::middleware(['auth:sanctum', 'role:company,admin'])->group(function (){
    

    Route::get('/company/jobs', [JobController::class, 'companyJobs']);
    Route::patch('/company/jobs/{id}/toggle', [JobController::class,'toggleStatus']);

    // 求人作成
    Route::post('/company/jobs', [JobController::class, 'store']);

    // 編集用の求人1件取得
    Route::get('/company/jobs/{job}', [JobController::class, 'showForCompany']);

    // 求人更新
    Route::put('/company/jobs/{job}', [JobController::class, 'update']);

    // 求人削除
    Route::delete('/company/jobs/{job}', [JobController::class, 'destroy']);


    Route::get('/company/jobs/{id}/applicants',            [JobController::class, 'applicants']);
    Route::patch('/company/applications/{id}/status',     [JobController::class, 'updateApplicationStatus']);

    //応募者の１人のプロフィール取得
    Route::get('/company/applicants/{id}', [JobController::class, 'showApplicant']);

    //応募IDを指定してAI診断を実行
    Route::post('/company/applications/{application}/ai-analysis', [MatchPreviewController::class, 'analyzeForCompany']);

    //企業のプロフィール会社情報を登録
    Route::post('/company/profile', [JobController::class, 'storeCompany']);
});







// ==========================================
// 管理者だけ使えるルート
// ==========================================
// role:admin = 管理者だけ通過できる
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // 管理者向け（本番では role チェックのミドルウェアも追加したい）
    Route::get('/admin/users',          [AdminController::class, 'users']);
    Route::get('/admin/jobs',           [AdminController::class, 'jobs']);
    Route::get('/admin/stats',          [AdminController::class, 'stats']);
    Route::patch('/admin/jobs/{id}/toggle', [AdminController::class, 'toggleJobStatus']);
});