import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "CipherImage - 密钥图片隐写工具",
  description:
    "一个基于密钥的图像隐写工具，用于在图像中安全地隐藏和提取文本信息。使用LSB隐写技术和伪随机密钥系统，确保隐藏信息的安全性。⭐ GitHub: https://github.com/14790897/CipherImage",
  keywords: [
    "隐写术",
    "图像隐写",
    "LSB",
    "密钥加密",
    "信息隐藏",
    "steganography",
    "GitHub",
    "开源",
  ],
  authors: [{ name: "CipherImage Team" }],
  creator: "CipherImage",
  openGraph: {
    title: "CipherImage - 密钥图片隐写工具",
    description: "安全地在图像中隐藏和提取文本信息 ⭐ 请给我们GitHub点星支持！",
    url: "https://github.com/14790897/CipherImage",
    siteName: "CipherImage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CipherImage - 密钥图片隐写工具",
    description:
      "安全地在图像中隐藏和提取文本信息 ⭐ GitHub: https://github.com/14790897/CipherImage",
  },
  other: {
    "github-repo": "https://github.com/14790897/CipherImage",
    "call-to-action": "⭐ 如果喜欢这个项目，请给我们GitHub点星支持！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="github-repo"
          content="https://github.com/14790897/CipherImage"
        />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body>{children}</body>
    </html>
  );
}
