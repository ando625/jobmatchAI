// ===== types/auth.ts =====
// 「型定義ファイル」= データの設計図だけを書く場所
// ロジック（処理）は一切書かない、型の定義だけ！

// ============================================================
// User 型
// ============================================================
// type = 「このオブジェクトはこういう形をしています」という約束
// Laravelの /api/me が返すデータの形と一致させる
export type User = {
    id: number;
    name: string;
    email: string;
    role: string;  //役割：jobseeker,company,admin
}

// ============================================================
// AuthContext が持つ値の型
// ============================================================
// どのページからでも useAuth() で取り出せるものの設計図
export type AuthContextType = {
    user: User | null        //ログイン中のユーザー情報
    token: string | null     //Sanctumのアクセストークン
    isLoading: boolean       //認証状態を確認中か？
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string, role: string,passwordConfirm: string) => Promise<void>
    logout: ()=>Promise<void>

}




// ============================================================
// API レスポンスの型
// ============================================================

// Laravelが返すJSON の形を TypeScript に教える
// ログイン・登録のレスポンス
// { token: "1|abc...", user: { id: 1, name: "田中", ... } }
export type AuthResponse = {
    token: string     //Sanctumが発行したトークン文字列
    user: User        //ユーザー情報
}

// エラーレスポンスの型
// { message: "The email field is required.", errors: { email: [...] } }
export type ApiError = {
    message: string; //エラー概要のメッセージ
    errors?: Record<string, string[]>;
    // ↑ バリデーションエラーの詳細
    // Record<string, string[]> = Recordは記録帳　->{ キー名: [エラー文字列の配列] } キーが文字列で値も文字列の型定義　と配列なのはemailの中にも入力必須とエールアドレス形式でとか１つの要素に対して複数のエラーがある可能性があるから
    // 例: { email: ["メールは必須です"], password: ["8文字以上必要です"] }
};