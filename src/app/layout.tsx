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

const SITE_URL = "https://hindwill.com";
const SITE_NAME = "株式会社HINDWILL";
const SITE_DESCRIPTION =
  "Beyond the Technology. テクノロジーが届かない、最後の1マイルを。ハンズオン型コンサルティングサービスです。";
const OG_IMAGE = `${SITE_URL}/images/logo.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | HINDWILL Inc.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "HINDWILL",
    "株式会社HINDWILL",
    "ハンドウィル",
    "セールスコンサルティング",
    "ハンズオンコンサルティング",
    "Beyond the Technology",
    "橋爪拓海",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | HINDWILL Inc.`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | HINDWILL Inc.`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const NAV_LINKS = [
  { name: "TOP", url: SITE_URL },
  { name: "WE ARE", url: `${SITE_URL}/weare` },
  { name: "BUSINESS", url: `${SITE_URL}/service` },
  { name: "COMPANY", url: `${SITE_URL}/company` },
  { name: "FAQ", url: `${SITE_URL}/faq` },
  { name: "NEWS", url: `${SITE_URL}/news` },
  { name: "CONTACT", url: `${SITE_URL}/contact` },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "HINDWILL Inc.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    image: OG_IMAGE,
    description: SITE_DESCRIPTION,
    email: "takumi.hashizume@hindwill.com",
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      name: "橋爪 拓海",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "東京都",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "takumi.hashizume@hindwill.com",
        availableLanguage: ["Japanese", "English"],
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "HINDWILL Inc.",
    url: SITE_URL,
    inLanguage: "ja",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.svg`,
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} ナビゲーション`,
    itemListElement: NAV_LINKS.map((link, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: link.name,
      url: link.url,
    })),
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="overflow-x-hidden" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${notoSansJP.variable} antialiased overflow-x-hidden`}>
        <script
          type="application/ld+json"
          // JSON-LD must be raw JSON; we control the source so this is safe
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <LoadingProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </LoadingProvider>
      </body>
    </html>
  );
}
