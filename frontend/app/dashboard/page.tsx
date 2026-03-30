// app/dashboard/page.tsx

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import JobSeekerDashboard from "@/components/dashboard/JobSeekerDashboard";
import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";




export default function DashboardPage() {
    const router = useRouter();
    const { user, token, isLoading } = useAuth();
    // useAuth() から3つの値を取り出している
    // user     = ログイン中のユーザー情報（名前・role など）
    // token    = ログイン証明書（APIに送るやつ）
    // isLoading = まだ確認中かどうか（true=確認中、false=確認完了）


    useEffect(() => {
        if (isLoading) return;

        if (!token) {
            //tokenがなかったら＝ログインしてない
            router.push('/login');
        }
    }, [isLoading, token, router]);


    // ---表示部分---

    if (isLoading) {
        // まだ確認中の時はローディング画面を表示
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // user が null（ユーザー情報がない）場合も何も表示しない
        // useEffectで /login に飛ばす処理が走るので、一瞬だけnullになる
        return null
    }


    // --- role　によって表示を切り替える ---
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Header />

            {/* //user.role が　 'jobseeker' なら求職者ダッシュボードを表示 */}
            {user.role === 'jobseeker' && (
                <JobSeekerDashboard user={user} />
            )}


            {/* user.role が　'company' なら企業ダッシュボードを表示 */}
            {user.role === 'company' && (
                <div>
                    <CompanyDashboard user={ user} />
                </div>
            )}


            {/* user.role が　'admin' なら管理者ダッシュボードを表示 */}
            {user.role === 'admin' && (
                <div>
                    <AdminDashboard user={user} />
                </div>
            )}



        </div>
    )
}