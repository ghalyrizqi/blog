import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const fontData = readFileSync(
    path.join(process.cwd(), 'public/fonts/ManufacturingConsent-Regular.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          borderRadius: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'ManufacturingConsent',
            fontSize: 26,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          G
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'ManufacturingConsent',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
