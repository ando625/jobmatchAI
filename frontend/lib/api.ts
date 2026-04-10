// ===== lib/api.ts =====
// LaravelのAPIを呼ぶ関数をまとめたファイル
// apiClient（axios）を使って実際の通信をする

import apiClient from "./axios";  //axios.tsで作った設定済み通信機を取り込む
import type { User, AuthResponse } from "@/types/auth";
import { Job, JobsResponse, JobWithCount, AdminStats, Applicant } from "@/types";
import { PaginatedResponse } from "@/types/job";

// ============================================================
// 認証 API（authApi）
// ============================================================
// オブジェクトにまとめて export する書き方
// 使う側： authApi.login(...)  authApi.register(...) と呼べる

export const authApi = {
    
    register: (
        name: string,
        email: string,
        password: string,
        role: string,
        password_confirmation: string

    ) => {
        return apiClient.post<AuthResponse>('/auth/register', {
            name,
            email,
            password,
            password_confirmation,
            role,
        })
    },


    // ----------------------------------------------------------
    // ログイン
    // ----------------------------------------------------------
    login: (email: string, password: string) => {
        return apiClient.post<AuthResponse>('/auth/login', {
            email,
            password,
        })
    },


    // ----------------------------------------------------------
    // ログアウト
    // ----------------------------------------------------------
    logout: () => {
        return apiClient.post<{message:string}>('/auth/logout')
    },

    // ----------------------------------------------------------
    // 自分の情報取得
    // ----------------------------------------------------------
    getMe: () => {
        return apiClient.get<{ user: User }>('/me')
    },
}


// ============================================================
// 求人 API（jobApi）
// ============================================================
export const jobApi = {
    getAll: (page: number = 1, params?: {
        search?: string;
        skill?: string;
        location?: string;
    }) =>
        apiClient.get<JobsResponse>('/jobs', { params: {...params,page} }),
    
    getById: (id: number) =>
        apiClient.get < { success: boolean; data:Job}>(`/jobs/${id}`),
}




export const companyApi = {

    getMyJobs: () =>
        apiClient.get<{ success: boolean; data: JobWithCount[] }>('/company/jobs'),
    // 自社の求人一覧を取得

    toggleJobStatus: (id: number) =>
        apiClient.patch<{ success: boolean; data: Job }>(`/company/jobs/${id}/toggle`),
    // patch = PATCHリクエストを送る（一部更新）
    

    createJob: (data: Partial<Job>) =>
        apiClient.post<{ success: boolean; data: Job }>('/company/jobs', data),
    //POST /api/company/jobs に data を送信して求人を作成

    getJobById: (id: number) =>
        apiClient.get<{ success: boolean; data: Job }>(`/company/jobs/${id}`),
    // GET /api/company/jobs/{id} で編集用の求人を取得

    updateJob: (id: number, data: Partial<Job>) =>
        apiClient.put<{ success: boolean; data: Job }>(`/company/jobs/${id}`, data),
    // PUT /api/company/jobs/{id} に data を送信して更新

    deleteJob: (id: number) =>
        apiClient.delete<{ success: boolean; message: string }>(`/company/jobs/${id}`),
    // DELETE /api/company/jobs/{id} で求人を削除

    getApplicants: (jobId: number) =>
        apiClient.get(`/company/jobs/${jobId}/applicants`),

    updateApplicationStatus: (applicationId: number, status: string) =>
        apiClient.patch(`/company/applications/${applicationId}/status`, { status }),

    getApplicantDetail: (id: number) =>
        apiClient.get(`/company/applicants/${id}`),

    //応募IDを指定して企業用AI診断を実行
    analyzeApplicant: (applicationId: number) =>
        apiClient.post<{ comment: string }>(`/company/applications/${applicationId}/ai-analysis`),
    
    //会社プロフィールを新規作成する
    createProfile: (data: { company_name: string; location?: string; description?: string }) =>
        apiClient.post('/company/profile', data),
};


//管理者用API

export const adminApi = {

    getStats: () =>
        apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats'),

    getUsers: () =>
        apiClient.get<{ success: boolean; data: User[] }>('/admin/users'),

    getJobs: () =>
        apiClient.get<{ success: boolean; data: Job[] }>('/admin/jobs'),

    toggleJobStatus: (id: number) =>
        apiClient.patch(`/admin/jobs/${id}/toggle`),
}


export const myPageApi = {
    getApplications: () =>
        apiClient.get('/applications'),

    getMatchPreviews: () =>
        apiClient.get('/match-previews'),
};


// ============================================================
// メッセージ API
// ============================================================
export const messageApi = {
    getMessages: (applicationId: number) =>
        apiClient.get(`/messages/${applicationId}`),

    sendMessage: (applicantId: number, content: string) =>
        apiClient.post('/messages', {
            application_id: applicantId,
            content,
        }),
    
    getUnreadCount: () =>
        apiClient.get<{ success: boolean; unread_count: number }>('/messages/unread-count'),

    deleteMessage: (id: number) =>
        apiClient.delete(`/messages/${id}`),


};


// ============================================================
// AI解析 API（aiApi）
// ============================================================
export const aiApi = {
    analyzeTrend: (skillName: string) => {
        return apiClient.post<{ analysis: string }>('/trend-analysis', {
            skill_name: skillName
        });
    },
};