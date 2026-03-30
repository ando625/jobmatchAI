<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --------------------------------------------------
        // 1. 企業ユーザーを作成
        // --------------------------------------------------
        $password = Hash::make('pass1234');

        // 1. 企業ユーザー（求人票に登場する各社）
        User::create([
            'id' => 1, 
            'name' => '株式会社テックラボ', 
            'email' => 'tech@example.com', 
            'password' => $password, 
            'role' => UserRole::Company
        ]);
        User::create(['id' => 2, 'name' => 'クリエイティブ株式会社', 'email' => 'design@example.com', 'password' => $password, 'role' => UserRole::Company]);
        User::create(['id' => 3, 'name' => 'マーケティング株式会社', 'email' => 'market@example.com', 'password' => $password, 'role' => UserRole::Company]);
        User::create(['id' => 4, 'name' => 'データサイエンス株式会社', 'email' => 'data@example.com', 'password' => $password, 'role' => UserRole::Company]);

        // --------------------------------------------------
        // 2. 求職者ユーザーを作成
        // --------------------------------------------------
        User::create([
            'name'     => '山田 太郎',
            'email'    => 'yamada@gmail.com',
            'password' => Hash::make('pass1234'),
            'role'     => UserRole::Jobseeker,
        ]);

        // --------------------------------------------------
        // 3. 管理者ユーザーを作成
        // --------------------------------------------------
        User::create([
            'name'     => 'システム管理者',
            'email'    => 'admin@example.com',
            'password' => Hash::make('pass1234'),
            'role'     => UserRole::Admin,
        ]);
    }
}
