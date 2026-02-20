import type { Metadata } from "next";
import "./globals.css";
import { AssessmentProvider } from "@/components/providers/AssessmentProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "SafeSexSafeMind",
  description: "แพลตฟอร์มให้ความรู้เชิงลึกเกี่ยวกับการตั้งครรภ์ไม่พร้อม การคุมกำเนิด และเพศศึกษาที่ถูกต้อง เหมาะสำหรับนักศึกษาและวัยรุ่น เพื่อการวางแผนชีวิตและการตัดสินใจที่มั่นใจ",
  icons: {
    icon: [
      { url: '/fav/favicon.ico' },
      { url: '/fav/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/fav/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/fav/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/fav/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/fav/apple-touch-icon.png' },
    ],
  },
  manifest: '/fav/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans antialiased bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300"
        style={{ fontFamily: '"Prompt", sans-serif' }}
      >
        <ThemeProvider>
          <AssessmentProvider>
            {children}
          </AssessmentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
