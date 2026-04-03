'use client';

import { useState, useEffect } from 'react';
import { myPageApi } from '@/lib/api';
import { Application, MatchPreview } from '@/types';
import Link from 'next/link';
import ProfileForm from '../profile/ProfileForm';

// ============================================
// 型定義とスタイル対応表
// ============================================
type TabKey = 'applications' | 'previews' | 'jobs' | 'profile';

// ===== 変換テーブルを追加 =====
const STATUS_LABEL: Record<string, string> = {
    'applying':  '応募済み',
    'screening': '書類選考',
    'interview': '面接',
    'offered':   '内定',
    'rejected':  '不採用',
};

const STATUS_STYLE: Record<string, string> = {
    'applying':  'bg-blue-50   text-blue-800',
    'screening': 'bg-amber-50  text-amber-800',
    'interview': 'bg-[#EEEDFE] text-[#3C3489]',
    'offered':   'bg-[#E1F5EE] text-[#085041]',
    'rejected':  'bg-red-50    text-red-800',
};

// スコアの色（丸いバッジ用）
function getScoreBg(score: number | null): string {
    if (score === null) return 'bg-gray-100 text-gray-500';
    if (score >= 70)   return 'bg-[#E1F5EE] text-[#085041]';
    if (score >= 40)   return 'bg-[#FAEEDA] text-[#633806]';
    return                    'bg-[#FCEBEB] text-[#791F1F]';
}

// 引用線の色
function getReasonBorder(score: number | null): string {
    if (score === null) return 'border-gray-400';
    if (score >= 70)   return 'border-[#1D9E75]';
    if (score >= 40)   return 'border-[#BA7517]';
    return                    'border-[#A32D2D]';
}

// ============================================
// 子コンポーネント: ApplicationCard
// ============================================
interface JobCardProps {
    id: number;
    title: string;
    companyName?: string;
    location?: string;
    salary_min?: number | null;
    salary_max?: number | null;
    required_skills?: string[];
    score: number | null;
    reason?: string | null;
    status?: Application['status'];
    appliedAt?: string;
}

function ApplicationCard({
    id,title, companyName, location, salary_min, salary_max,
    required_skills, score, reason, status, appliedAt
}: JobCardProps) {
    return (
        <Link href={`/messages/${id}`} className='block group'>
        {/* style の代わりに className="bg-white border..." を使用 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">

                {/* 右側テキスト */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-gray-800">{title}</span>
                        {status && (
                            <span className={`text-[12px] font-bold px-3 py-1 tracking-wider rounded-full ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {STATUS_LABEL[status] ?? status}
                            </span>
                            )}
                            
                    </div>

                    <div className="text-[12px] text-gray-500 mb-2">
                        {[companyName, location, salary_min ? `${salary_min}〜${salary_max}万円` : null]
                            .filter(Boolean).join(' | ')}
                    </div>

                    {/* スキルタグ */}
                    {required_skills && required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {required_skills.map(skill => (
                                <span key={skill} className="bg-[#EEEDFE] text-[#3C3489] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* AIマッチ理由 */}
                    {reason && (
                        <div>
                            <span className='text-xs text-gray-500'>AI診断内容</span> 
                        <div className={`text-[12px] text-gray-600 bg-gray-50 p-2.5 rounded-r-lg border-l-4 ${getReasonBorder(score)}`}>
                            {reason}
                            </div>
                        </div>
                    )}

                    {appliedAt && (
                        <div className="text-[10px] text-gray-400 mt-2">
                            応募日: {new Date(appliedAt).toLocaleDateString('ja-JP')}
                        </div>
                        )}
                   <span className="flex justify-end text-[12px] text-[#534AB7] font-bold  group-hover:opacity-100 ">
                                メッセージを送る ✉️
                            </span>
                </div>
                </div>
                
            </div>
        </Link>
    );
}

// ============================================
// メインコンポーネント: MyPageDashboard
// ============================================
export default function MyPageDashboard() {
    const [activeTab, setActiveTab] = useState<TabKey>('applications');
    const [applications, setApplications] = useState<Application[]>([]);
    const [previews, setPreviews] = useState<MatchPreview[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [loadingPreviews, setLoadingPreviews] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoadingApps(true);
            setLoadingPreviews(true);
            try {
                const [appRes, previewRes] = await Promise.all([
                    myPageApi.getApplications(),
                    myPageApi.getMatchPreviews()
                ]);
                setApplications(appRes.data.applications ?? []);
                setPreviews(previewRes.data.previews ?? []);
            } catch (e) { console.error('データの取得に失敗しました',e); }
            finally {
                setLoadingApps(false);
                setLoadingPreviews(false);
            }
        };
        fetchAllData();
    }, []);


   

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">

            {/* ヘッダー行：タイトルとボタンを両端配置 */}
            <div className="flex flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">マイページ</h1>
                    <p className="text-sm text-gray-500">応募履歴・AI マッチング結果を確認できます</p>
                </div>
                <Link 
                    href="/dashboard" 
                    className="bg-[#534AB7] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#423a94] transition-all shadow-md shrink-0"
                >
                    ダッシュボードへ戻る
                </Link>
            </div>

            

            {/* タブ切替 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {([
                    { key: 'applications', label: `応募済み (${applications.length})` },
                    { key: 'previews',     label: `AI診断 (${previews.length})` },
                    { key: 'profile', label: 'プロフィール編集'},
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                            activeTab === tab.key 
                            ? 'bg-[#534AB7] text-white border-[#534AB7]' 
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* コンテンツエリア */}
            <div className="pb-20">
                {activeTab === 'applications' && (
                    loadingApps ? <Loader /> : applications.length === 0 ? <EmptyState onAction={() => setActiveTab('jobs')} /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {applications.map(app => (
                                <ApplicationCard
                                    key={app.id}
                                    id={app.id}
                                    title={app.job_posting?.title ?? '(求人情報なし)'}
                                    companyName={app.job_posting?.company?.name}
                                    location={app.job_posting?.location}
                                    salary_min={app.job_posting?.salary_min}
                                    salary_max={app.job_posting?.salary_max}
                                    required_skills={app.job_posting?.required_skills}
                                    score={app.match_score ?? app.job_posting?.skill_score ?? null}
                                    reason={app.match_reason}
                                    status={app.status}
                                    appliedAt={app.created_at}
                                />
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'previews' && (
                    loadingPreviews ? <Loader /> : previews.length === 0 ? <p className="text-center py-10 text-gray-400 text-sm">診断データがありません</p> : (
                        previews.map(preview => (
                            <ApplicationCard
                                key={preview.id}
                                id={preview.id}
                                title={preview.job_posting?.title ?? '(求人情報なし)'}
                                companyName={preview.job_posting?.company?.name}
                                location={preview.job_posting?.location}
                                salary_min={preview.job_posting?.salary_min}
                                salary_max={preview.job_posting?.salary_max}
                                required_skills={preview.job_posting?.required_skills}
                                score={preview.match_score ?? preview.job_posting?.skill_score ?? null}
                                reason={preview.match_reason}
                            />
                        ))
                    )
                )}

                {activeTab === 'jobs' && (
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-sm border border-blue-100">
                        求人検索はダッシュボードから行えます。
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <ProfileForm onSaved={()=>setActiveTab('applications')} />
                    </div>
                )}
            </div>
        </div>
    );
}

// 共通パーツ
const Loader = () => <p className="text-center py-10 text-gray-400 animate-pulse">読み込み中...</p>;
const EmptyState = ({ onAction }: { onAction: () => void }) => (
    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-sm mb-4">まだ応募した求人がありません</p>
        <Link 
            href="/dashboard" 
            className="inline-block bg-[#534AB7] text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-[#423a94] transition-all shadow-lg hover:shadow-[#534AB7]/20"
        >
            🚀 求人一覧を探しに行く
        </Link>
    </div>
);