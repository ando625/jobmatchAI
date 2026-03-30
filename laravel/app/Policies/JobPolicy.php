<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;
use App\Models\JobPosting;

class JobPolicy
{
    // ==================
    // 全員が見られる（ログイン不要）
    // ==================

    // viewAny() = 求人一覧を見る権限
    // ?User $user = ログインしてなくてもOKという意味（?をつけるとnullを許可）
    public function viewAny(?User $user): bool
    {
        // trueを返す = 誰でも見ていいよ
        return true;
    }

    // view() = 求人詳細を見る権限
    public function view(?User $user): bool
    {
        // trueを返す = 誰でも見ていいよ
        return true;
    }

    // ==================
    // 企業・管理者だけができる
    // ==================

    // create() = 求人を新規投稿する権限
    public function create(User $user): bool
    {
        // $user->role = ログイン中のユーザーのロール（Enum）
        // UserRole::Company = 企業ロール
        // UserRole::Admin = 管理者ロール
        // どちらかに一致すればtrueを返す
        return in_array($user->role, [
            UserRole::Company,
            UserRole::Admin,
        ]);
    }

    // 3. 求人を編集する（「自分の会社の求人」か「管理者」だけ！）
    public function update(User $user, JobPosting $job): bool
    {
        // 管理者なら無条件でOK（最強の権限）
        if ($user->role === UserRole::Admin) return true;

        // 企業なら「自分の会社のID」と「求人の会社ID」が一致するかチェック
        // ?-> は、もし会社情報がなくてもエラーにせず null を返してくれる優しい杖です
        return $user->role === UserRole::Company && $user->company?->id === $job->company_id;
    }

    // 4. 求人を削除する（編集と同じルールでOK）
    public function delete(User $user, JobPosting $job): bool
    {
        return $this->update($user, $job); // updateと同じルールなので使い回し！
    }

    // 5. 求人に応募する（求職者だけが「応募ボタン」を押せる）
    public function apply(User $user): bool
    {
        return $user->role === UserRole::Jobseeker;
    }
}
