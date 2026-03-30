// ===== app/layout.tsx =====

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* <body> に Inter のクラスを当てる */}
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
