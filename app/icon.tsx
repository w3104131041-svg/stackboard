import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(180deg, rgba(16,185,129,1) 0%, rgba(6,95,70,1) 100%)',
          color: 'white',
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: '-0.08em',
        }}
      >
        S
      </div>
    ),
    size
  )
}