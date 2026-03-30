// components/common/StatCard.tsx


"use client";


type StatCardProps = {
    label: string; // 「マッチ求人」「総ユーザー数」などの文字
    value: string | number; // 「12件」や「100」などの数字（文字でも数字でもOKにする）
    color: string; // 文字の色（#534AB7 など）
};


export function StatCard({ label, value, color }: StatCardProps) {
    return (

        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            {/* value (数字) の部分 */}
            <p className="text-3xl font-bold mb-1" style={{ color }}>
                {value}
            </p>
            {/* label (説明) の部分 */}
            <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
    );
}