import './globals.css'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'StackBoard',
  description: 'ポーカー会の開催・結果・ランキング管理サービス',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="page-noise min-h-screen text-white antialiased">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  )
}