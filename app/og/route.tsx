import { ImageResponse } from "next/og";

// Replace the old config export with this:
export const runtime = "edge";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Next.js Portfolio Starter";

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '12px 4px', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '4xl', fontWeight: 'bold', textAlign: 'center', margin: '0' }}>
            {title}
          </h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}