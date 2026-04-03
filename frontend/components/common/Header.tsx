
// ===== components/common/Header.tsx =====
// 全ページで共通のヘッダー部品
//
// ポイント：ログイン状態によって表示を切り替える
// → ログイン済み = 「ダッシュボード」「ログアウト」
// → 未ログイン  = 「ログイン」「無料で登録」

'use client';

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { Home, LogOut, User, ChevronDown, Bell } from "lucide-react";
import apiClient from "@/lib/axios";
import { useEffect, useState } from "react";
import { messageApi } from "@/lib/api";


export function Header() {
    
    // useAuth() = AuthContext から { user, token, logout, ... } を取り出す
    const { user, logout, isLoading } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    //未読数を定期的にチェック（１分ごと）
    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            try {
                const res = await messageApi.getUnreadCount();
                setUnreadCount(res.data.unread_count);
            } catch (e) {
                console.error('未読数取得失敗', e);
            }
        };
        fetchUnread();
        const timer = setInterval(fetchUnread, 30000);
        return () => clearInterval(timer);
    }, [user]);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* ロゴ */}
                <Link
                    href="/"
                    className="flex gap-1 items-center hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/AI-icon2.png"
                        alt="jobMatch AI Logo"
                        width={40}
                        height={40}
                        style={{ width: '40px', height: 'auto' }}
                        className="w-8 h-8 sm:w-10 sm:h-10"
                    />
                    <span className="text-lg sm:text-xl font-bold text-[#534AB7] truncate max-w-[120px] sm:max-w-none">
                        JobMatch AI
                    </span>
                </Link>

                {/* ナビゲーションエリア */}
                <nav className="flex items-center gap-2">
                    {isLoading ? (
                        <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full" />
                    ) : user ? (
                            <div className="flex items-center gap-3">
                                {/* ベルマーク通知ボタン */}
                            <Link
                                href={
                                        user.role === 'company' 
                                            ? '/dashboard'
                                            : 'my-page'
                                    }
                                className="relative p-2 text-gray-500 hover:text-[#534AB7] hover:bg-[#EEEDFE] rounded-full transition-all"
                                title="通知"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                                </Link>
                                
                            {/* ホームリンク：アイコン付き */}
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gray-600 hover:text-[#534AB7] hover:bg-[#EEEDFE] rounded-lg transition-all"
                            >
                                <Home size={18} />
                                <span className="hidden sm:inline">ホーム</span>
                            </Link>

                            {/* 区切り線 */}
                            <div className="w-[1px] h-4 bg-gray-200 mx-1" />

                            {/* ユーザー情報：バッジ風 */}
                            <div className="flex items-center gap-2 pl-2 pr-1 py-1 bg-gray-50 border border-gray-100 rounded-full">
                                <div className="w-7 h-7 bg-[#534AB7] rounded-full flex items-center justify-center text-white shrink-0">
                                    <User size={14} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 hidden mr-1 sm:inline ">
                                    {user.name}
                                </span>
                            </div>

                            {/* ログアウト：ボタン風 */}
                            <button 
                                onClick={logout} 
                                className="flex justify-baseline gap-1 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                    <LogOut size={18} />
                                    <span className="hidden md:inline text-sm font-bold">ログアウト</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm font-bold text-gray-600 hover:text-[#534AB7] transition-colors"
                            >
                                ログイン
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2.5 text-sm font-bold text-white bg-[#534AB7] rounded-full hover:bg-[#3C3489] shadow-md shadow-[#534AB7]/20 transition-all hover:-translate-y-0.5"
                            >
                                無料で登録
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}