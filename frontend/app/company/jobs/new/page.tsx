// app/company/jobs/new/page.tsx
// 「求人を新規投稿する」ページ

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/common/Header';
import JobForm from '@/components/company/JobForm';

export default function NewJobPage() {
    const router = useRouter();
    const { user, token, isLoading } = useAuth();

    // ガード処理：企業ユーザー以外はアクセス拒否
    useEffect(() => {
        if (isLoading) return;
        // まだ確認中なら何もしない

        if (!token) {
            router.push('/login');
            // 未ログインならログインページへ
            return;
        }

        if (user?.role !== 'company') {
            router.push('/dashboard');
            // 企業ユーザー以外はダッシュボードへ追い返す
        }
    }, [isLoading, token, user, router]);

    if (isLoading || !user) {
        // ローディング中 or ユーザー情報なしは何も表示しない
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-10 h-10 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* パンくずリスト（今どのページにいるか表示） */}
                <nav className="text-sm text-gray-400 mb-4">
                    <span>ダッシュボード</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-600">求人を投稿</span>
                </nav>
                <JobForm />
                {/* jobを渡さない = 新規作成モード */}
            </div>
        </div>
    );
}