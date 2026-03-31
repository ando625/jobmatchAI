
// frontend/components/profile/ProfileForm.tsx
// プロフィール作成編集

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TagInput from '../common/TagInput';
import axios from '@/lib/axios';

interface ProfileData {
    bio: string;
    skills: string[];
    preferred_salary: number | '',
    preferred_location: string;
}

interface Props {
    onSaved?: () => void;
}

export default function ProfileForm({onSaved}: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState<ProfileData>({
        bio: '',
        skills: [],
        preferred_salary: '',
        preferred_location: '',
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);   //APIリクエスト中かどうか
    const [message, setMessage] = useState('');

    // ============================================
    // 初回表示時に既存プロフィールを取得
    // ============================================
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);

            try {
                const res = await axios.get('/profile');

                if (res.data.profile) {
                    const p = res.data.profile;
                    setFormData({
                        bio: p.bio ?? '',
                        skills: p.skills ?? [],
                        preferred_salary: p.preferred_salary ?? '',
                        preferred_location: p.preferred_location ?? '',
                    });
                }
            } catch (e) {
                console.error('プロフィール取得失敗', e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    




    // ============================================
    // フォーム送信処理
    // ============================================
    const handleSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await axios.post('/profile', formData)

            if (onSaved) {
                onSaved();
                return;
            }
            setMessage('保存しました');
            setTimeout(() => {
                router.push('/my-page');
            }, 1200);
        } catch (err: any) {
            setMessage(err.response?.data?.message ?? '保存に失敗しました');
        } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center py-20'>
                <p className='text-gray-500'>読み込み中...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className='max-w-4xl mx-auto space-y-6'>


            {/* 自己紹介 */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>自己紹介</label>
                <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder='例: PHPとReactが得意なエンジニアです。チームワークを大切にしています。'
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent"
                ></textarea>
            </div>

            {/* スキル入力 */}
            <div>
                <TagInput
                    label="スキル"
                    value={formData.skills}
                    onChange={(skills) => setFormData({ ...formData, skills })}
                    placeholder='例: PHP, React, TypeScript（Enterで追加）'
                />
            </div>

            {/* 希望年収 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    希望年収（万円）
                </label>
                <input
                    type="number"
                    value={formData.preferred_salary}
                    onChange={(e) => setFormData({
                        ...formData,
                        preferred_salary: e.target.value === '' ? '' : Number(e.target.value)
                        // 空文字は '' のまま、数値が入ったら Number() で数値型に変換
                    })}
                    placeholder="例: 500"
                    min={0}
                    max={9999}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">0〜9999 万円の範囲で入力してください</p>
            </div>

            {/* ===== 希望勤務地 ===== */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    希望勤務地
                </label>
                <input
                    type="text"
                    value={formData.preferred_location}
                    onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                    placeholder="例: 東京都・リモートOK"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7] focus:border-transparent"
                />
            </div>

            {/* 保存ボタン */}
            <div>
                <button
                    type="submit"
                    disabled={saving}
                    className='w-full bg-[#534AB7] text-white rounded-full py-3 font-medium hover:bg-[#4a42a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {saving ? '保存中...' : 'プロフィールを保存する'}
                </button>
            </div>
        </form>
    );
}

