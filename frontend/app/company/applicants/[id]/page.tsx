
// 企業用ダッシュボードで1人の応募者のプロフィールを画面に表示するページ

'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { companyApi, messageApi } from '@/lib/api';
import { Mail, MapPin, JapaneseYen, BookOpen, ArrowLeft } from "lucide-react";
import { Profile, UserDetail, Applicant } from '@/types';
import { Bot, RefreshCw } from "lucide-react";
import { Message } from "@/types/message";
import { useAuth } from "@/hooks/useAuth";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";






export default function ApplicantDetailPage() {
    
    const { id } = useParams();  //URLに入っているidを取り出す
    const [applicant, setApplicant] = useState<Applicant | null>(null);  //応募者データを保存する箱
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // メッセージ用State
    const [messages, setMessages]     = useState<Message[]>([]);
    const [content, setContent]       = useState('');
    const [sending, setSending]       = useState(false);
    const [msgLoading, setMsgLoading] = useState(true);



    //特定の応募者１りの情報を取得するAPIを叩く
    useEffect(() => {
        const fetchDetail = async () => {
            try {

                const res = await companyApi.getApplicantDetail(Number(id));
                setApplicant(res.data.data);

            } catch (e) {
                console.error("応募者情報の取得失敗", e);
            }
        };
        fetchDetail();
    }, [id]);



    //メッセージ一覧を取得
    useEffect(() => {
        if (!applicant?.id) return;

        const fetchMessages = async () => {
            try {
                const res = await messageApi.getMessages(applicant.id);
                setMessages(res.data.messages);
            } catch (e) {
                console.error('メッセージ取得失敗', e);
            } finally {
                setMsgLoading(false);
            }
        };

        fetchMessages();
        const timer = setInterval(fetchMessages, 10000);
        return () => clearInterval(timer);
    }, [applicant?.id]);


    //AI診断を実行する関数
    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await companyApi.analyzeApplicant(Number(id));
            setApplicant(prev => prev ? { ...prev, company_ai_comment: res.data.comment } : null);
        } catch (e) {
            alert("分析に失敗しました");
        } finally {
            setLoading(false);
        }

    };


    //メッセージ送信
    const handleSend = async () => {
        if (!content.trim() || !applicant?.id) return;
        setSending(true);

        try {
            const res = await messageApi.sendMessage(applicant.id, content);
            setMessages(prev => [...prev, res.data.message]);
            setContent('');
        } catch (e) {
            alert('送信に失敗しました');
        } finally {
            setSending(false);
        }
    }

        
    // メッセージ削除の関数
    const handleDelete = async (messageId: number) => {
        if (!confirm('メッセージを削除しますか？')) return;

        try {
            await messageApi.deleteMessage(messageId);
            // 画面上のリストからも消す
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (e) {
            alert('削除に失敗しました');
        }
    };
    




    if (!applicant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-10 h-10 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto p-4 mt-14">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* ヘッダー：名前と基本情報 */}
                <div className="bg-gradient-to-r from-[#534AB7] to-[#7C3AED] p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">{applicant.user.name}</h1>
                    <p className="flex items-center gap-2 opacity-90"><Mail size={16} />{applicant.user.email}</p>
                </div>

                {/* 自己紹介 */}
                <div className="p-8 space-y-8">
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                            <BookOpen className="text-[#1D9E75]" /> 自己紹介
                        </h2>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl">
                            {applicant.user.profile?.bio || '自己紹介は登録されていません'}
                        </p>
                    </section>

                    {/* スキル */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-3">持っているスキル</h2>
                        <div className="flex flex-wrap gap-2">
                            {applicant.user.profile?.skills?.map((skill: string) => (
                                <span
                                    key={skill}
                                    className="bg-[#EEEDFE] text-[#3C3489] px-4 py-1.5 rounded-full text-sm font-bold"
                                >{skill}</span>
                            )) || 'なし'}
                        </div>
                    </section>

                    {/* 希望条件 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-bold mb-1">希望勤務地</p>
                            <p className="flex items-center gap-1 ml-4 font-bold"><MapPin size={14} /> {applicant.user.profile?.preferred_location || '未設定'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-bold mb-1">希望年収</p>
                            <p className="flex items-center gap-1 ml-5 font-bold"> {applicant.user.profile?.preferred_salary || '0'} 万円</p>
                        </div>
                    </div>
                </div>
            </div>
            {/*  --- JSX（表示部分）への追加 --- */}
            <section className="p-8 border-t border-gray-100">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                    <Bot className="text-[#534AB7]" /> 企業向けAI診断
                </h2>

                {applicant.company_ai_comment ? (
                    <div className="bg-[#F5F3FF] p-6 rounded-2xl border border-[#DDD6FE]">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {applicant.company_ai_comment}
                        </p>
                    </div>
                ) : (
                        <div className="text-center bg-gray-50 p-10 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">この応募者のスキルと自社求人のマッチ度をプロ視点で分析します</p>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2.5 transition-transform active:scale-95 disabled:opacity-50 shadow-md"
                                style={{ background: 'linear-gradient(to right, #7C3AED, #EC4899, #EF4444)' }}
                            >
                                {loading ? <RefreshCw className="animate-spin" size={24} /> : <Bot size={24} />}
                                <span>{loading ? 'AIが応募者を分析中...' : 'AI分析レポートを生成する'}</span>
                            </button>
                        </div>
                )}
                
            </section>
            
             {/* ── メッセージセクション ── */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800">💬 応募者へのメッセージ</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        面接の日程調整や追加質問などをここで行えます
                    </p>
                </div>

                {/* 共通部品 MessageList を使う */}
                <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
                    <MessageList
                        messages={messages}
                        currentUserId={user?.id}
                        onDelete={handleDelete}
                        myBubbleColor="bg-[#1D9E75]"
                        isLoading={msgLoading}
                    />
                </div>

                {/* 共通部品 MessageInput を使う */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <MessageInput
                        content={content}
                        onChange={setContent}
                        onSend={handleSend}
                        sending={sending}
                        sendButtonColor="bg-[#1D9E75]"
                        sendButtonHoverColor="hover:bg-[#0F6E56]"
                        focusBorderColor="focus:border-[#1D9E75]"
                    />
                </div>
            </div>


            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 py-3 px-5 bg-[#7C3AED] text-white font-bold mb-6 border-2 border-white rounded-full"
                >
                    <ArrowLeft size={20} />
                    戻る
                </button>

            </div>
        </div>
    );


}