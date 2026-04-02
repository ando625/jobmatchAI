
"use client";

// ===== components/messages/MessageInput.tsx =====
// メッセージ入力エリアの共通部品
// 求職者ページ・企業ページ両方で使い回す

import { Send } from "lucide-react";

type Props = {
    content: string;                          // 入力中の文字
    onChange: (value: string) => void;        // 文字が変わった時
    onSend: () => void;                       // 送信ボタンを押した時
    sending?: boolean;                        // 送信中フラグ
    sendButtonColor?: string;                 // 送信ボタンの色（デフォルト:紫）
    sendButtonHoverColor?: string;            // 送信ボタンのホバー色
    focusBorderColor?: string;                // inputのフォーカス枠色

}

export default function MessageInput({
    content,
    onChange,
    onSend,
    sending = false,
    sendButtonColor = 'bg-[#534AB7]',
    sendButtonHoverColor = 'hover:bg-[#3c3489]',
    focusBorderColor='focus:border-[#534AB7]',
}: Props) {
    
    //メッセージ送信
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex items-end gap-3">
            <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力...(Enterで送信、Shift+Enterで改行)"
                rows={2}
                className={`flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors bg-white ${focusBorderColor}`}
            ></textarea>
            <button
                onClick={onSend}
                disabled={sending || !content.trim()}
                className={`p-3 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${sendButtonColor} ${sendButtonHoverColor}`}
            >
                <Send size={20} />

            </button>
        </div>
    )
}