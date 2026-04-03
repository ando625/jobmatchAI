// ===== types/job.ts =====
// 求人に関する型定義だけを置くファイル
// ロジックは一切書かない

// ============================================================
// Job 型（求人1件分のデータの形）
// ============================================================
export type Job = {
    id: number                  // 求人ID（数字）
    company_id: number          //companiesテーブルID
    title: string               // 求人タイトル（例：Reactエンジニア）
    company_name: string        // 会社名
    description: string          //求人詳細
    required_skills: string[]    // スキル配列 例: ['PHP', 'Laravel', 'React']
    location: string             // 勤務地（例：東京・フルリモート）
    salary_min: number | null
    salary_max: number | null
    status: 'open' | 'closed'   // open = 公開中 / closed = 非公開
    skill_score?: number;
    created_at: string
    updated_at: string
}

// ============================================================
// Feature 型（サービス特徴カード1枚分のデータの形）
// ============================================================
export type Feature = {
    icon: string         // 絵文字アイコン（例：'🤖'）
    title: string        // 特徴タイトル
    description: string  // 説明文
}



export type JobsResponse = {
    success: boolean
    data: PaginatedResponse<Job>;
}


export type JobWithCount = Job & {
    applications_count: number
    // withCount() で追加されるフィールド
    // Job の全フィールド + 応募数
    // & = 「この型と合体させる」（交差型）
}


export type AdminStats = {
    total_users: number
    jobseeker_count: number
    company_count: number
    total_jobs: number
    open_jobs: number
    total_applications: number
}

export type Applicant = {
    id: number;
    job_posting_id: number;
    user_id: number;
    status: 'applying' | 'screening' | 'interview' | 'offered' | 'rejected';
    match_score: number | null;
    match_reason: string | null;
    company_ai_comment?: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        profile?: {
            bio: string;
            skills: string[];
        };
    };
};

export type JobWithApplicants = JobWithCount & {
    applicants?: Applicant[];
};

//laravelのページネーションレスポンス型
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

