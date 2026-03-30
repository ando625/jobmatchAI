// app/company/jobs/[id]/edit/page.tsx
// 「求人を編集する」ページ
// [id] = URLの数字部分（例：/company/jobs/5/edit の "5"）

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// useParams = URLの [id] 部分を取得する機能
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/common/Header';
import JobForm from '@/components/company/JobForm';
import { companyApi } from '@/lib/api';
import { Job } from '@/types';

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    // params = URLのパラメータオブジェクト
    // 例：/company/jobs/5/edit なら params = { id: '5' }

    const id = Number(params.id);
    // params.id は文字列なので Number() で数値に変換

    const { user, token, isLoading: authLoading } = useAuth();

    const [job, setJob] = useState<Job | null>(null);
    const [jobLoading, setJobLoading] = useState(true);

    // 認証ガード
    useEffect(() => {
        if (authLoading) return;
        if (!token) { router.push('/login'); return; }
        if (user?.role !== 'company') { router.push('/dashboard'); }
    }, [authLoading, token, user, router]);

    // 求人データを取得する
    useEffect(() => {
        if (!token || authLoading) return;
        // まだ認証確認中、またはトークンがなければ何もしない

        const fetchJob = async () => {
            try {
                const res = await companyApi.getJobById(id);
                // 編集対象の求人を取得
                setJob(res.data.data);
            } catch {
                // 取得失敗（例：他社の求人にアクセスしようとした）
                router.push('/dashboard');
                // ダッシュボードに戻す
            } finally {
                setJobLoading(false);
            }
        };
        fetchJob();
    }, [id, token, authLoading, router]);

    if (authLoading || jobLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-10 h-10 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) return null;
    // jobが取得できなかった（ガードで redirect される）

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <nav className="text-sm text-gray-400 mb-4">
                    <span>ダッシュボード</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-600">求人を編集</span>
                </nav>
                <JobForm job={job} />
                {/* job を渡す = 編集モードで起動 */}
            </div>
        </div>
    );
}