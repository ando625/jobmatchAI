// components/dashboard/JobSeekerDashboard.tsx

'use client';

import { useState, useEffect } from "react";
import { User, Job, MatchPreview } from "@/types";
import { jobApi } from "@/lib/api";
import { JobCard } from "@/components/jobs/JobCard";
import { StatCard } from "@/components/common/StatCard";
import { Hand, User as UserIcon } from "lucide-react";
import JobDetailModal from "@/components/jobs/JobDetailModal";
import Link from "next/link";
import apiClient from "@/lib/axios";


// スキルフィルターの選択肢（よく使うものを並べる）
const SKILL_FILTERS = [
    'すべて',
    'React',
    'Laravel',
    'Python',
    'TypeScript',
    'Figma',
    'SQL',
]



type Props = {
    user: User;
}

export default function JobSeekerDashboard({ user }: Props) {
    
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState("");
    const [skill, setSkill] = useState("すべて");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [stats, setStats] = useState({ matched: 0, applied: 0, viewed: 0 });
    // matched = マッチ件数、applied = 応募件数、viewed = 閲覧済み件数
    const [previews, setPreviews] = useState<MatchPreview[]>([]);

    // ユーザーが入力した条件に合わせてサーバーから求人データを取ってくる 応募件数も一緒に
    const fetchJobs = async (searchWord: string, selectedSkill: string) => {
        setIsLoading(true);

        try {
            const params: { search?: string; skill?: string } = {};

            if (searchWord) params.search = searchWord;
            if (selectedSkill !== 'すべて') params.skill = selectedSkill;
            
            //求人取得と応募件数取得を同時に実行
            const [jobsRes, appsRes, previewsRes] = await Promise.all([
                jobApi.getAll(params),
                apiClient.get('/applications'),
                apiClient.get('/match-previews')
            ]);

            setJobs(jobsRes.data.data.data);
            setPreviews(previewsRes.data.previews ?? []);

            const appCount = appsRes.data.applications?.length ?? 0;
            const previewCount = previewsRes.data.previews?.length ?? 0;

            setStats(prev => ({
                matched: previewCount,
                applied: appCount,
                viewed: jobsRes.data.data.total,
            }));

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchJobs('', 'すべて') }, []);

    const handleSkillChange = (s: string) => {
        setSkill(s)
        fetchJobs(search, s)
        //スキルタブをクリックしたら即座に再検索
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* ✅ 追加: モーダル（selectedJob がある時だけ表示） */}
            {selectedJob && (
                <div key={selectedJob.id}> {/* keyを付けることで「新しい求人だ！」とReactに分からせる */}
                    <JobDetailModal
                        job={selectedJob}
                        onClose={() => {
                            console.log("閉じるボタンが押されました");
                            setSelectedJob(null);
                        }}
                    />
                </div>
            )}
            

            {/* 挨拶カード */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
                    {/* 左側：挨拶テキスト */}
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-[#534AB7] mb-1">
                            おかえりなさい、{user.name} さん <Hand size={25} />
                        </h1>
                        <p className="text-gray-500">
                            あなたにマッチした求人が見つかっています！
                        </p>
                    </div>

                    {/* 右側：マイページボタン（ここへ移動！） */}
                    <Link 
                        href='/my-page' 
                        className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#EEEDFE] text-[#534AB7] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#F5F4FF] hover:border-[#534AB7]/30 transition-all shadow-sm shrink-0"
                    >
                        <UserIcon size={18} />
                        <span>マイページを確認</span>
                    </Link>
                </div>
            </div>
            

            {/* 検索ホーム */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchJobs(search, skill)}
                        placeholder="キーワードで検索（例：React、Laravel、フロントエンド）"
                        className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#534AB7]"
                    />
                    <button
                        onClick={() => fetchJobs(search, skill)}
                        className="bg-[#534AB7] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#3C3489] transition-colors"
                    >

                        検索
                    </button>
                </div>

                

                {/* スキルタブ */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    {SKILL_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSkillChange(s)}
                            className={`text-xs px-4 py-1.5 rounded-full transition-colors ${skill === s
                                    ? 'bg-[#534AB7] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-[#EEEDFE]'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-2 gap-4 mb-6">

                <StatCard label="AI診断済み" value={`${stats.matched}件`} color="#534AB7" />
                <StatCard label="応募中" value={`${stats.applied}件`} color="#1D9E75" />
            </div>

            {/* 求人一覧 */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-lg mb-1">該当する求人が見つかりませんでした</p>
                    <p className="text-sm">検索条件を変えてみてください</p>
                </div>
            ) : (
                <>
                   <p className="text-sm text-gray-500 mb-3">{jobs.length}件の求人が見つかりました</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {jobs.map((job) => {
                                    //laravelから届いた「スキル適合度」
                                    const skillScore = job.skill_score ?? 0;
                                    //AO診断ボタンを教えて保存された「AIスコア」
                                    const preview = previews.find(p => p.job_posting_id === job.id);
                
                                    return (
                                        <div key={job.id} className="relative">
                                            <JobCard 
                                                job={job}
                                                onClick={() => {
                                                    console.log("クリックされた求人:", job);
                                                    setSelectedJob(job);
                                                }}
                                            />
                                            {/* ✅ スコアを表示するエリア (カードの右上に配置) */}
                                            <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 pointer-events-none">
                    
                                                {/* 常に表示：スキル適合度 (薄いグレー/紫系で控えめに) */}
                                                <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 shadow-sm border border-gray-100 text-gray-500">
                                                    スキル適合 {skillScore}%
                                                </div>

                                                {/* AI診断済みの時だけ表示：AIスコア (少し目立たせる) */}
                                                {preview && (
                                                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border ${
                                                        preview.match_score >= 70 
                                                        ? 'bg-[#E1F5EE] text-[#085041] border-[#1D9E75]/30' 
                                                        : 'bg-[#EEEDFE] text-[#3C3489] border-[#534AB7]/30'
                                                        }`}>
                                                        ✨ AI診断 {preview.match_score}点
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
            )}
        </div>
    );
}