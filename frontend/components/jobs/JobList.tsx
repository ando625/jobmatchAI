
// ===== components/jobs/JobList.tsx =====
// 求人カードを一覧表示する部品
// JobCard を並べるだけの「コンテナ（入れ物）」コンポーネント

import type { Job } from '@/types'
import { JobCard } from './JobCard'

// ============================================================
// Props 型
// ============================================================
type JobListProps = {
    jobs: Job[];       //Job型の配列（複数の求人データ）を受け取る
    showApplyButton?: boolean;
}


// ============================================================
// JobList コンポーネント
// ============================================================
export function JobList({ jobs, showApplyButton = false }: JobListProps) {
    
    // jobs が空（0件）の場合は「求人なし」メッセージを表示
    if (jobs.length === 0) {
        return (
            <div className='text-center py-16 text-gray-400'>
                <p className='text-4xl mb-4'>🔍</p>
                <p className='text-sm'>求人が見つかりませんでした</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>


            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    showApplyButton={showApplyButton}
                />
            ))}
        </div>
    )
}