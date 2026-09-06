import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

import { Toaster } from "@/components/Toaster";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
// import { Analytics } from "@/components/Analytics";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

const baseUrl = SITE_URL;

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "technology",
  metadataBase: new URL(baseUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_OG_DESCRIPTION,
    url: baseUrl,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/image.png",
        alt: `${SITE_NAME} – free developer utilities, no sign-up`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_OG_DESCRIPTION,
    images: ["/assets/image.png"],
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/assets/icon.png",
    apple: "/assets/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${firaCode.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
        <JsonLd />
        <Analytics />
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
