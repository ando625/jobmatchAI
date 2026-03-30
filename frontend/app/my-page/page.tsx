// frontend/src/my-page/page.tsx



import MyPageDashboard from '@/components/dashboard/MyPageDashboard';

export default function MyPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
        {/* min-h-screen = 最低でも画面の高さいっぱい */}
        {/* bg-[#F9FAFB] = デザインシステムの背景色 */}
            <MyPageDashboard />
        </div>
    );
}