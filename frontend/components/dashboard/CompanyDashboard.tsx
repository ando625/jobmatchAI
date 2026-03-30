
// frontend/components/dashboard/CompanyDashboard.tsx

'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { User, JobWithCount, Applicant, JobWithApplicants } from "@/types";
import { companyApi } from "@/lib/api";
import { StatCard } from "@/components/common/StatCard"; 
import { Building2, Mail, Zap, ChevronDown, ChevronUp } from "lucide-react";

type Props = { user: User };


// ===== 英語 → 日本語 の変換テーブル =====
    const STATUS_LABEL: Record<string, string> = {
        'applying': '応募中',
        'screening': '書類選考',
        'interview': '面接',
        'offered': '内定',
        'rejected': '不採用',
    };
    // Record<string, string> = 「キーも値も文字列のオブジェクト」
    // DBから英語で来たデータを、画面表示用の日本語に変換する辞書

    // ===== スタイル対応表も英語キーに変更 =====
    const STATUS_STYLE: Record<string, string> = {
        'applying': 'bg-blue-50   text-blue-800',
        'screening': 'bg-amber-50  text-amber-800',
        'interview': 'bg-[#EEEDFE] text-[#3C3489]',
        'offered': 'bg-[#E1F5EE] text-[#085041]',
        'rejected': 'bg-red-50    text-red-800',
    };




export default function CompanyDashboard({ user }: Props) {
    // データの入れ物（State）
    // 求人一覧を保存する。型を「応募者リストも持てる形」に変更
    const [jobs, setJobs] = useState<JobWithApplicants[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    //今どの求人の「応募者リスト」を開いているか（ID）を保存する。nullなら全部閉じている
    const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

    // 求人一覧を読み込む（ページを開いた時）
    const fetchMyJobs = async () => {
        setIsLoading(true);
        try {
            const res = await companyApi.getMyJobs();
            // 取得した求人に、最初は空の応募者リスト（applicants: []）をくっつけて保存
            setJobs(res.data.data.map((j: any) => ({ ...j, applicants: [] })));
        } catch (e) {
            console.error("求人取得失敗:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    // 【新機能】求人をクリックして応募者を表示する
    const handleExpand = async (jobId: number) => {
        // すでに開いているものをもう一度クリックしたら閉じる
        if (expandedJobId === jobId) {
            setExpandedJobId(null);
            return;
        }
        // クリックした求人のIDを「開いている状態」にする
        setExpandedJobId(jobId);

        // その求人の応募者データをまだ持っていなければ、APIに獲りに行く
        const targetJob = jobs.find(j => j.id === jobId);
        if (targetJob && (!targetJob.applicants || targetJob.applicants.length === 0)) {
            try {
                // Laravelで作った「応募者一覧取得API」を叩く
                const res = await companyApi.getApplicants(jobId); 
                // 取得した応募者データを、該当する求人の中に入れ直す
                setJobs(prev => prev.map(j => 
                    j.id === jobId ? { ...j, applicants: res.data.applicants } : j
                ));
            } catch (e) {
                console.error("応募者取得失敗:", e);
            }
        }
    };

    // 【新機能】応募者のステータス（選考状況）を更新する
    const handleStatusUpdate = async (applicationId: number, newStatus: string, jobId: number) => {
        try {
            // Laravelの「ステータス更新API」を叩く
            await companyApi.updateApplicationStatus(applicationId, newStatus);
            // 画面上の表示も、リロードなしで即座に書き換える
            setJobs(prev => prev.map(j => {
                if (j.id === jobId && j.applicants) {
                    return {
                        ...j,
                        applicants: j.applicants.map(a => 
                            a.id === applicationId ? { ...a, status: newStatus as any } : a
                        )
                    };
                }
                return j;
            }));
        } catch (e) {
            alert("更新に失敗しました");
        }
    };

    // 統計の計算（ここはそのまま）
    const stats = useMemo(() => {
        const totalApplications = jobs.reduce((sum, j) => sum + (j.applications_count || 0), 0);
        const openJobs = jobs.filter((j) => j.status === "open").length;
        const closedJobs = jobs.filter((j) => j.status === "closed").length;
        return { totalApplications, openJobs, closedJobs };
    }, [jobs]);


    


    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* 挨拶カード */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h1 className="flex items-center gap-3 text-2xl font-bold text-[#1D9E75] mb-1">
                    ようこそ、{user.name} さん <Building2 size={25} />
                </h1>
                <p className="text-gray-500 font-medium">求人の管理・応募者の確認ができます</p>
            </div>

            {/* 統計カードセクション */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard label="掲載中の求人" value={`${stats.openJobs}件`} color="#1D9E75" />
                <StatCard label="非公開の求人" value={`${stats.closedJobs}件`} color="#888" />
                <StatCard label="総応募者数" value={`${stats.totalApplications}件`} color="#534AB7" />
            </div>

            {/* 求人管理エリア */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="font-bold text-gray-800">求人一覧（クリックで応募者を表示）</h2>
                    <Link href="/company/jobs/new" className="bg-[#1D9E75] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#0F6E56]">
                        ＋ 新規求人を投稿
                    </Link>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center text-gray-400">読み込み中...</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex flex-col">
                                {/* 各求人の行（クリックすると handleExpand が動く） */}
                                <div 
                                    onClick={() => handleExpand(job.id)} 
                                    className="cursor-pointer hover:bg-gray-50 transition-all"
                                >
                                    <CompanyJobRow 
                                        job={job} 
                                        isExpanded={expandedJobId === job.id} 
                                        onToggle={async (id) => {
                                            // ステータス（公開/非公開）の切り替え
                                            const res = await companyApi.toggleJobStatus(id);
                                            setJobs(prev => prev.map(j => j.id === id ? { ...j, status: res.data.data.status } : j));
                                        }} 
                                    />
                                </div>

                                {/* 応募者がいればここにリストを表示する */}
                                {expandedJobId === job.id && (
                                    <div className="bg-gray-50/70 border-t border-gray-100 p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                            <h3 className="text-sm font-black text-[#534AB7] flex items-center gap-2 italic">
                                                <Zap size={16} fill="#534AB7" /> 応募者リスト
                                            </h3>
                                            <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">
                                                ID: {job.id} の応募者
                                            </span>
                                        </div>

                                        {job.applicants && job.applicants.length > 0 ? (
                                            <div className="grid gap-3">
                                                {job.applicants.map(applicant => (
                                                    <ApplicantItem 
                                                        key={applicant.id} 
                                                        applicant={applicant} 
                                                        jobId={job.id}
                                                        onStatusChange={handleStatusUpdate}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">まだ応募者がいません。</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── 子コンポーネント：求人の1行 ──
function CompanyJobRow({ job, isExpanded, onToggle }: { job: JobWithCount, isExpanded: boolean, onToggle: (id: number) => void }) {
    return (
        <div className="px-6 py-5 flex items-center gap-4">
            {/* 公開/非公開バッジ */}
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase shrink-0 ${job.status === "open" ? "bg-[#E1F5EE] text-[#085041]" : "bg-gray-100 text-gray-500"}`}>
                {job.status === "open" ? "公開中" : "非公開"}
            </span>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-base">{job.title}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{job.location}</p>
            </div>
            {/* 応募者数カウンター */}
            <div className="text-center shrink-0 px-6">
                <span className="text-xl font-black text-[#534AB7] block leading-none">{job.applications_count}</span>
                <p className="text-[9px] text-gray-400 mt-1 uppercase font-black">応募</p>
            </div>
            {/* 開閉アイコン（どっちを向いているか） */}
            <div className="text-gray-300">
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {/* 操作ボタン */}
            <div className="flex items-center gap-2 shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
                
                {/* 「編集」ボタン */}
                <Link 
                    href={`/company/jobs/${job.id}/edit`} 
                    className="text-[11px] font-bold bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                    編集
                </Link>

                {/* ステータス切替ボタン */}
                <button 
                    onClick={() => onToggle(job.id)} 
                    className="text-[11px] font-bold border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    ステータス切替
                </button>
            </div>
        </div>
    );
}

// ── 子コンポーネント：応募者1人分のカード ──
function ApplicantItem({ applicant, jobId, onStatusChange }: { applicant: Applicant, jobId: number, onStatusChange: (id: number, status: string, jobId: number) => void }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#534AB7]/30 transition-colors">
            <div className="flex items-center gap-4">
                {/* 虹色のアイコンをイメージした装飾 */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {applicant.user.name.substring(0, 1)}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800 text-sm">{applicant.user.name}</p>
                        {applicant.match_score && (
                            <span className="bg-[#EEEDFE] text-[#534AB7] text-[9px] font-black px-1.5 py-0.5 rounded">
                                マッチ度 {applicant.match_score}%
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 font-medium italic">
                        <Mail size={10} /> {applicant.user.email}
                    </p>
                </div>
            </div>

            {/* ステータス変更セレクトボックス */}
            <div className="flex items-center gap-3">
                <select
                    value={applicant.status}
                    onChange={(e) =>
                        onStatusChange(applicant.id, e.target.value, jobId)
                    }
                    className={`text-xs px-3 py-1 rounded-full border-0 font-medium cursor-pointer ${
                        STATUS_STYLE[applicant.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {/* ↓ value は英語（DBに送る値）・表示テキストは日本語 */}
                    <option value="applying">応募中</option>
                    <option value="screening">書類選考</option>
                    <option value="interview">面接</option>
                    <option value="offered">内定</option>
                    <option value="rejected">不採用</option>
                </select>
                <Link href={`/company/applicants/${applicant.id}`} className="text-[11px] font-black text-[#1D9E75] underline">
                    詳細を見る
                </Link>
            </div>
        </div>
    );
}