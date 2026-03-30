<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('companies')->insert([
            [
                'id'           => 1,
                'user_id'      => 1, // UserSeederのID:1と紐付け
                'company_name' => '株式会社テックラボ',
                'description'  => '最新のテクノロジーで社会を豊かにするIT企業です。',
                'location'     => '東京都渋谷区',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'id'           => 2,
                'user_id'      => 2,
                'company_name' => 'クリエイティブ株式会社',
                'description'  => 'デザインの力でブランドの価値を最大化します。',
                'location'     => '東京都港区',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'id'           => 3,
                'user_id'      => 3,
                'company_name' => 'マーケティング株式会社',
                'description'  => 'データに基づいた最適なマーケティング支援を提供します。',
                'location'     => '東京都新宿区',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'id'           => 4,
                'user_id'      => 4,
                'company_name' => 'データサイエンス株式会社',
                'description'  => 'AIとビッグデータを活用した分析ソリューション。',
                'location'     => 'リモート可',
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}
