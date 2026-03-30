<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
// Gate = 「ポリシーを管理するLaravelの門番」
use App\Models\JobPosting;
use App\Policies\JobPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    // boot() = アプリケーション起動時に1回だけ実行される処理
    {
        // 「Jobモデルの操作はJobPolicyでチェックする」と登録
        Gate::policy(JobPosting::class, JobPolicy::class);
        // Gate::policy(モデル, ポリシー) = 紐付け登録
    }
}
