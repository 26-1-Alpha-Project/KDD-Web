import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "KDD - Kookmin Digital Dog",
  description: "국민대학교 소융대학 특화 AI RAG 에이전트 챗봇 개발 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={''}
      >
        {children}
      </body>
    </html>
  );
}
