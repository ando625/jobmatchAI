
// ===== components/common/Footer.tsx =====
// 全ページで共通のフッター部品
// 'use client' 不要（表示だけ・インタラクションなし）


import Link from 'next/link';


export function Footer() {
    return (
        <footer className="py-6 border-t border-gray-200 text-center bg-white">
                <p className="text-sm text-slate-400">
                    &copy; 2026 報告管理システム. All rights reserved.{' '}
                    <br className="sm:hidden" />
                    <span className="inline-block mt-2 sm:mt-0 sm:ml-4 text-[10px] uppercase tracking-widest bg-slate-100 px-2 py-1 rounded text-slate-500">
                        AIの解析結果は正確性を保証するものではありません
                    </span>
                </p>
                <div className="max-w-screen-md mx-auto text-center text-xs text-zinc-500 leading-relaxed mt-2">
                    <p className="text-[10px] sm:text-xs leading-tight">
                        このサイトで使用している画像素材は{' '}
                        <a
                            href="https://jp.freepik.com/"
                            target="_blank"
                            rel="noopener"
                            className="text-indigo-600 hover:underline"
                        >
                            Freepik
                        </a>{' '}
                        提供のものです。
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 mt-1 opacity-80">
                        Images used in this site are from{' '}
                        <a
                            href="https://jp.freepik.com/"
                            target="_blank"
                            rel="noopener"
                            className="text-indigo-600 hover:underline"
                        >
                            Freepik
                        </a>
                        .
                    </p>
                </div>
            </footer>
    )
}