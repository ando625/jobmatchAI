// お客がログイン中かどうか全フロアのフタッフが知れる共有ボードイメージ

'use client';



import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import type { User, AuthContextType } from '@/types/auth';


//「認証情報」を書き込むための、家中の誰もが見れる 「掲示板」
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

//↓実行　認証情報を子供全員に教える
export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // ----------------------------------------------------------
    // ページリロード時にセッションから認証情報を復元
    // ----------------------------------------------------------
    // app/contexts/AuthContext.tsx

    useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    console.log("チェック開始:", { savedToken, savedUser });

    // ── 修正ポイント：条件を詳しくチェック ──
    // 1. savedToken がある
    // 2. savedUser がある
    // 3. savedUser の中身が、変な文字列 "undefined" ではない
    if (savedToken && savedUser && savedUser !== "undefined") {
        try {
            // ここで解読（JSON.parse）に挑戦！
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        } catch (error) {
            // もし小包（データ）が壊れていて解読できなかったら...
            console.error("データの解読に失敗しました:", error);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
        }
    } else {
        console.log("ログイン情報が見つからない、または不完全です");
    }
    
    setIsLoading(false);
}, []);


    // ----------------------------------------------------------
    // login 関数
    // ----------------------------------------------------------

    const login = async (email: string, password: string): Promise<void> => {
        const response = await authApi.login(email, password);
        const resData = response.data;

        // ── 修正ポイント：Laravelの実際の形に合わせる ──
        const newToken = resData.access_token; // token ではなく access_token


        if (!newToken) {
            console.error("トークンが届いていません！:", resData);
            return;
        }

        // 状態を更新
        sessionStorage.setItem('token', newToken);
        setToken(newToken);

        try {
            const meRes = await authApi.getMe();
            const realUser = meRes.data.user;

            setUser(realUser);
            sessionStorage.setItem('user', JSON.stringify(realUser));
        } catch {
            const fallbackUser = {
                id: 0,
                name: email.split('@')[0],
                email,
                role: resData.role,
            };
            setUser(fallbackUser);
            sessionStorage.setItem('user', JSON.stringify(fallbackUser));
        }
        window.location.href = '/dashboard';

    }


    // ----------------------------------------------------------
    // register 関数
    // ----------------------------------------------------------
    const register = async (
        name: string,
        email: string,
        password: string,
        role: string,
    ): Promise<void> => {
        const response = await authApi.register(name, email, password, role);
        const resData = response.data; // 修正：一度変数に受ける

        // ── 修正ポイント：Laravelの実際の形（access_token）に合わせる ──
        const newToken = resData.access_token;
        

        if (!newToken) {
            console.error("登録後のトークンが届いていません！:", resData);
            return;
        }

        sessionStorage.setItem('token', newToken);
        setToken(newToken);

        try {
            const meRes = await authApi.getMe();
            const realUser = meRes.data.user;
            setUser(realUser);
            sessionStorage.setItem('user', JSON.stringify(realUser));
        } catch {
            const fallbackUser = { id: 0, name, email, role };
            setUser(fallbackUser);
            sessionStorage.setItem('user', JSON.stringify(fallbackUser));
        }

        window.location.href = '/dashboard';
    }
    // ----------------------------------------------------------
    // logout 関数
    // ----------------------------------------------------------
    const logout = async (): Promise<void> => {
        try {
            await authApi.logout();
        } catch {
            // Laravelへの通知が失敗してもフロントはログアウトする
        } finally {
            setToken(null);
            setUser(null);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user')
            window.location.href = "/login";
        }
    }


    // ----------------------------------------------------------
    // 共有ボードに渡す値をまとめる
    // ----------------------------------------------------------
    const value: AuthContextType = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )


}
