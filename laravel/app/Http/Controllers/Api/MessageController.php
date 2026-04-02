<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Message;
use App\Models\Application;


class MessageController extends Controller
{
    //メッセージ一覧表示
    public function index($id)
    {
        //その応募($id)に紐ずくメッセージを古い順に全部取ってくる
        $messages = Message::where('application_id', $id)
            ->with('sender:id,name,role')
            ->orderBy('created_at', 'asc')
            ->get();
        
        //自分宛のメッセージを既読にする
        Message::where('application_id', $id)
            ->where('sender_id', '!=', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' =>true,
            'messages' => $messages,
        ]);

    }


    // メッセージ作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'content'        => 'required|string|max:1000',
        ]);

        //セキュリティチェック
        // この応募に関係のある人（求職者or企業）しかメッセージを送れない
        $application = Application::with('jobPosting.company')->findOrFail($validated['application_id']);
        $userId = Auth::id();

        //誰かチェック　この応募した本人か？　この求人を出した会社か？
        $isApplicant = $application->user_id === $userId;
        $idCompany = $application->jobPosting?->company?->user_id === $userId;

        //権限チェック違うならエラー
        if(!$isApplicant && !$idCompany){
            return response()->json(['message' => 'このメッセージへのアクセス権限がありません'], 403);
        }

        //メッセージの保存
        $message = Message::create([
            'application_id' => $validated['application_id'],
            'sender_id' => Auth::id(),  //送り主は自分
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        //フロントで名前表示するため送り主の情報もつけて返す
        $message->load('sender:id,name,role');

        return response()->json([
            'success' => true,
            'message' => $message
        ],201);

    }


    //未読メッセージ数を取得する　通知バッチ用
    public function unreadCount()
    {
        $userId = Auth::id();
        $user   = Auth::user();

        if ($user->role->value === 'jobseeker') {
            // ── 求職者：自分が応募した応募に届いたメッセージ ──
            $count = Message::whereHas('application', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
                ->where('sender_id', '!=', $userId)
                ->where('is_read', false)
                ->count();
        } else {
            // ── 企業：自分の会社の求人への応募に届いたメッセージ ──
            // application → jobPosting → company → user_id = 自分
            $count = Message::whereHas('application.jobPosting.company', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
                ->where('sender_id', '!=', $userId)
                ->where('is_read', false)
                ->count();
        }

        return response()->json([
            'success'      => true,
            'unread_count' => $count,
        ]);
    }

    //メッセージ削除
    public function destroy($id)
    {
        $message = Message::findOrFail($id);

        //セキュリティ：自分以外のメッセージは消せないようにする
        if($message->sender_id !== Auth::id()){
            return response()->json(['message' => '削除権限がありません'],403);
        }

        $message->delete();

        return response()->json(['success' =>true, 'message'=>'削除しました']);
    }

}
