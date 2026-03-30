<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ProfileUpsertRequest;


class ProfileController extends Controller
{
    //求職者：プロフィール表示
    public function show(Request $request)
    {
        $profile = Profile::where('user_id', $request->user()->id)->first();

        return response()->json([
            'profile' => $profile
        ]);
    }


    // プロフィールを作成 or 更新するメソッド
    public function upsert(ProfileUpsertRequest $request)
    {
        $profile = Profile::updateOrCreate(
            ['user_id' => Auth::id()],
            $request->validated()
        );

        return response()->json([
            'message' => 'プロフィールを保存しました',
            'profile' => $profile,
        ]);

    }

    
}
