"use client";

// ===== components/messages/MessageList.tsx =====
// メッセージ一覧を表示する共通部品
// 求職者ページ・企業ページ両方で使い回す

import { useEffect, useRef } from "react";
import { Message } from "@/types/message";
import { Trash2 } from "lucide-react";

type Props = {
    messages: Message[];
    currentUserId: number | undefined;
    onDelete?: (id: number) => void;
    myBubbleColor?: string;
    isLoading?: boolean;
};

export default function MessageList({
    messages,
    currentUserId,
    onDelete,
    myBubbleColor = 'bg-[#534AB7]',
    isLoading = false,
}: Props) {
    
    //一番下に自動スクロールするための参照
    const bottomRef = useRef<HTMLDivElement>(null);

    //メッセージが増えたら一番下にスクロール
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── 読み込み中 ──
    if (isLoading) {
        return (
            <p className="text-center text-gray-400 text-sm py-8 animate-pulse">
                読み込み中...
            </p>
        );
    }


    // ── メッセージが0件の時 ──
    if (messages.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-3">💬</p>
                <p className="text-sm">まだメッセージがありません</p>
                <p className="text-xs mt-1">やり取りをここで行えます</p>
            </div>
        );
    }


    return (
        <div>

            {messages.map((msg) => {
                //自分が送ったメッセージかどうか
                const isMine = msg.sender_id === currentUserId;

                return (
                    <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'} group mb-4`}
                    >
                        <div className={`max-w-[75%] flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>

                            <div className="flex items-center gap-2">
                            {/* 送り主の名前（相手のメッセージにだけ表示 */}
                            {!isMine && (
                                <span className="text-[11px] text-gray-500 px-1">
                                    {msg.sender.name}
                                </span>
                                )}
                                
                                

                            {/* メッセージ本文 */}
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isMine
                                ? `${myBubbleColor} text-white rounded-br-sm`
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                }`}>
                                {msg.content}
                                </div>
                            </div>
                            

                            {/* 送信時刻 */}
                            <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] text-gray-400 px-1">
                                {new Date(msg.created_at).toLocaleString('ja-JP', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                </span>
                                {/* 自分のメッセージの時だけ、時刻の右にゴミ箱を出す */}
                                {isMine && onDelete && (
                                    <button
                                        onClick={() => onDelete(msg.id)}
                                        className=" text-gray-400 hover:text-red-500 transition-all"
                                        title="削除"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                );
            })}

            {/* 一番下の目印 */}
            <div ref={bottomRef} />
        </div>
    );
}