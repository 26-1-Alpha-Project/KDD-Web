import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KDD | 소융대 AI RAG 에이전트",
  description:
    "국민대학교 소프트웨어융합대학 특화 AI RAG 기반 에이전트 — 학사 규정, 공지, FAQ를 스마트하게 탐색하세요.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" translate="no">
      <body className={`${inter.variable} ${notoSansKr.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
