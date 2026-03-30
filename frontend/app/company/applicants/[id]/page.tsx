
// 企業用ダッシュボードで1人の応募者のプロフィールを画面に表示するページ

'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { companyApi } from '@/lib/api';
import { Mail, MapPin, JapaneseYen, BookOpen, ArrowLeft } from "lucide-react";
import { Profile, UserDetail, Applicant } from '@/types';
import Link from "next/link";





export default function ApplicantDetailPage() {
    
    const { id } = useParams();  //URLに入っているidを取り出す
    const [applicant, setApplicant] = useState<Applicant | null>(null);  //応募者データを保存する箱
    const router = useRouter();

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

    if (!applicant) return <div className="p-10 text-center">読み込み中...</div>
    
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