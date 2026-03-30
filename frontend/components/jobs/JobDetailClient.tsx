// components/jobs/JobDetailClient.tsx
// 「求人詳細ページの中でログイン状態を見て表示を変える部分」
// なぜ分けるの？→ SSRのページ内でログイン状態（useAuth）を使いたいから
// use client のコンポーネントを切り出す「クライアントアイランド」パターン

'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Job } from '@/types';

type Props = { job: Job };

export default function JobDetailClient({ job }: Props) {
    const { user } = useAuth();
    // ログイン中のユーザー情報を取得

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            {user ? (
                // ログイン済みの場合
                user.role === 'jobseeker' ? (
                    // 求職者なら「応募する」ボタン
                    job.status === 'open' ? (
                        <button className="bg-[#534AB7] text-white px-10 py-3 rounded-full font-bold text-base hover:bg-[#3C3489] transition-colors">
                            この求人に応募する
                        </button>
                    ) : (
                        // 募集終了の場合
                        <p className="text-gray-400 font-medium">この求人の募集は終了しました</p>
                    )
                ) : (
                    // 企業・管理者はボタン非表示（応募できない）
                    <p className="text-gray-400 text-sm">求職者アカウントで応募できます</p>
                )
            ) : (
                // 未ログインの場合
                <div>
                    <p className="text-gray-600 mb-4">応募するにはアカウントが必要です</p>
                    <Link
                        href="/register"
                        className="bg-[#534AB7] text-white px-10 py-3 rounded-full font-bold text-base hover:bg-[#3C3489] transition-colors inline-block"
                    >
                        登録して応募する
                    </Link>
                    <p className="text-sm text-gray-400 mt-3">
                        すでにアカウントをお持ちの方は
                        <Link href="/login" className="text-[#534AB7] font-medium ml-1">
                            こちらからログイン
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
}