import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { JsonLd } from "@/components/JsonLd";
// import { Analytics } from "@/components/Analytics";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlinedevtools-three.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Online Dev Tools - Free Developer Utilities",
    template: "%s | Online Dev Tools",
  },
  description:
    "Free online developer tools: JSON formatter, JWT decoder, Base64 encoder, Unix timestamp converter, regex tester, and more. No installation required.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Online Dev Tools - Free Developer Utilities",
    description:
      "Free online developer tools: JSON formatter, JWT decoder, Base64 encoder, Unix timestamp converter, regex tester, and more.",
    url: baseUrl,
    siteName: "Online Dev Tools",
    type: "website",
    images: ["/assets/image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Dev Tools - Free Developer Utilities",
    description:
      "Free online developer tools: JSON formatter, JWT decoder, Base64 encoder, and more.",
    images: ["/assets/image.png"],
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
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
        <JsonLd />
        <Analytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
