
// ===== components/jobs/JobCard.tsx =====
// 求人1件を表示するカード部品
//
// 使用場所（予定）：
//   - トップページの求人プレビュー
//   - 求人一覧ページ
//   - AI推薦求人ページ


import type { Job } from '@/types';
import { MapPinned } from "lucide-react";



// ============================================================
// Props 型
// ============================================================
type JobCardProps = {
    job: Job;
    showApplyButton?: boolean;
    //   デフォルトは undefined（= falsy）なので表示しない
    //   求人一覧ページでは true にして「応募する」ボタンを出す
    onClick?: ()=> void;

}


// ============================================================
// JobCard コンポーネント
// ============================================================
export function JobCard({ job, showApplyButton = false, onClick }: JobCardProps) {
    
    return (
        <article
            className='flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow '
            // article = 「独立したコンテンツ（求人1件）」を表すHTMLタグ
            onClick={onClick}
        >
            {/* ステータスバッジ */}
            <div className="flex items-center gap-4 mb-3">
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#E1F5EE] text-[#085041]">
                    {job.status === 'open' ? '募集中' : '募集終了'}
                </span>
                <span className='flex items-center gap-1 text-sm text-gray-600'>
                    <MapPinned size={14} className="text-red-400" />
                    {job.location}

                </span>
            </div>
            
            {/* 求人タイトル */}
            <h3 className='text-base font-bold text-gray-800 leading-snug'>{job.title}</h3>

            {/* 会社名 */}
            <p className="text-sm text-[#534AB7] font-medium mb-3">{job.company_name}</p>
            
            {/* スキルタグ */}
            <div className='flex flex-wrap gap-1 mb-3'>
                {job.required_skills?.slice(0, 4).map((skill) => (
                    //slice(0,4) = 最大４個だけ表示、多すぎると見にくい
                    <span
                        key={skill}
                        className='text-xs px-2 py-0.5 rounded-full bg-[#EEEDFE] text-[#3C3489]'
                    >
                        {skill}
                    </span>
                ))}
                {job.required_skills?.length > 4 && (
                    // 5個以上あれば「+N」と表示
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        +{job.required_skills.length - 4}
                    </span>
                )}
            </div>

            <div>
                <p className="text-sm text-gray-500 font-medium mb-3">{job.description}</p>

            </div>

            {/* 給与 */}
            <div className="text-sm font-medium text-gray-700 text-right">
                {job.salary_min && job.salary_max
                    ? `${job.salary_min}〜${job.salary_max}万円`
                    : '給与応相談'
                }
            </div>

            {/* 応募ボタン (showApplyButton　が　trueの時だけ表示) */}
            {showApplyButton && (
                <button className="mt-auto w-full py-2 text-sm font-medium text-white bg-[#534AB7] rounded-lg hover:bg-[#3C3489] transition-colors">
                    この求人に応募する
                </button>
            )}
            </article>
    )
}