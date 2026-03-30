// ===== app/page.tsx トップページ =====

import type { Metadata } from "next";

import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { JobList } from "@/components/jobs/JobList";
import { JobCard } from "@/components/jobs/JobCard";
import type { Job, Feature } from "@/types";
import { FeatureCard } from "@/components/home/FeatureCard";
import Image from "next/image";
import { Bot, Zap, Handshake } from "lucide-react";


// ============================================================
// メタデータ（SEO・OGP設定）
// ============================================================
export const metadata: Metadata = {
    title: "JobMarch AI | AIがあなたにぴったりの求人を提案",
    description: "AIがあなたのスキルと経験を分析して、最適な求人を提案します。エンジニア・デザイナー・マーケターの転職はJobMatch AIで。",
};

// ============================================================
// 仮データ（将来DBから取得するデータ）
// ============================================================
// 
const PREVIEW_JOBS: Job[] = [
    {
        id: 1,
        company_id: 1, // ✨ 追加！
        company_name: "株式会社テックビジョン",
        title: "Reactフロントエンドエンジニア",
        description: "React/Next.jsを使用したモダンな開発をお任せします。", // ✨ 追加！
        location: "東京・フルリモート",
        salary_min: 600,
        salary_max: 900,
        required_skills: ["React", "TypeScript", "Next.js"],
        status: 'open',
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString(), 
    },
    {
        id: 2,
        company_id: 2,
        company_name: "株式会社イノベートラボ", // company から変更
        title: "Laravelバックエンドエンジニア",
        description: "Laravelを使用した基幹システムの開発およびAPI設計を担当していただきます。",
        location: "大阪・ハイブリッド",
        salary_min: 500, // 数値に変更
        salary_max: 700, // 数値に変更
        required_skills: ["Laravel", "PHP", "MySQL"], // tags から変更
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 3,
        company_id: 3,
        company_name: "合同会社AIフォース", // company から変更
        title: "PythonエンジニアAI開発",
        description: "最新のLLMを活用したAIアプリケーションの開発に携わっていただきます。",
        location: "東京・フルリモート",
        salary_min: 700, // 数値に変更
        salary_max: 1000, // 数値に変更
        required_skills: ["Python", "FastAPI", "AI/ML"], // tags から変更
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const FEATURES: Feature[] = [
    {
        icon: "Bot",
        title: "AIマッチング",
        description:
        "あなたのスキルと経験をAIが分析。本当に合った求人だけを提案します。",
    },
    {
        icon: "Zap",
        title: "簡単3ステップ応募",
        description:
        "プロフィール登録・求人選択・応募ボタンのたった3ステップで完了。",
    },
    {
        icon: "Handshake",
        title: "企業と直接繋がる",
        description: "仲介なし・手数料ゼロ。企業の担当者と直接やりとりできます。",
    },
];


// ============================================================
// ページ本体
// ============================================================
export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* ヘッダー */}
            <Header />

            <main className="flex-1">

                {/* Hero セクション */}
                <section className="bg-gradient-to-br from-[#534AB7] to-[#7F77DD] text-white py-24 px-4 overflow-hidden">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-xs font-medium bg-white/20 rounded-full text-white">
                                {/* インストールしたアイコンを表示！サイズと色を指定 */}
                                <Bot size={16} className="text-white" />
                                AI搭載・転職マッチングサービス
                            </span>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                AIがあなたにぴったりの
                                <br />
                                求人を提案します
                            </h1>
                            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">スキルと経験を入力するだけ。Gemini AIがあなたの強みを分析して、最もマッチした求人だけを厳選して提案します。</p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 text-base font-semibold text-[#534AB7] bg-white rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    無料で始める
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-8 py-4 text-base font-semibold text-white border-2 border-white/60 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    ログインはこちら
                                </Link>
                            </div>
                        </div>

                        {/* 右側：画像！ */}
                        <div className="flex-1 relative w-full h-[300px] md:h-[400px]">
                            <Image
                                src="/job.jpg" 
                                alt="AI matching illustration"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </section>


                {/* 求人プレビューセクション */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">注目の求人</h2>
                            <p className="text-gray-500 text-sm">AIが選んだ注目求人をピックアップ</p>
                        </div>
                        
                        {/* JobList 部品に仮データを渡す */}
                        <JobList jobs={PREVIEW_JOBS} />
                        <div className="text-center mt-8">
                            <Link
                                href="/register"
                                className="inline-block px-8 py-3 text-sm font-medium text-[#534AB7] border border-[#534AB7] rounded-full hover:bg-[#534AB7] hover:text-white transition-colors"
                            >
                                すべての求人を見る（無料登録が必要）
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 特徴セクション */}
                <section className="bg-white py-32 px-4">
                    <div className="max-w-6xl mx-auto">

                        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">JobMatch AI の特徴</h2>
                                <p className="text-gray-500">
                                    最新のGemini AIを活用し、あなたのキャリアを全力でサポートします。<br />
                                    従来の求人サイトでは見つからなかった「本当に相性の良い職場」を提案します。
                                </p>
                            </div>
                            {/* ここに hoom.jpg を投入！ */}
                            <div className="flex-1 flex justify-center">
                                <Image
                                    src="/hoom.jpg"
                                    alt="AI support"
                                    width={500}
                                    height={300}
                                    className="rounded-2xl shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {FEATURES.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}

                        </div>
                    </div>
                </section>

                {/* 最後の登録誘導セクション */}
                <section className="py-60 px-4 bg-gray-900 text-white relative overflow-hidden">
                    {/* 背景に job2.jpg を薄く敷くとかっこいい！ */}
                    <div className="absolute inset-0 opacity-20">
                        <Image src="/job2.jpg" alt="background" fill className="object-cover" />
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-3xl font-bold mb-6">さあ、あなたもAIと一緒に、最高の職場を見つけましょう</h2>
                        <Link
                            href="/register"
                            className="inline-block px-10 py-4 text-lg font-bold text-white bg-[#534AB7] rounded-full hover:bg-[#6459d8] transition-all transform hover:scale-105"
                        >
                            今すぐ無料で始める
                        </Link>

                    </div>
                </section>

            </main>

            {/* フッター */}
            <Footer />
        </div>
    )
}