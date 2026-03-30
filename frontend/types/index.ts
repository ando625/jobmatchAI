
// ===== types/index.ts =====
// 全ての型定義をここから1行でimportできるようにする「窓口ファイル」
//
// 使う側はこう書ける：
//   import type { Job, User, Feature } from '@/types'
//   ↑ '@/types' だけで全部の型が取れる

export type { User, AuthContextType, AuthResponse, ApiError } from './auth';
export type { Job, Feature, JobWithCount, AdminStats, Applicant, JobWithApplicants } from './jop';

// ============================================
// 応募データの型
// ============================================
export interface Application {
    id: number;
    job_posting_id: number;
    user_id: number;
    status: 'applying' | 'screening' | 'interview' | 'offered' | 'rejected';
    //        ↑ 'applied' → 'applying' に修正！DBのENUMと一致させる
    match_score: number | null;
    match_reason: string | null;
    created_at: string;
    job_posting: Job;
    // ↑ JobPosting という未定義の型ではなく、job.ts にある Job 型を使う
}

// ============================================
// 診断結果データの型
// ============================================
export interface MatchPreview {
    id: number;
    job_posting_id: number;
    user_id: number;
    match_score: number;
    match_reason: string | null;
    created_at: string;
    job_posting: Job;
    // ↑ こちらも Job 型に統一
}

// プロフィールテーブル
export interface Profile {
    id: number;
    user_id: number;
    bio: string | null;           // 自己紹介
    skills: string[];             // [PHP, Laravel] などの配列
    preferred_salary: number | null; // 希望年収
    preferred_location: string | null; // 希望勤務地
    created_at: string;
    updated_at: string;
}


export interface UserDetail {
    id: number;
    name: string;
    email: string;
    role: 'jobseeker' | 'company' | 'admin';
    profile?: Profile; // profilesテーブルと1対1（無い場合もあるので ? をつける）
}

// 3. 応募（Application）テーブルの型
export interface Applicant {
    id: number;
    job_posting_id: number;
    user_id: number;
    status: 'applying' | 'screening' | 'interview' | 'offered' | 'rejected';
    match_score: number | null;
    match_reason: string | null;
    created_at: string;
    user: UserDetail; // リレーションで取得するユーザー情報
}