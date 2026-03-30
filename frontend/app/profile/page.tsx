
// frontend/profile/page.tsx
// プロフィールページ

import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        スキルや希望条件を登録すると、マッチング精度が上がります
                    </p>
                </div>

                {/* フォーム部分 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <ProfileForm />
                </div>
            </div>
        </div>
    );
}


