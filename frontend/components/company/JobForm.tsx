

// components/company/JobForm.tsx
// 「求人の新規作成」と「編集」で共用するフォーム部品

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { companyApi } from '@/lib/api';
import TagInput from '@/components/common/TagInput';
import { Job } from '@/types';

// ============================================================
// フォームデータの型
// ============================================================
type JobFormData = {
    title: string;
    description: string;
    required_skills: string[];
    // タグ入力なので string の配列
    salary_min: string;
    salary_max: string;
    // 入力フォームは一旦 string で受け取る（数値変換は送信時に行う）
    location: string;
    status: 'open' | 'closed';
};

// ============================================================
// Props（親から受け取るデータ）
// ============================================================
type Props = {
    job?: Job;
    // job = 編集時は既存データが入る、新規作成時はundefined
    // ? = 「なくてもOK」という意味
};

export default function JobForm({ job }: Props) {
    const router = useRouter();
    const isEdit = !!job;
    // !!job = jobがあれば true（編集モード）、なければ false（新規モード）
    // !! = 「booleanに変換する」テクニック

    // ============================================================
    // フォームの初期値設定
    // ============================================================
    const [form, setForm] = useState<JobFormData>({
        title:            job?.title            ?? '',
        // job?.title = jobがあれば.titleを取得、なければ ''
        description:      job?.description      ?? '',
        required_skills:  job?.required_skills  ?? [],
        salary_min:       job?.salary_min?.toString() ?? '',
        // .toString() = 数値を文字列に変換（例: 300 → '300'）
        salary_max:       job?.salary_max?.toString() ?? '',
        location:         job?.location         ?? '',
        status:           job?.status           ?? 'open',
    });

    const [isLoading, setIsLoading] = useState(false);
    // isLoading = 送信中かどうか（true=送信中、ボタンをグレーにする）
    const [errors, setErrors] = useState<Record<string, string>>({});
    // errors = バリデーションエラーのメッセージ
    // Record<string, string> = 「キーが文字列、値も文字列のオブジェクト」

    // ============================================================
    // フォームのテキスト/セレクト入力を更新する共通関数
    // ============================================================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        // e.target = 「変化が起きたHTML要素」
        // name = その要素の name 属性（例: 'title'）
        // value = 入力された値

        setForm(prev => ({ ...prev, [name]: value }));
        // prev = 変更前のformオブジェクト全体
        // { ...prev, [name]: value } = 変更前のデータを展開して、変化した1つだけ上書き
        // [name] = 変数をキーとして使う「計算プロパティ名」という書き方
    };

    // ============================================================
    // フォーム送信処理
    // ============================================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // 送信データを作成（文字列→数値に変換する）
            const payload = {
                ...form,
                salary_min: form.salary_min ? parseInt(form.salary_min) : null,
                // form.salary_min が空でなければ parseInt で数値に変換、空なら null
                salary_max: form.salary_max ? parseInt(form.salary_max) : null,
                required_skills: form.required_skills,
            };

            if (isEdit) {
                // 編集モード = PUT リクエスト
                await companyApi.updateJob(job!.id, payload);
                // job! = TypeScriptに「jobは絶対にnullじゃない！」と伝える（非nullアサーション）
            } else {
                // 新規作成モード = POST リクエスト
                await companyApi.createJob(payload);
            }

            // 成功したらダッシュボードへ移動
            router.push('/dashboard');
        } catch (err: unknown) {
            // エラーが発生した場合
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
                const apiErrors = axiosErr.response?.data?.errors;
                // apiErrors = Laravelが返したバリデーションエラー
                if (apiErrors) {
                    const flat: Record<string, string> = {};
                    // flat = エラーを「1つのメッセージ」に変換した入れ物
                    Object.entries(apiErrors).forEach(([key, msgs]) => {
                        flat[key] = msgs[0];
                        // 各フィールドの最初のエラーメッセージだけ取り出す
                    });
                    setErrors(flat);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================================
    // 表示（JSX）
    // ============================================================
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                {isEdit ? '求人を編集' : '求人を投稿'}
                {/* isEdit が true なら「編集」、false なら「投稿」 */}
            </h2>

            {/* 求人タイトル */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    求人タイトル <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="例：Reactエンジニア（フルリモート可）"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                />
                {errors.title && (
                    // errors.title があれば（= エラーメッセージがあれば）表示
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
            </div>

            {/* 求人詳細 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    求人詳細 <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    // rows = テキストエリアの高さ（行数）
                    placeholder="仕事内容、求める人物像などを入力してください"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] resize-none"
                    // resize-none = ユーザーがサイズ変更できないようにする
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
            </div>

            {/* 必須スキル（TagInputコンポーネントを使う！） */}
            <TagInput
                label="必須スキル"
                value={form.required_skills}
                onChange={(tags) => setForm(prev => ({ ...prev, required_skills: tags }))}
                // TagInput が「タグが変わったよ」と教えてきたら form を更新
                placeholder="例：React（Enterで追加）"
            />

            {/* 給与範囲 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* grid grid-cols-2 = 2列並べる */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        最低年収（万円）
                    </label>
                    <input
                        type="number"
                        name="salary_min"
                        value={form.salary_min}
                        onChange={handleChange}
                        placeholder="例：400"
                        min="0"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        最高年収（万円）
                    </label>
                    <input
                        type="number"
                        name="salary_max"
                        value={form.salary_max}
                        onChange={handleChange}
                        placeholder="例：700"
                        min="0"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                    />
                </div>
            </div>

            {/* 勤務地 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    勤務地 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="例：東京・フルリモート可"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                />
            </div>

            {/* ステータス */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    公開設定
                </label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] bg-white"
                >
                    <option value="open">公開中</option>
                    <option value="closed">非公開</option>
                </select>
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    // disabled = true のとき押せなくなる
                    className="flex-1 bg-[#1D9E75] text-white py-3 rounded-full font-bold hover:bg-[#0F6E56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    // disabled:opacity-50 = disabled 状態のとき半透明にする
                >
                    {isLoading ? '送信中...' : (isEdit ? '更新する' : '投稿する')}
                    {/* isLoading=true なら「送信中」、false ならモードによって切替 */}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    // router.back() = 1つ前のページに戻る
                    className="px-6 py-3 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    キャンセル
                </button>
            </div>
        </form>
    );
}