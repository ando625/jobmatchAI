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
        ]);
        
    }
}
