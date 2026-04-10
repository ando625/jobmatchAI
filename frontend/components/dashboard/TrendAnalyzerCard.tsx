// components/dashboard/TrendAnalyzerCard.tsx
"use client";

import { useState } from "react";
import apiClient from "@/lib/axios";
import { Sparkles, Search, Loader2 } from "lucide-react";
import { aiApi } from "@/lib/api";


export default function TrendAnalyzerCard() {
    const [skill, setSkill] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 分析ボタンを押したら実行処理
    const handleAnalyze = async () => {
        if (!skill) return;
        setIsLoading(true);
        setAnalysis("");

        try {
            const res = await aiApi.analyzeTrend(skill);
            setAnalysis(res.data.analysis);
        } catch (e) {
            console.error(e);
            setAnalysis("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="bg-gradient-to-br from-[#534AB7]/5 to-[#EEEDFE] rounded-xl border border-[#534AB7]/20 p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-[#534AB7]" size={20} />
                <h2 className="text-lg font-bold text-[#3C3489]">最新トレンド・スキル分析エージェント</h2>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">
                AIエージェントがネットを検索し、そのスキルの「今」を調査します。
            </p>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        placeholder="調査したいスキル（例：React, TypeScript）"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#534AB7]"
                    />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !skill}
                    className="bg-[#534AB7] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#3C3489] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                    分析開始
                </button>
            </div>

            {/* AIの回答エリア */}
            {analysis && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-[#534AB7]/10 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm animate-in fade-in slide-in-from-top-2">
                    {analysis}
                </div>
            )}
        </div>
    );
}