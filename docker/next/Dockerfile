# docker/next/Dockerfile
# ビルド時にnpm installしない！起動後にやる方式に変更

FROM node:20-alpine

# 作業フォルダを指定
WORKDIR /app

# package.jsonのCOPYとnpm installを削除！
# → frontendが空でもエラーにならない

EXPOSE 3000

# コンテナ起動時のコマンドはdocker-compose.ymlのcommandで上書きされるのでここはshellだけ
CMD ["sh"]