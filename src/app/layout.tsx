// app/layout.tsx
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Settings from "../components/layout/Settings";
import Providers from "./Provider";

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
          {children}
          <Settings />
        </Providers>
      </body>
    </html>
  );
}