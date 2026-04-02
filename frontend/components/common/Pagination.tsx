'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Divide } from 'lucide-react';

interface PaginationProps{
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageChange }) => {
    //1ページしかなければボタンは必要ないので表示しない
    if (lastPage <= 1) return null;

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            {/* 前のページへ戻るボタン */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='p-2 rounded-md border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors'
            >
                <ChevronLeft size={20} />
            </button>


            {/* ページ番号の数字ボタン */}
            <div className="flex items-center space-x-1">
                {[...Array(lastPage)].map((_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-[#534AB7] text-white border-[#534AB7]' // 今のページは紫
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' // 他は白
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

            </div>

            {/* 次のページに進むボタン */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage} // 最後のページなら押せないようにする
                className="p-2 rounded-md border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};