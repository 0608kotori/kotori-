import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "宇航员 ASTRONAUTS — 学生未来科技探索团队";
const description =
  "一群年轻人因好奇聚集，用 AI、数字技术与实验，探索科技与人类未来的交汇点。";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://future-explorers-website.207188250.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "宇航员 ASTRONAUTS",
  authors: [{ name: "宇航员 ASTRONAUTS" }],
  creator: "宇航员 ASTRONAUTS",
  publisher: "宇航员 ASTRONAUTS",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "宇航员",
    "Astronauts",
    "学生创新团队",
    "AI",
    "未来科技",
    "Humanity",
    "Innovation",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_CN",
    siteName: "宇航员 ASTRONAUTS",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "宇航员 ASTRONAUTS — Explore what could be.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="modulepreload"
          href="/vendor/google-model-viewer.min.js"
        />
        <link
          rel="preload"
          href="/models/luo-tianbiao-astronaut.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/models/he-xin-astronaut-bear.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/models/chen-jiangluan-astronaut.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
