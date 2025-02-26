import type { Metadata } from "next";
import "./globals.css";
import Settings from "../components/layout/Settings";

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
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
        <Settings/>
      </body>
    </html>
  );
}
