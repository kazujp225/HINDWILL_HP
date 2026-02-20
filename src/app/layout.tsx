import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { LoadingProvider } from "@/contexts/LoadingContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "株式会社HINDWILL | HINDWILL Inc.",
  description: "Beyond the Technology. テクノロジーが届かない、最後の1マイルを。ハンズオン型コンサルティングサービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="overflow-x-hidden" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${notoSansJP.variable} antialiased overflow-x-hidden`}>
        <LoadingProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </LoadingProvider>
      </body>
    </html>
  );
}
