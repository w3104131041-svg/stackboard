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
            'linear-gradient(180deg, #05110d 0%, #02100c 100%)',
        }}
      >
        {/* 外枠 */}
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(180deg, rgba(16,185,129,0.25), rgba(34,211,238,0.12))',
            boxShadow:
              '0 0 80px rgba(16,185,129,0.35), inset 0 0 40px rgba(16,185,129,0.2)',
          }}
        >
          {/* チップ（STACK） */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* 上 */}
            <div
              style={{
                width: 120,
                height: 26,
                borderRadius: 20,
                background:
                  'linear-gradient(90deg, #10b981, #22d3ee)',
                boxShadow: '0 0 18px rgba(16,185,129,0.6)',
              }}
            />
            {/* 中 */}
            <div
              style={{
                width: 140,
                height: 26,
                borderRadius: 20,
                background:
                  'linear-gradient(90deg, #10b981, #22d3ee)',
                boxShadow: '0 0 18px rgba(16,185,129,0.6)',
              }}
            />
            {/* 下 */}
            <div
              style={{
                width: 160,
                height: 26,
                borderRadius: 20,
                background:
                  'linear-gradient(90deg, #10b981, #22d3ee)',
                boxShadow: '0 0 18px rgba(16,185,129,0.6)',
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  )
}