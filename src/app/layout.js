import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "Quản Lý Phòng Máy",
  description: "Hệ thống quản lý phòng máy tính, mượn trả máy phòng lab.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={plusJakartaSans.variable}>
      <body>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
