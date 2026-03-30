// ===== lib/axios.ts =====
// axiosの「カスタマイズされた通信機」を作るファイル
// ここで一度設定すれば、全APIリクエストに自動で適用される

import axios from "axios";

// ============================================================
// axios インスタンスを作る
// ============================================================
// axios.create() = 「設定済みの通信機」を作る関数
// デフォルトのaxiosをそのまま使わず、自分用にカスタムしたものを作る
const apiClient = axios.create({
    // baseURL = 「全リクエストのURL先頭に自動でつける文字列」
    // 例: baseURL が 'http://localhost' なら
    //   api.post('/api/auth/login') → 'http://localhost/api/auth/login' に送る
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost/api",

    // timeout = 「何ミリ秒待ってもレスポンスがなければエラー」
    // 10000ms = 10秒。サーバーが死んでいる時に永遠に待ち続けないようにする
    timeout: 10000,

    headers: {
        // Content-Type = 「送るデータはJSON形式ですよ」とサーバーに宣言
        "Content-Type": "application/json",
        // Accept = 「返してほしいデータはJSON形式でお願いします」
        Accept: "application/json",
    },
});


// ============================================================
// リクエスト インターセプター
// ============================================================
// インターセプター = 「通信の途中で割り込む処理」
// 郵便局で例えると「ポストに入れた手紙を配達前に全部チェックして
// 差出人の住所を自動で書き加える係」のイメージ
apiClient.interceptors.request.use(
    (config) => {
      // config = 「今から送ろうとしているリクエストの設定」
      // ここで config を書き換えると、実際に送る内容が変わる

      // sessionStorage からトークンを取り出す
      // typeof window !== 'undefined' = 「ブラウザ環境で動いているか確認」
      // Next.js はサーバー側でも実行されるので、この確認が必要！
        if (typeof window !== 'undefined') {
            const token = sessionStorage.getItem('token')

        if (token) {
                // Authorization ヘッダーにトークンを自動でセット
                // 'Bearer ' = Sanctum トークン認証の決まった形式（半角スペース重要！）
                // これがないと Laravel 側で「誰？」となって401エラーになる
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        // 書き換えた config を返す（これをしないと通信が止まる）
        return config
    },
    (error) => {
        // リクエストを送る前にエラーが起きた場合（ほぼ起きない）
        return Promise.reject(error)
    }
)


// ============================================================
// レスポンス インターセプター
// ============================================================
// 「Laravelから返ってきたデータを受け取る前に割り込む処理」
// 郵便局で例えると「届いた手紙を全部一度開けて
// 差出人確認して問題あればその場で処理する係」
apiClient.interceptors.response.use(
    (response) => {
        //成功はそのまま通す
        return response
    },

    (error) => {
        if (error.response?.status === 401) {
            // 401 = Unauthorized（認証エラー）
            // トークンが無効・期限切れの場合
            // sessionStorage をきれいにしてログインページへ飛ばす

            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('token')  //使えない通行書を没収破棄する
                sessionStorage.removeItem('user')
                //ログインページへリダイレクト
                window.location.href = '/login'
            }
        }

        //プログラムにエラーだった報告を伝える
        return Promise.reject(error)
    }
)

export default apiClient;