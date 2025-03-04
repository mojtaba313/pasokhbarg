// app/layout.tsx
import type { Metadata } from "next";
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
          {/* <AnimatedCursor
            innerSize={70}
            outerSize={0}
            innerScale={1.2}
            innerStyle={{
              opacity: 0.2,
              background:
                "radial-gradient(circle, rgba(2,0,36,0.5018382352941176) 0%, rgba(9,22,121,1) 49%, rgba(115,0,255,1) 74%, rgba(124,2,219,0.3253676470588235) 86%, rgba(176,13,13,0.26934523809523814) 100%)",
            }}
            outerScale={5}
            clickables={[
              "a",
              'input[type="text"]',
              'input[type="email"]',
              'input[type="number"]',
              'input[type="submit"]',
              'input[type="image"]',
              "label[for]",
              "select",
              "textarea",
              "button",
              ".link",
            ]}
            showSystemCursor
          /> */}
        </Providers>
      </body>
    </html>
  );
}
