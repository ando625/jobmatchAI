<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserRole;

class RoleMiddleware
{
    // handle() = リクエストが来たときに実行される処理
    // $request = 送られてきたリクエスト情報
    // $next = 次の処理（通過させるときに呼ぶ）
    // ...$roles = 許可するロールを複数受け取れる（可変長引数）
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // auth()->check() = ログインしているか確認
        // ! をつけると「ログインしていなければ」という意味
        if (!auth()->check()) {
            // 401 = 認証されていないエラー
            return response()->json([
                'message' => 'ログインしてください',
            ], 401);
        }

        // auth()->user() = 今ログインしているユーザーを取得
        $user = auth()->user();

        // $user->role->value = EnumからDBの文字列値を取り出す
        // 例：UserRole::Admin → 'admin'
        // in_array() = $rolesの配列の中に一致するものがあるか確認
        // ! をつけると「一致するものがなければ」という意味
        if (!in_array($user->role->value, $roles)) {
            // 403 = 権限がないエラー（Forbidden）
            return response()->json([
                'message' => 'この操作の権限がありません',
            ], 403);
        }

        // 全チェックを通過したら次の処理へ進む
        return $next($request);
    }
}
