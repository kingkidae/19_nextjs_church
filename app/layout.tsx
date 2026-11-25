import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Header from "./_components/header";
import SocialLinks from "./_components/social-links";
import { getContent, SITE_URL } from "./_lib/content";
import "./globals.css";

// MaruBuri (Naver, OFL) for display and verses; Pretendard (OFL) for UI text.
const maru = localFont({
  src: [
    { path: "./fonts/MaruBuri-Regular.woff2", weight: "400" },
    { path: "./fonts/MaruBuri-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-maru",
  display: "swap",
});

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "45 920",
  variable: "--font-pretendard",
  display: "swap",
  preload: false, // 2MB variable font: let the serif hero load first
});

const description =
  "대구 북구 경북대학교 근처, 1971년에 세워진 대한예수교장로회 합동 동대구노회 대구신현교회입니다. 예배 시간, 온라인 예배, 교회 소식과 주보, 오시는 길을 안내합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "대구신현교회 | 대구 북구 경대 근처 장로교회", template: "%s | 대구신현교회" },
  description,
  applicationName: "대구신현교회",
  keywords: ["대구신현교회", "신현교회", "대구 교회", "대구 북구 교회", "경북대 교회", "산격동 교회", "대한예수교장로회 합동", "동대구노회", "주일예배", "새벽기도회"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ko_KR", siteName: "대구신현교회", url: "/", title: "대구신현교회", description, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "대구신현교회 — 일어나라 빛을 발하라" }] },
  twitter: { card: "summary_large_image", title: "대구신현교회", description, images: ["/og.jpg"] },
  formatDetection: { telephone: true, address: true },
  // set these env vars on Vercel after registering the site in Google Search Console / Naver Search Advisor
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.NAVER_SITE_VERIFICATION ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION } : undefined,
  },
};

// schema.org data so search engines and AI answers get the church facts right
async function JsonLd() {
  const { church, social, theme } = await getContent();
  const sameAs = Object.values(social).filter(Boolean);
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Church",
      "@id": `${SITE_URL}/#church`,
      name: church.name,
      alternateName: ["신현교회", "Daegu Shinhyun Church"],
      description,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
      image: `${SITE_URL}/og.jpg`,
      telephone: church.phone,
      foundingDate: church.founded,
      address: { "@type": "PostalAddress", streetAddress: church.address, addressLocality: "북구", addressRegion: "대구광역시", addressCountry: "KR" },
      geo: { "@type": "GeoCoordinates", latitude: 35.8912368, longitude: 128.6145396 },
      hasMap: church.naverPlace,
      memberOf: { "@type": "Organization", name: church.denomination },
      slogan: `${theme.title} — ${theme.line1} ${theme.line2}`.trim(),
      ...(sameAs.length ? { sameAs } : {}),
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: church.name, url: SITE_URL, inLanguage: "ko-KR", publisher: { "@id": `${SITE_URL}/#church` } },
  ];
  // JSON.stringify output is safe inside a script tag once "<" is escaped
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const viewport: Viewport = { themeColor: "#3d3023" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${maru.variable} ${pretendard.variable} antialiased`}>
      <body>
        <Header />
        {children}
        <SocialLinks />
        <JsonLd />
      </body>
    </html>
  );
}
