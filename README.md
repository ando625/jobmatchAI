# JobMatch AI

**AIがあなたにぴったりの求人を提案する転職マッチングサービス**

> Next.js × Laravel × Python(FastAPI) × Gemini AI

---

## アプリの概要

このアプリを一言で言うと、**「AIが採用担当者の代わりをしてくれる、転職マッチングサービス」**です。

単に求人一覧を表示するだけでなく、Next.js（フロントエンド）・Laravel（バックエント）・Python（FastAPI）の３そう構成で構築し、Gemini AIと連携することで「求職者と求人のマッチ度スコアの自動計算」と「なぜマッチしているかの理由文の自動生成」を実現しました。

https://github.com/user-attachments/assets/97720bbf-ecf6-4b4c-b52f-dd1e72855175

https://github.com/user-attachments/assets/df2cfdea-5ceb-40aa-acd9-08ca62ed3d59

https://github.com/user-attachments/assets/320d2a10-4d6a-4379-a784-4bf04fdcd8b8

- 機能要件・基本設計・テーブル仕様書　https://docs.google.com/spreadsheets/d/1kjwwD2PU0BoBVn64UGIXupy_y2bZ6Mk8fxENfCUK6cM/edit?usp=sharing 

### 開発の背景

「転職活動って、本当に自分に合っている求人なのかどうか判断するのが難しい」

スキルシートを見て、求人票を読んで、自分で比較して...と言う作業は時間がかかる上に主観が入りがちです。

このアプリなら、「スキルを登録するだけで、AIが客観的なマッチ度を数値化してくれる」「興味を持った求人だけAIの詳細分析を受けられる」という、タイムパフォーマンスの高い転職活動の場を作ることを目指しました。

PHP/Laravelの技術に加え、フロントエンドにNext.js、AI解析にPythonを導入。企業側には「応募者の採用コスト判断」をサポートするAI診断機能も実装しています。

---

## こだわったポイント

### 1. 「スキルの一致度」を常にひと目で把握できる設計
求人カードには、求職者が登録したスキルと求人の必須スキルを **LaravelのPHPで計算したJaccard係数** に基づく「スキル適合度（0〜100%）」を常時表示しています。ページを開いた瞬間から全求人のスキル一致度が分かるため、興味を持つ求人を素早く絞り込めます。
 
### 2. 「興味を持った求人だけ」深く診断するAI設計
スキル適合度はLaravel側で常時計算していますが、Gemini APIの呼び出しは求職者が「AIマッチ診断」ボタンを押した時だけに限定しています。これにより **無駄なAPIコストを徹底排除** しつつ、興味のある求人に対してだけ深い分析を受けられる自然なUXを実現しています。
 
### 3. 「スキルだけでなく人柄・思考性まで」読み取るAI診断
AIマッチ診断では、スキルの一致度に加えて**求職者の自己紹介文（bio）と求人の仕事内容（description）の両方**をGemini APIに渡して分析します。自己紹介をしっかり書いているほど「スキルは合っているが仕事内容や指向性が合わない」といった踏み込んだアドバイスをAIが返してくれます。
 
### 4. 3ロール設計（求職者・企業・管理者）
同じアプリの中に３つの立場のユーザーが存在します。LaravelのPolicy・Middlewareで各ロールが使えるAPIを厳密に制御し、「企業が他社の求人を編集できない」「求職者が管理画面にアクセスできない」といったセキュリティを実現しています。
 
### 5. 「見せたい時だけAIを呼ぶ」節約設計
求人カードには常にLaravelのPHPで計算した「スキル適合度」を表示。Gemini APIへのリクエストは求職者が「AIマッチ診断」ボタンを押した時のみ発火します。「興味がある求人だけ詳細分析」という自然なユーザー行動に合わせたコスト最適化を実現しています。
 
### 6. 企業向けAI採用コンサルト機能
企業担当者が応募者の詳細ページから「AI分析レポートを生成する」ボタンを押すと、**応募者の自己紹介・スキル・求人の仕事内容** をまとめてPythonに送り、採用コンサルタント視点で「即戦力性」「教育コスト」「懸念点」を分析して提示します。
 
### 7. Dockerによる３層環境の完全コンテナ化
nginx・PHP(Laravel)・MySQL・Next.js・Python(FastAPI)・phpMyAdminの６コンテナを１つのdocker-compose.ymlで管理。全員が同じ環境で動かせる「再現性の高い開発環境」を構築しました。
 
### 8. TypeScriptによる型安全な設計
APIから返ってくるデータ（Job・User・Applicant等）に対して厳密な`interface`や`type`を定義。コンポーネント内でデータの形が明確になり、バグの少ない開発ができました。

### 9. 応募から面接までを完結させるリアルタイム・メッセージ機能
応募して終わりではなく、採用の合否までをアプリ内で完結できるよう、企業と求職者が直接やり取りできるメッセージ機能を実装しました。10秒ごとの自動更新（ポーリング）を導入し、リロードなしで最新のメッセージを確認できる快適なUIを実現。さらに、誤送信を防ぐためのメッセージ削除機能も搭載し、実務での使いやすさにこだわりました。

---


## 苦労した点・学んだこと

### 3つの言語・技術の連携
Next.js・Laravel・Pythonの3層構成のため、エラーがどのレイヤーで起きているか特定が難しく、Laravelのログ・ブラウザのNetworkタブ・Pythonのログを組み合わせてデバッグする力が身につきました。
 
### Dockerによる多層環境の構築
フロント・バック・DB・AI解析・nginxの5コンテナを1つのDockerネットワークで共存・通信させる設定に苦労しましたが、「コンテナ名でホストを指定できる」ことを理解し解決しました（例：`http://python:8000`）。
 
### TypeScriptの型定義
APIから返ってくるデータに対して厳密な`interface`や`type`を定義することで、「どんなデータが流れてくるか」が明確になり、バグの少ない開発ができました。最初は型エラーに苦戦しましたが、型をしっかり決めることの大切さを体感しました。
 
### LaravelのPolicy・Middlewareによるロール制御
「求職者が企業の求人を編集できない」「企業が他社の求人を操作できない」といった細かい権限設定を、PolicyとカスタムMiddlewareで実装しました。ルートモデルバインディングの命名ルールにもハマりましたが、理解が深まりました。


---
## AI診断の仕組み
 
このアプリのAI分析は **2段階** で動いています。用途によって使い分けているのがポイントです。
 
### 段階1 : スキル適合度（常時表示）— Laravel側で計算
 
```
求職者のスキル  ["PHP", "Laravel", "React"]
        ↕ 比較（Jaccard係数）
求人の必須スキル ["PHP", "Laravel", "MySQL"]
 
共通スキル   : PHP, Laravel（2個）
全スキル合計 : PHP, Laravel, React, MySQL（4個）
スキル適合度 = 2 ÷ 4 × 100 = 50%
```
 
求人一覧を表示する際にLaravelのPHPで全求人分を一括計算し、求人カードに `スキル適合 50%` として **常時表示** します。Pythonは使いません。
 
### 段階2 : AIマッチ診断（ボタン押下時のみ）— Python × Gemini API
 
「AIマッチ診断」ボタンを押した時だけPythonを呼び出し、以下の情報をすべてGemini APIに渡して分析します。
 
| Geminiに渡す情報 | 内容 | 空の場合 |
|----------------|------|---------|
| 求職者のスキル | 登録したスキルタグ | スコア0点 |
| 求職者の自己紹介（bio） | プロフィールの自己紹介文 | スキルのみで分析 |
| 求人の必須スキル | 求人票のスキルタグ | 必須 |
| 求人の仕事内容（description） | 求人票の詳細文 | 詳細なし扱いで分析 |
| スキル適合度スコア | 段階1で計算した数値 | 必須 |
 
> **自己紹介と求人詳細をしっかり書くほど、AIの分析精度が上がります。**
> 自己紹介が未入力の場合はスキルの一致度のみで判定しますが、
> 自己紹介を書いていると「経験・志向性・人柄」まで加味した深い分析が返ってきます。
 
---
 
## 主な機能
 
| 機能名 | 内容 |
|--------|------|
| スキル適合度（常時表示） | LaravelのJaccard係数でスキル一致度を計算し0〜100%を求人カードに常時表示。Pythonは不使用 |
| AIマッチ診断 | ボタンを押した時だけGemini APIを呼び出し。スキル・自己紹介・求人詳細を総合して日本語で分析 |
| 企業向けAI採用分析 | 応募者の自己紹介・スキル・求人詳細をもとに採用コンサルタント視点で即戦力性・懸念点を分析 |
| 求人CRUD | 企業が求人の新規作成・編集・削除・公開/非公開の切替が可能。自社求人のみ操作可 |
| 3ロール認可 | 求職者・企業・管理者でアクセスできるページ・APIを完全分離 |
| 求人検索・フィルター | キーワード・スキルタグ・勤務地での絞り込み検索。JSONカラム内検索も実装 |
| 求人応募 | 応募ボタン1クリックで完了。AI診断結果があれば応募時のスコア・理由文も一緒に保存 |
| 選考ステータス管理 | 企業ダッシュボードのセレクトボックスで応募中→書類選考→面接→内定→不採用をリアルタイム更新 |
| プロフィール管理 | 求職者は自己紹介・スキルタグ・希望年収・希望勤務地を登録。スキル適合度とAI診断両方のベースになる |
| 管理者パネル | 全ユーザー・全求人の一覧表示。求人の強制公開/非公開切替・統計サマリー表示 |
| マイページ | 応募履歴・AI診断結果・プロフィール編集をタブ切替で一画面に集約 |
| リアルタイム・メッセージ | 企業と求職者間のダイレクトメッセージ機能。面接日程の調整や質問が可能。10秒ごとの自動更新機能を搭載 |
---


 
## 使用技術
 
| カテゴリ | 技術 | 用途 |
|----------|------|------|
| フロントエンド | Next.js 15+ (App Router) | UI・ルーティング・SSR |
| | TypeScript | 型安全な開発 |
| | Tailwind CSS | スタイリング |
| | React Hooks (useState, useEffect) | 状態管理 |
| | Axios | API通信・認証トークン管理 |
| バックエンド | Laravel 12 / PHP 8.4 | REST API・認証・DB操作 |
| | Laravel Sanctum | APIトークン認証 |
| | Laravel Policy / Middleware | ロール認可・アクセス制御 |
| AI解析 | Python 3.12 / FastAPI | AI解析マイクロサービス |
| | Google Gemini API | マッチ理由文・採用分析の生成 |
| | Jaccard係数（Laravel側） | 求人カード常時表示のスキル一致度計算 |
| | Jaccard係数（Python側） | AI診断時のスコア計算（Gemini呼び出しとセット） |
| インフラ・DB | MySQL 8.0 | データ保存 |
| | Docker / nginx 1.21.1 | コンテナ環境構築 |
| | phpMyAdmin | DB管理GUI |
| 開発ツール | GitHub | バージョン管理 |
| | npm / composer | パッケージ管理 |
 
---
 
## データベース設計
 
### usersテーブル
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| name | string | 氏名 |
| email | string | メールアドレス（Unique） |
| password | string | パスワード（Hash） |
| role | string | 役割: jobseeker / company / admin |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |
 
### profilesテーブル（求職者プロフィール）
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| user_id | BigInt | 外部キー（users.id） |
| bio | text | 自己紹介文（AI診断の精度に影響） |
| skills | json | スキル配列 例: ["PHP","Laravel"]（スキル適合度・AI診断のベース） |
| preferred_salary | integer | 希望年収（万円） |
| preferred_location | string | 希望勤務地 |
 
### companiesテーブル（企業情報）
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| user_id | BigInt | 外部キー（users.id） |
| company_name | string | 会社名 |
| description | text | 会社説明 |
| location | string | 所在地 |
 
### job_postingsテーブル（求人情報）
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| company_id | BigInt | 外部キー（companies.id） |
| title | string | 求人タイトル |
| description | text | 求人詳細（AI診断の精度に影響） |
| required_skills | json | 必須スキル配列（スキル適合度・AI診断のベース） |
| salary_min | integer | 最低年収（万円） |
| salary_max | integer | 最高年収（万円） |
| location | string | 勤務地 |
| status | enum | open / closed（公開/非公開） |
 
### applicationsテーブル（応募情報）
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| user_id | BigInt | 外部キー（users.id） |
| job_posting_id | BigInt | 外部キー（job_postings.id） |
| status | enum | applying / screening / interview / offered / rejected |
| match_score | integer | AIマッチスコア（応募時に保存） |
| match_reason | text | AIマッチ理由文（応募時に保存） |
| company_ai_comment | text | 企業向けAI採用分析コメント |
 
### match_previewsテーブル（AI診断一時保存）
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| user_id | BigInt | 外部キー（users.id） |
| job_posting_id | BigInt | 外部キー（job_postings.id） |
| match_score | integer | 診断スコア（0〜100） |
| match_reason | text | Gemini AIが生成した理由文 |
 

### messagesテーブル（メッセージ履歴）
 
| カラム名 | 型 | 詳細 |
|----------|----|------|
| id | BigInt | プライマリキー |
| application_id | BigInt | 外部キー（applications.id）どの応募に関するやり取りか |
| sender_id | BigInt | 外部キー（users.id）送信者のユーザーID |
| content | text | メッセージ本文 |
| is_read | boolean | 既読フラグ（false: 未読 / true: 既読） |
| created_at | timestamp | 送信日時 |
| updated_at | timestamp | 更新日時 |

---
 
## ディレクトリ構成
 
```
job/
├── .env                    ← Docker用（DB設定・GeminiAPIキー）
├── .env.example
├── .gitignore
├── docker-compose.yml
├── docker/
│   ├── nginx/default.conf
│   ├── php/Dockerfile・php.ini
│   ├── mysql/my.cnf・data/
│   ├── next/Dockerfile
│   └── python/Dockerfile
├── laravel/                ← Laravel 12（バックエンド）
│   └── .env                ← Laravel用（DB接続・APP_KEY）
├── frontend/               ← Next.js 15+（フロントエンド）
│   └── .env.local          ← Next.js用（API URL）
└── python/                 ← FastAPI（AI解析サービス）
    ├── main.py
    ├── matcher.py
    ├── gemini.py
    └── requirements.txt
```
 
---
 
## セットアップ方法
 
### 前提条件
- Docker / Docker Compose がインストール済みであること
- Node.js 20以上がインストール済みであること
- Google Gemini APIキーを取得済みであること
 
---
 
### 手順1 : リポジトリをクローン
 
```bash
git clone git@github.com:ando625/jobmatchAI.git
cd jobmatchAI
```
 
---
 
### 手順2 : プロジェクトルートに .env を作成
 
```env
DB_ROOT_PASSWORD=rootpassword
DB_DATABASE=jobmatch_db
DB_USERNAME=jobmatch_user
DB_PASSWORD=jobmatch_pass
GEMINI_API_KEY=取得したGemini APIキーをここに貼り付け
```
 
---
 
### 手順3 : Dockerコンテナを起動
 
```bash
docker compose up -d --build
```
 
---
 
### 手順4 : Laravel の初期設定
 
```bash
# phpコンテナに入る
docker compose exec php bash
 
# .envをコピーして編集
cp .env.example .env
```
 
`.env` を開き、以下のDB設定に書き換えてください。
 
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=jobmatch_db
DB_USERNAME=jobmatch_user
DB_PASSWORD=jobmatch_pass
AI_SERVICE_URL=http://python:8000
```
 
続けて以下のコマンドを実行します。
 
```bash
composer install
php artisan install:api
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan key:generate
php artisan migrate:fresh --seed
```
 
---
 
### 手順5 : Next.js の初期設定
 
`frontend` フォルダ直下に `.env.local` を新規作成し、以下を書き込んでください。
 
```env
NEXT_PUBLIC_API_URL=http://localhost/api
```
 
```bash
cd frontend
npm install
```
 
---
 
### 手順6 : アクセス確認
 
| サービス | URL |
|----------|-----|
| フロントエンド（Next.js） | http://localhost:3000 |
| バックエンドAPI（Laravel） | http://localhost:80 |
| DB管理画面（phpMyAdmin） | http://localhost:8080 |
| AI解析サーバー（FastAPI） | http://localhost:8001 |
 
---
 
## テストアカウント
 
> `php artisan migrate:fresh --seed` 実行後に自動生成されます。
 
| ロール | メールアドレス | パスワード |
|--------|---------------|-----------|
| 求職者 | yamada@gmail.com | pass1234 |
| 企業① | tech@example.com | pass1234 |
| 企業② | design@example.com | pass1234 |
| 管理者 | admin@example.com | pass1234 |
 
---
 
### アクセス情報
* **Frontend**:  http://localhost:3000 


---
## phpMyAdmin

- URL: http://localhost:8080/
- ユーザー名・パスワードは `.env` と同じ
- DB: `laravel_db` を確認可能

















