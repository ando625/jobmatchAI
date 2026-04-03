<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobPostingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('job_postings')->insert([

            [
                'company_id'      => 1,
                'title'           => 'フロントエンドエンジニア（React）',
                'location'        => '東京都渋谷区',
                'required_skills' => json_encode(['React', 'TypeScript', 'Next.js', 'Tailwind CSS']),
                'description'     => 'React/TypeScriptを使ったプロダクト開発をお任せします。リモートワーク可。',
                'salary_min'      => 400,
                'salary_max'      => 600,
                'status'        => 'open',
                'created_at'      => now(),
                // now() = 「今この瞬間の日時」を返すLaravelのヘルパー関数
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 1,
                'title'           => 'バックエンドエンジニア（Laravel）',
                'location'        => '大阪府大阪市',
                'required_skills' => json_encode(['PHP', 'Laravel', 'MySQL', 'Docker', 'AWS']),
                'description'     => 'LaravelでのAPI開発・DB設計をお任せします。年間休日120日以上。',
                'salary_min'      => 450,
                'salary_max'      => 700,
                'status'        => 'open',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 2,
                'title'           => 'UI/UXデザイナー',
                'location'        => '東京都港区',
                'required_skills' => json_encode(['Figma', 'Adobe XD', 'UI Design', 'UX Research']),
                'description'     => 'Figmaを使ったWebアプリのUI設計・デザインシステム構築。',
                'salary_min'      => 350,
                'salary_max'      => 550,
                'status'        => 'open',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 3,
                'title'           => 'Webマーケター',
                'location'        => '東京都新宿区',
                'required_skills' => json_encode(['Google Analytics', 'SEO', 'Google Ads', 'SNS Marketing']),
                'description'     => 'SEO・SNS広告・データ分析を担当。GA4・広告ツール経験者歓迎。',
                'salary_min'      => 300,
                'salary_max'      => 500,
                'status'        => 'open',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 4,
                'title'           => 'データアナリスト（Python）',
                'location'        => 'リモート（全国可）',
                'required_skills' => json_encode(['Python', 'SQL', 'Pandas', 'Machine Learning', 'Tableau']),
                'description'     => 'PythonとSQLを使ったデータ分析・可視化・機械学習モデル構築。',
                'salary_min'      => 500,
                'salary_max'      => 800,
                'status'        => 'open',
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            // JobPostingSeeder.php の runメソッド内、既存の配列の後に追加

            [
                'company_id'      => 1,
                'title'           => 'フロントエンドエンジニア (React/Next.js)',
                'location'        => '東京都渋谷区',
                'required_skills' => json_encode(['React', 'Next.js', 'TypeScript', 'TailwindCSS']),
                'description'     => '新規自社サービスの開発メンバーを募集しています。モダンな技術スタックで、UI/UXにこだわった開発が可能です。',
                'salary_min'      => 300,
                'salary_max'      => 500,
                'status'          => 'open',
                'created_at'      => now()->subDays(1), // 1日前の日付（並び替えテスト用）
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 2,
                'title'           => 'Python / Django によるAI・機械学習エンジニア',
                'location'        => '東京都',
                'required_skills' => json_encode(['Python', 'Django', 'PyTorch']),
                'description'     => 'AIモデルの実装と、それを利用したWebアプリケーションの開発を担当していただきます。',
                'salary_min'      => 400,
                'salary_max'      => 697,
                'status'          => 'open',
                'created_at'      => now()->subDays(2),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 1,
                'title'           => 'Next.js / TypeScript を使ったモダンな管理画面開発',
                'location'        => '東京都渋谷区（フルリモート可）',
                'required_skills' => json_encode(['Next.js', 'TypeScript', 'Tailwind CSS']),
                'description'     => 'フロントエンドの最新技術を使い、直感的で使いやすいダッシュボードを構築していただきます。',
                'salary_min'      => null,
                'salary_max'      => null,
                'status'          => 'open',
                'created_at'      => now()->subDays(3),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 2,
                'title'           => 'フロントエンドエンジニア（React）',
                'location'        => '東京都渋谷区',
                'required_skills' => json_encode(['React', 'TypeScript', 'Next.js', 'Tailwind CSS']),
                'description'     => 'React/TypeScriptを使ったプロダクト開発をお任せします。リモートワーク可。',
                'salary_min'      => null,
                'salary_max'      => null,
                'status'          => 'open',
                'created_at'      => now()->subDays(4),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 1,
                'title'           => 'PHP / Laravel エンジニア（ECサイト開発）',
                'location'        => '大阪府',
                'required_skills' => json_encode(['PHP', 'Laravel', 'SQL']),
                'description'     => '大規模なECプラットフォームのバックエンド開発を担当。ロジックの構築が得意な方歓迎！',
                'salary_min'      => 450,
                'salary_max'      => 800,
                'status'          => 'open',
                'created_at'      => now()->subDays(5),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 3,
                'title'           => 'SNSマーケティング責任者',
                'location'        => 'リモート',
                'required_skills' => json_encode(['SNS Marketing', 'Google Analytics', 'Figma']),
                'description'     => '自社ブランドのSNS戦略の立案から実行まで。クリエイティブな視点を持つ方を募集。',
                'salary_min'      => 500,
                'salary_max'      => 700,
                'status'          => 'open',
                'created_at'      => now()->subDays(6),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 4,
                'title'           => 'SQL/Python データマイニング担当',
                'location'        => '東京都新宿区',
                'required_skills' => json_encode(['SQL', 'Python', 'Pandas']),
                'description'     => '膨大なデータからビジネスチャンスを見つけ出す、やりがいのある仕事です。',
                'salary_min'      => 600,
                'salary_max'      => 900,
                'status'          => 'open',
                'created_at'      => now()->subDays(7),
                'updated_at'      => now(),
            ],
            [
                'company_id'      => 1,
                'title'           => 'フルスタックエンジニア（Laravel & React）',
                'location'        => '東京都港区',
                'required_skills' => json_encode(['PHP', 'Laravel', 'React', 'TypeScript', 'Docker']),
                'description'     => 'フロントからバックまで幅広く関わりたい方！スタートアップのスピード感を楽しめます。',
                'salary_min'      => 550,
                'salary_max'      => 1000,
                'status'          => 'open',
                'created_at'      => now()->subDays(8),
                'updated_at'      => now(),
            ],
        ]);
        
    }
}
