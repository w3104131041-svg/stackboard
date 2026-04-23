export default function manifest() {
  return {
    name: 'StackBoard',
    short_name: 'StackBoard',
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