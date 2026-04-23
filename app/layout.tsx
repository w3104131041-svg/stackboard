import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'StackBoard',
  description: 'ホームゲームの開催、結果、収支、ランキングを管理するアプリ',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'StackBoard',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="page-noise min-h-screen text-white antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}