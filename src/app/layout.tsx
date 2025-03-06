import type { Metadata } from "next";
import "./globals.css";
import Settings from "../components/layout/Settings";
import Providers from "./Provider";
import Navbar from "@/components/layout/Navbar";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

export const metadata: Metadata = {
  title: "اپلیکیشن پاسخبرگ",
  description: "ابزار حرفه ای برای تحلیل آزمون ها",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`antialiased`}>
        <Providers>
          <div className="w-full h-full z-10">
            {children}
            <Navbar />
            <Settings />
          </div>
          <div className="blob-container">
            <div className="blob blob-one"></div>
            <div className="blob blob-two"></div>
            <div className="blob blob-three"></div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
