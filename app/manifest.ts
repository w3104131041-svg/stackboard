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
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}