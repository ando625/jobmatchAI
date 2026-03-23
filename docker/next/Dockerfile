# next/Dockerfile
# 「Next.jsコンテナの作り方レシピ」

# node:20-alpine = Node.js20 の軽量版
FROM node:20-alpine

WORKDIR /app

# package.json と package-lock.json だけ先にコピー
# （依存関係が変わってないときはキャッシュを使って高速化する技）
COPY package*.json ./

# npm install = 必要なパッケージを全部インストール
RUN npm install

# ソースコードを全部コピー
COPY . .

# 3000番ポートを外に公開する
EXPOSE 3000

# コンテナ起動時に実行するコマンド
# npm run dev = 開発サーバーを起動
CMD ["npm", "run", "dev"]