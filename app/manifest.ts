import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StackBoard',
    short_name: 'StackBoard',
    description: 'ホームゲームの開催、結果、収支、ランキングを管理するアプリ',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#05110d',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}