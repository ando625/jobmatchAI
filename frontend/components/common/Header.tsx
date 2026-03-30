
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


export function Header() {
    
    // useAuth() = AuthContext から { user, token, logout, ... } を取り出す
    const { user, logout, isLoading } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* ロゴ */}
                <Link
                    href="/"
                    className="flex gap-1 text-xl font-bold text-[#534AB7] hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/AI-icon2.png"
                        alt="jobMatch AI Logo"
                        width={40}
                        height={40}
                        style={{ width: '40px', height: 'auto' }}
                    />
                    JobMatch AI
                </Link>

                {/* ナビゲーション */}
                <nav>
                    {isLoading ? null : user ? (
                        <>
                            <span className="text-sm text-gray-600">{user.name}</span>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 text-sm text-gray-600 hover:text-[#534AB7] transition-colors"
                            >ホーム
                            </Link>
                            <button onClick={logout} className="px-4 py-2 text-sm text-gray-600 hover:text-red-500 transition-colors">
                                ログアウト
                            </button>
                        </>
                    ) : (
                        //user が null ＝　未ログイン
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm text-gray-600 hover:text-[#534AB7] transition-colors"
                            >
                                ログイン
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2 text-sm text-white bg-[#534AB7] rounded-full hover:bg-[#3C3489] transition-colors"
                            >
                                無料で登録
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}