<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\LoginRequest;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // ==================
    // 登録メソッド
    // ==================
    public function register(RegisterRequest $request)
    {
        // User::create() = usersテーブルに新しいユーザーを1行追加する
        // $request->validated() = RegisterRequestでチェック済みの値だけ取り出す
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            // passwordはUser.phpのcasts設定で自動的にハッシュ化される
            'password' => $request->password,
            // UserRole::from() = 文字列('jobseeker'など)をEnumに変換する
            'role'     => UserRole::from($request->role),
        ]);

        // $user->createToken() = このユーザーのトークン（鍵）を発行する
        // 'auth_token' = トークンにつける名前（なんでもOK）
        // ->plainTextToken = 実際のトークン文字列を取り出す
        $token = $user->createToken('auth_token')->plainTextToken;

        // response()->json() = JSON形式でレスポンスを返す
        // 第2引数の201 = 「作成成功」を意味するHTTPステータスコード
        return response()->json([
            'message'      => '登録が完了しました',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            // $user->role->value = EnumからDBの文字列値('jobseeker'など)を取り出す
            'role'         => $user->role->value,
        ], 201);
    }

    // ==================
    // ログインメソッド
    // ==================
    public function login(LoginRequest $request)
    {
        // Auth::attempt() = メールとパスワードがDBと一致するか確認する
        // 一致しなければfalseが返ってくる
        if (!Auth::attempt([
            'email'    => $request->email,
            'password' => $request->password,
        ])) {
            // 一致しなかった場合 → 401エラーを返す
            // 401 = 「認証失敗」を意味するHTTPステータスコード
            return response()->json([
                'message' => 'メールアドレスまたはパスワードが正しくありません',
            ], 401);
        }

        // Auth::user() = 今ログインしたユーザーの情報を取得する
        $user = Auth::user();

        // 古いトークンを全部削除してから新しいトークンを発行する
        // tokens()->delete() = このユーザーの全トークンを削除
        $user->tokens()->delete();

        // 新しいトークンを発行する
        $token = $user->createToken('auth_token')->plainTextToken;

        // 200 = 「成功」を意味するHTTPステータスコード
        return response()->json([
            'message'      => 'ログインしました',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role->value,
        ], 200);
    }

    // ==================
    // ログアウトメソッド
    // ==================
    public function logout()
    {
        // auth()->user() = 今リクエストしているユーザーを取得
        // currentAccessToken() = 今使っているトークンを取得
        // delete() = そのトークンをDBから削除する
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ログアウトしました',
        ], 200);
    }
}
