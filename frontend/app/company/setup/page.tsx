//企業のプロフィール登録画面

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { companyApi } from "@/lib/api";
import { Header } from "@/components/common/Header";

export default function CompanySetupPage() {
    
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await companyApi.createProfile({
                company_name: name,
                location: location,
                description: description,
            });

            router.push("/dashboard");
        } catch (e) {
            alert("登録に失敗しました");
        }
    };

    return (
        <div>
            <Header />
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-[#1D9E75]">企業情報の初期設定</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">会社名</label>
                    <input
                        className="w-full border p-2 rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">所在地</label>
                    <input
                        className="w-full border p-2 rounded-lg"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">会社説明</label>
                    <textarea
                        className="w-full border p-6 rounded-lg"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button className="w-full bg-[#1D9E75] text-white py-3 rounded-full font-bold">
                    設定を完了してダッシュボードへ
                </button>
            </form>
            </div>
        </div>
    );
}