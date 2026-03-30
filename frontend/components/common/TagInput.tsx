
// components/common/TagInput.tsx
// 「タグを追加・削除できる入力部品」
// JobForm と ProfileForm 両方で使える共通部品！

"use client";

import { useState, KeyboardEvent } from 'react';


type Props = {
    label: string;
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}


export default function TagInput({ label, value, onChange, placeholder }: Props) {
    const [inputText, setInputText] = useState('');

    //タグを追加する処理
    const addTag = () => {
        const trimmed = inputText.trim();
        // .trim() = 前後の空白を除去（例：" PHP " → "PHP"）

        if (!trimmed) return;
        //空ならなにもしない

        if (value.includes(trimmed)) return;
        //重複禁止

        onChange([...value, trimmed]);

        setInputText('');
    };

    //タグを削除する処理
    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    // Enterキーを押したときの処理
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Enterキーが押されたら
            e.preventDefault();
            // デフォルトの動作（フォーム送信）を止める
            addTag();
            // タグ追加処理を実行
        }
    };

    return (
        <div className='mb-4'>
            {/* ラベル */}
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            
            {/* すでに追加されたタグの一覧 */}
            <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                {value.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-[#EEEDFE] text-[#3C3489] text-xs px-3 py-1 rounded-full font-medium">
                        {tag}

                        <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 text-[#534AB7] hover:text-red-500 font-bold transition-colors">
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {/* タグ入力エリア */}
            <div className='flex gap-2'>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder ?? 'スキルを入力してEnterで追加'}
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#534AB7]"
                />
                <button type="button" onClick={addTag} className="bg-[#534AB7] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#3C3489] transition-colors"
                >
                    +追加
                </button>
            </div>
        </div>
    );
}