'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Wallet, MapPin, Bot, RefreshCw } from "lucide-react";

type Props = {
    job: Job;
    onClose: () => void;
};

export default function JobDetailModal({ job, onClose }: Props) {
    const { user } = useAuth();

    const [applyStatus, setApplyStatus] = useState<
        'idle' | 'applying' | 'done' | 'error'
    >('idle');
    // idle    = 何もしていない初期状態
    // applying = 応募 API 呼び出し中
    // done    = 応募完了
    // error   = エラー発生
    // これを「状態機械（State Machine）」と呼ぶ（魔法のスイッチみたいなもの）

    const [previewData, setPreviewData] = useState<{
        score: number;
        reason?: string;
    } | null>(null);

    const [diagnosing, setDiagnosing] = useState(false);
    const [applyMessage, setApplyMessage] = useState("");
    const [diagnoseError, setDiagnoseError] = useState("");

    // ============================================
    // AI マッチ診断ボタンの処理
    // ============================================
    const handleDiagnose = async () => {
        setDiagnosing(true);
        setDiagnoseError("");  

        try {
            const res = await axios.post(`/jobs/${job.id}/preview`, {}, {
                timeout: 30000 
            });
        
            setPreviewData({
                score: res.data.score,
                reason: res.data.reason,
            });
        } catch (e) {
            console.error('診断失敗', e);
            setDiagnoseError('診断に失敗しました。しばらくしてからお試しください。');
        } finally {
            setDiagnosing(false);
        }
    };

    // ページを開いた時に既存のAI診断結果があるか確認する
    useEffect(() => {
        const checkExistingDiagnosis = async () => {
            try {
                // マイページ用のAPIなどを利用して、この求人のプレビューがあるか探す
                const res = await axios.get('/match-previews');
                const existing = res.data.previews.find((p: any) => p.job_posting_id === job.id);
                
                if (existing) {
                    setPreviewData({
                        score: existing.match_score,
                        reason: existing.match_reason,
                    });
                }
            } catch (e) {
                console.error("既存診断の取得失敗", e);
            }
        };
        
        if (user) checkExistingDiagnosis();
    }, [job.id, user]);


    // ============================================
    // 応募ボタンの処理
    // ============================================
    const handleApply = async () => {
        setApplyStatus('applying');
        try {
            const res = await axios.post(`/jobs/${job.id}/apply`);
            setApplyStatus('done');
            setApplyMessage(res.data.message);
        } catch (err: any) {
            setApplyStatus('error');
            setApplyMessage(
                err.response?.data?.message ?? '応募に失敗しました'
            );
        }
    };

    // ============================================
    // スコアに応じた色を返す関数
    // ============================================
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600 bg-green-50';
        // 70点以上 = 緑（高マッチ）
        if (score >= 40) return 'text-yellow-600 bg-yellow-50';
        // 40〜69点 = 黄（中マッチ）
        return 'text-red-600 bg-red-50';
        // 39点以下 = 赤（低マッチ）
    };

    //モーダル
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // createPortal を使わず、直接 return する
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            {/* モーダル本体 */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* ヘッダー */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                        <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-[#1D9E75] font-medium">{job.company_name}</p>
                            {/* 最初から出ているスキル適合度 */}
                            <span className="bg-[#EEEDFE] text-[#3C3489] text-[10px] px-2 py-0.5 rounded font-bold mt-2">
                                スキル適合 {job.skill_score}%
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4 shrink-0"
                    >
                        ×
                    </button>
                </div>

                {/* コンテンツ - スクロール可能エリア */}
                <div className="p-6 space-y-8 overflow-y-auto">

                    {/* ステータス・基本情報 */}
                    <div className="flex flex-wrap items-center gap-6 py-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                            job.status === 'open'
                            ? 'bg-[#E1F5EE] text-[#085041]'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                            {job.status === 'open' ? '募集中' : '募集終了'}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{job.location}</span>
                        </div>

                        {job.salary_min && job.salary_max && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                <span>
                                    {job.salary_min}〜{job.salary_max}万円
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 必須スキル */}
                    {job.required_skills?.length > 0 && (
                        <div className='py-3'>
                            <h3 className="text-sm font-bold text-gray-700 mb-2">必須スキル</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.required_skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-[#EEEDFE] text-[#3C3489] text-xs px-3 py-1.5 rounded-full font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 求人詳細 */}
                    <div className='py-3'>
                        <h3 className="text-sm font-bold text-gray-700 mb-2">仕事内容</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </p>
                    </div>

                    {/* ✅ AI診断結果エリア（デザインを整理） */}
                    {previewData && (
                        <div className="mb-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`text-2xl font-bold px-3 py-1 rounded-lg border ${getScoreColor(previewData.score)}`}>
                                        {previewData.score}
                                    </span>
                                    <span className="text-sm font-bold text-gray-700">AIマッチスコア</span>
                                </div>
                                {/* ✅ 追加：最新情報で再診断するボタン */}
                                <button
                                    onClick={handleDiagnose}
                                    disabled={diagnosing}
                                    className="flex items-center gap-1 text-xs font-bold text-[#534AB7] hover:underline disabled:opacity-50"
                                >
                                    <RefreshCw size={14} className={diagnosing ? 'animate-spin' : ''} />
                                    {diagnosing ? '更新中...' : '最新の情報で再診断'}
                                </button>
                            </div>
                            {previewData.reason && (
                                <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100 italic">
                                    "{previewData.reason}"
                                </p>
                            )}
                        </div>
                    )}

                    {/* ✅ 診断エラー表示を1つに統合 */}
                    {diagnoseError && (
                        <p className="text-sm text-red-500 mt-2 font-bold">{diagnoseError}</p>
                    )}
                </div>

                {/* ボタンエリア - 下部に固定 */}
                <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                    {applyStatus === 'done' ? (
                        <div className="text-center py-4 bg-green-50 rounded-xl">
                            <p className="text-green-600 font-bold">🎉 応募が完了しました！</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {user ? (
                                user.role === 'jobseeker' && job.status === 'open' ? (
                                    <div className="flex flex-col gap-3 items-center">
                                        {/* 診断結果がないときだけ大きなAIボタンを出す */}
                                        {!previewData && (
                                            <button
                                                onClick={handleDiagnose}
                                                disabled={diagnosing}
                                                className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2.5 transition-transform active:scale-95 disabled:opacity-50 shadow-md"
                                                style={{ background: 'linear-gradient(to right, #7C3AED, #EC4899, #EF4444)' }}
                                            >
                                                <Bot size={24} />
                                                <span>{diagnosing ? 'AIがあなたの可能性を分析中...' : 'AIマッチ診断を受ける'}</span>
                                            </button>
                                        )}

                                        <button 
                                            onClick={handleApply}
                                            disabled={applyStatus === 'applying'}
                                            className="w-full py-4 bg-[#534AB7] text-white rounded-full font-bold hover:bg-[#3C3489] transition-colors disabled:opacity-50"
                                        >
                                            {applyStatus === 'applying' ? '送信中...' : 'この求人に応募する'}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-2">
                                        {job.status === 'open' ? '求職者アカウントのみ応募可能です' : 'この求人の募集は終了しました'}
                                    </p>
                                )
                            ) : (
                                <div className="text-center bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-600 text-sm mb-4">応募やAI診断にはアカウントが必要です</p>
                                    <Link href="/register" onClick={onClose} className="inline-block bg-[#534AB7] text-white px-10 py-3 rounded-full font-bold hover:bg-[#3C3489] transition-all">
                                        無料で登録して応募する
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}