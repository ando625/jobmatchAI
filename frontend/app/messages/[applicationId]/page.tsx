"use client";

// ===== app/messages/[applicationId]/page.tsx =====
// 求職者用メッセージページ
// MessageList・MessageInput を使う

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { messageApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Message } from "@/types/message";
import { ArrowLeft } from "lucide-react";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";

export default function MessagePage() {
    const { applicationId } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const appId = Number(applicationId);

    //メッセージ一覧を取得する
    const fetchMessages = async () => {
        try {
            const res = await messageApi.getMessages(appId);
            setMessages(res.data.messages);
        } catch (e) {
            console.error('メッセージの取得に失敗しました', e);
        } finally {
            setLoading(false);
        }
    };


    //ページを開いた時＋１０秒ごとに自動更新（ポーリング）
    useEffect(() => {
        fetchMessages();
        const timer = setInterval(fetchMessages, 10000);
        return () => clearInterval(timer);
    }, [appId]);

    //メッセージを送信する
    const handleSend = async () => {
        if (!content.trim()) return;

        setSending(true);
        try {
            const res = await messageApi.sendMessage(appId, content);
            setMessages(prev => [...prev, res.data.message]);
            setContent('');
        } catch (e) {
            alert('送信に失敗しました');
        } finally {
            setSending(false);
        }
    };

    // メッセージ削除の関数
    const handleDelete = async (messageId: number) => {
        if (!confirm('メッセージを削除しますか？')) return;

        try {
            await messageApi.deleteMessage(messageId);
            // 画面上のリストからも消す
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (e) {
            alert('削除に失敗しました');
        }
    };
    



    //読み込み中表示
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-10 h-10 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">

            {/* ヘッダー */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>

                <div>
                    <h1 className="text-base font-bold text-gray-800">メッセージ</h1>
                    <p className="text-xs text-gray-400">企業担当者とのやり取り</p>
                </div>
            </div>


            {/* メッセージ一覧 */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
                <MessageList
                    messages={messages}
                    currentUserId={user?.id}
                    onDelete={handleDelete}
                    myBubbleColor="bg-[#534AB7]"
                />
            </div>

            {/* 入力エリア */}
            <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
                <div className="max-w-2xl mx-auto">
                    <MessageInput
                        content={content}
                        onChange={setContent}
                        onSend={handleSend}
                        sending={sending}
                        sendButtonColor="bg-[#534AB7]"
                        sendButtonHoverColor="hover:bg-[#3C3489]"
                        focusBorderColor="focus:border-[#534AB7]"
                    />
                </div>
            </div>
        </div>
    )
}