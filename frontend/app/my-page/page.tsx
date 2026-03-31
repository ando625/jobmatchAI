// frontend/src/my-page/page.tsx



import MyPageDashboard from '@/components/dashboard/MyPageDashboard';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function MyPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
        <Header />

        {/* min-h-screen = 最低でも画面の高さいっぱい */}
        {/* bg-[#F9FAFB] = デザインシステムの背景色 */}
            <MyPageDashboard />

        <Footer />
        </div>
    );
}