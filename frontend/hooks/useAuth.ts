// ===== hooks/useAuth.ts =====
// 役割：「共有ボードを取り出す道具（カスタムフック）」だけを書く
// どこからでも import { useAuth } from '@/hooks/useAuth' と
// 分かりやすく呼び出せる

'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/types/auth';;


//useAuth　カスタムフック
export function useAuth(): AuthContextType{
    // useContext(AuthContext) = 「AuthContext の共有ボードを読む
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            'useAuth() は AuthProvider の内側で使用してください。' +
            'layout.tsx で <AuthProvider> で包んでいるか確認してください。'
        )
    }
    return context;
    // ↑ { user, token, isLoading, login, register, logout } が返ってくる
}