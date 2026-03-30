// components/dashboard/AdminDashboard.tsx

'use client'

import { useState, useEffect } from 'react'
import { User, Job, AdminStats } from '@/types'
import { adminApi } from '@/lib/api'
import { Wrench} from "lucide-react";


type Props = { user: User }

export default function AdminDashboard({ user }: Props) {

    const [stats, setStats] = useState<AdminStats | null>(null)
    // AdminStats | null = 「AdminStats型 または null」
    // 最初はデータがないので null から始まる

    const [users, setUsers] = useState<User[]>([])
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users')
    // activeTab = 今どちらのタブを表示しているか
    // 'users' か 'jobs' のどちらか（Union型）

    useEffect(() => {
        const fetchAll = async () => {
            // 全部まとめて取得する

            setIsLoading(true)
            try {
                const [statsRes, usersRes, jobsRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getUsers(),
                    adminApi.getJobs(),
                ])
                // Promise.all([...]) = 複数の非同期処理を同時に実行して全部終わるまで待つ
                // 1つずつ await すると 合計3回待つ → 遅い
                // Promise.all なら 3つを同時に実行 → 速い！
                // 分割代入で結果を [statsRes, usersRes, jobsRes] に受け取る

                setStats(statsRes.data.data)
                setUsers(usersRes.data.data)
                setJobs(jobsRes.data.data)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAll()
    }, [])

    // 求人を非公開にする
    const handleToggleJobStatus = async (jobId: number, currentStatus: string) => {
        const actionText = currentStatus === 'open' ? '非公開' : '公開';
        if (!window.confirm(`この求人を${actionText}にしますか？`)) return;
        // confirm() = 確認ダイアログを表示。キャンセルなら return で処理中断

        try {
            const res = await adminApi.toggleJobStatus(jobId);
            const updatedJob = res.data.data;
            setJobs(prev =>
                prev.map(j => j.id === jobId ? { ...j, status: updatedJob.status } : j)
            )
        } catch (e) {
            console.error(e)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[#BA7517] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">

            {/* 挨拶カード */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h1 className="flex items-center gap-2.5 text-2xl font-bold text-[#BA7517] mb-1">
                    管理者パネル <Wrench size={25} />
                </h1>
                <p className="text-gray-500">
                    ようこそ、{user.name} さん。全ユーザー・全求人を管理できます。
                </p>
            </div>

            {/* 統計カード 6つ */}
            {stats && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard label="総ユーザー数" value={stats.total_users} color="#BA7517" />
                    <StatCard label="求職者数" value={stats.jobseeker_count} color="#534AB7" />
                    <StatCard label="企業数" value={stats.company_count} color="#1D9E75" />
                    <StatCard label="総求人数" value={stats.total_jobs} color="#888" />
                    <StatCard label="公開中の求人" value={stats.open_jobs} color="#1D9E75" />
                    <StatCard label="総応募数" value={stats.total_applications} color="#D85A30" />
                </div>
            )}

            {/* タブ切り替え */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'users'
                        ? 'bg-[#BA7517] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    ユーザー一覧（{users.length}）
                </button>
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'jobs'
                        ? 'bg-[#BA7517] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    求人一覧（{jobs.length}）
                </button>
            </div>

            {/* タブの中身 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {activeTab === 'users' && (
                    <div className="divide-y divide-gray-100">
                        {users.map((u) => (
                            <div key={u.id} className="px-6 py-4 flex items-center gap-4">

                                {/* roleバッジ */}
                                <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
                                    u.role === 'admin' ? 'bg-[#FAEEDA] text-[#633806]' :
                                    u.role === 'company' ? 'bg-[#E1F5EE] text-[#085041]' :
                                        'bg-[#EEEDFE] text-[#3C3489]'
                                // 三項演算子をチェーンさせている（入れ子）
                                // admin → amber / company → teal / jobseeker → purple
                                    }`}>
                                    {u.role === 'admin' ? '管理者' :
                                        u.role === 'company' ? '企業' : '求職者'}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{u.name}</p>
                                    <p className="text-xs text-gray-400">{u.email}</p>
                                </div>

                                <p className="text-xs text-gray-400 shrink-0">
                                    ID: {u.id}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((j) => (
                            <div key={j.id} className="px-6 py-4 flex items-center gap-4">

                                <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
                                    j.status === 'open'
                                    ? 'bg-[#E1F5EE] text-[#085041]'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {j.status === 'open' ? '公開中' : '非公開'}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{j.title}</p>
                                    <p className="text-xs text-gray-400">{j.company_name} ・ {j.location}</p>
                                </div>

                                <button
                                    onClick={() => handleToggleJobStatus(j.id, j.status)} // 引数を2つ渡す
                                    className={`text-xs px-4 py-1.5 rounded-full border transition-colors shrink-0 ${
                                        j.status === 'open'
                                        ? 'border-red-300 text-red-500 hover:bg-red-50'
                                        : 'border-[#1D9E75] text-[#1D9E75] hover:bg-[#E1F5EE]'
                                        }`}
                                >
                                    {j.status === 'open' ? '非公開にする' : '公開する'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold mb-1" style={{ color }}>{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    )
}