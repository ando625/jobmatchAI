
// app/register/page.tsx


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';


type UserRole = 'jobseeker' | 'company';


export default function RegisterPage() {
    

    // ── 状態（State）の定義 ──────────────────────────
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [role, setRole] = useState<UserRole>('jobseeker');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    


    // ── フック（Hook）の準備 ──────────────────────────
    const { register } = useAuth();
    const router = useRouter();


    // ── フォーム送信の処理 ──────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({}); // 魔法をかける前に古いエラーを消す
        setGeneralError(null);
        setLoading(true);

        // 送信する前にフロント側でチェックする
        if (password !== passwordConfirm) {
            setFieldErrors({ password: ['パスワードが一致しません'] });
            setLoading(false);
            return;
        }

        
        

        try {
            await register(name, email, password, role, passwordConfirm);
        } catch (err: any) {
            // Laravelのバリデーションエラー(422)が返ってきた場合
            if (err.response?.status === 422) {
                setFieldErrors(err.response.data.errors);
            } else {
                setGeneralError(err.response?.data?.message || '登録に失敗しました');
            }
        } finally {
            setLoading(false);
        }
    }



    return (
        
        <div className='min-h-screen flex flex-col bg-gray-50'>

                <Header />

                {/*　メイン */}
                <main className='flex-1 flex items-center justify-center px-4 py-12'>
                <div className='w-full max-w-md'>

                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-bold text-gray-800'>新規登録</h1>
                    <p className='text-gray-500 mt-2'>JobMatch AI にアカウントを作成</p>
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

                        {/* 氏名欄 */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>氏名</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent text-gray-800"
                                placeholder="山田 太郎"
                                />
                                
                            {fieldErrors.name && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.name[0]}</p>
                            )}
                        </div>

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
                        {/* パスワード確認欄 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                パスワード（確認）
                            </label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent text-gray-800"
                                placeholder='●●●●●●●●'
                            />
                        </div>

                        {/* 役割(role)選択 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">登録区分</label>

                            <div className='grid grig-cols-2 gap-3'>
                                <button
                                    type="button"
                                    onClick={() => setRole('jobseeker')}
                                    className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-colors ${
                                        role === 'jobseeker'
                                        ? 'border-[#534AB7] bg-[#EEEDFE] text-[#534AB7]'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    求職者
                                </button>

                                {/* 企業ボタン */}
                                <button
                                    type="button"
                                    onClick={() => setRole('company')}
                                    className={`py-3 px-4 border-2 rounded-xl text-sm font-medium transition-colors ${
                                        role === 'company'
                                        ? 'border-[#534AB7] bg-[#EEEDFE] text-[#534AB7]'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    企業
                                </button>
                            </div>

                            <p className='mt-2 text-xs text-gray-400'>※ 登録後の変更はできません</p>
                        </div>

                        {/* 登録ボタン */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-[#534AB7] text-white font-medium rounded-full hover:bg-[#4338a3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {loading ? '処理中...' : 'アカウントを作成'}
                        </button>
                    </form>

                    {/* ── ログインページへのリンク ── */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        アカウントをお持ちでない方は{' '}
                        {/* ↑ {' '} = スペースを JSX 内で入れる書き方 */}
                        <Link
                            href="/login"
                            className="text-[#534AB7] hover:underline font-medium"
                        >
                            ログイン
                        </Link>
                    </p>
                </div>
            </div>
            </main>
            <Footer />
        </div>

    );

}
