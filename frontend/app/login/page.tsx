
// app/login/page.tsx


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";



export default function LoginPage() {
    

    // ── 状態（State）の定義 ──────────────────────────
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    


    // ── フック（Hook）の準備 ──────────────────────────
    const { login } = useAuth();
    const router = useRouter();


    // ── フォーム送信の処理 ──────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({}); // 前のエラーをクリア
        setGeneralError(null);
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            // Laravelのバリデーションエラー（422）の場合
            if (err.response?.status === 422) {
                setFieldErrors(err.response.data.errors);
            } else {
                setGeneralError(err.response?.data?.message || "ログインに失敗しました");
            }
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className='min-h-screen flex flex-col bg-gray-50'>
            <Header />

            <main className='flex-1 flex items-center justify-center px-4 py-12'>
            <div className='w-full max-w-md'>

                {/* ヘッダー */}
                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-bold text-gray-800'>ログイン</h1>
                    <p className='text-gray-500 mt-2'>JobMatch AI へようこそ</p>
                </div>

                {/* カード */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>

                        {/* 1. 全体エラー（サーバーダウンなど）を表示 */}
                        {generalError && (
                            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>
                                {generalError}
                            </div>
                        )}

                    {/* フォーム */}
                    <form onSubmit={handleSubmit} className='space-y-5'>

                        {/* メールアドレス欄 */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent text-gray-800'
                                placeholder='you@example.com'
                                />
                            {fieldErrors.email && (
                                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
                                )}
                        </div>


                        {/* パスワード欄 */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>パスワード</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent text-gray-800'
                                placeholder='●●●●●●●●'
                                />
                                
                                {fieldErrors.password && (
                                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password[0]}</p>
                                )}
                        </div>

                        {/* ログインボタン */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-[#534AB7] text-white font-medium rounded-full hover:bg-[#4338a3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {loading ? '処理中...' : 'ログイン'}
                        </button>
                    </form>

                    {/* ── 登録ページへのリンク ── */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        アカウントをお持ちでない方は{' '}
                        {/* ↑ {' '} = スペースを JSX 内で入れる書き方 */}
                        <Link
                            href="/register"
                            className="text-[#534AB7] hover:underline font-medium"
                        >
                            新規登録
                        </Link>
                    </p>
                </div>
                </div>
            </main>
            <Footer />
        </div>
    );

}
