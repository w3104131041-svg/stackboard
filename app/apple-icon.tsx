import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
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
            'linear-gradient(180deg, #05110d 0%, #02100c 100%)',
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 50,
              height: 10,
              borderRadius: 10,
              background: '#10b981',
            }}
          />
          <div
            style={{
              width: 60,
              height: 10,
              borderRadius: 10,
              background: '#10b981',
            }}
          />
          <div
            style={{
              width: 70,
              height: 10,
              borderRadius: 10,
              background: '#10b981',
            }}
          />
        </div>
      </div>
    ),
    size
  )
}