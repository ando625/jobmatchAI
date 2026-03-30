
// ===== components/home/FeatureCard.tsx =====
// サービス特徴を表示するカード部品
// トップページの「JobMatch AIの特徴」セクションで使う

import type { Feature } from "@/types";
import * as Icons from "lucide-react";

type FeatureCardProps = {
    feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {

    const IconComponent = (Icons as any)[feature.icon || "Bot"];


    return (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-full transition-all hover:shadow-md">
            {/* アイコンの周りに丸い背景をつけて目立たせる */}
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                <IconComponent size={42} className="text-[#534AB7]" />
            </div>

            {/* タイトル */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
            
            {/* 説明文 */}
            <p className=" text-gray-600 leading-relaxed">{ feature.description}</p>
        </div>
    )
}