import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Dithering } from "@paper-design/shaders-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hey Sanka – Build & Deploy Apps with Your Voice",
  description:
    "Talk to Sanka, your AI coder. Generate apps by voice, preview instantly in-browser, push to GitHub, and deploy to Vercel – no setup, no login.",
  keywords: [
    "AI coding",
    "voice to code",
    "AI app builder",
    "Next.js generator",
    "GitHub deploy",
    "Vercel deploy",
    "AI developer tool",
    "speech to code",
    "AI coding assistant",
    "code generator",
  ],
  authors: [{ name: "Nakul Chouksey" }],
  creator: "Nakul Chouksey",
  openGraph: {
    title: "Hey Sanka – Build & Deploy Apps with Your Voice",
    description:
      "Say it, see it, ship it. Sanka turns your words into live apps, pushes to GitHub, and deploys on Vercel instantly.",
    url: "https://hey.sanka.pro",
    siteName: "Hey Sanka",
    images: [
      {
        url: "https://hey.sanka.pro/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hey Sanka – Voice to Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hey Sanka – Build & Deploy Apps with Your Voice",
    description:
      "AI that codes and deploys when you speak. Zero setup. GitHub + Vercel handled automatically.",
    images: ["https://hey.sanka.pro/og-image.png"],
    creator: "@heynakul",
  },
  // metadataBase: new URL("https://hey.sanka.pro"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full">
            <Dithering
              className="h-full w-full"
              // width={typeof window !== "undefined" ? window.innerWidth : 1280}
              // height={typeof window !== "undefined" ? window.innerHeight : 720}
              colorBack="#000000"
              colorFront="#0a0a0a"
              shape="simplex"
              type="4x4"
              pxSize={2}
              speed={1}
              scale={0.6}
            />
          </div>
          <p className="absolute top-1/2 left-[48.58%] -translate-x-1/2 -translate-y-1/2 text-[#ffffff04] text-[43rem] instrument-serif">
            Sanka
          </p>
          {children}
        </div>
      </body>
    </html>
  );
}
