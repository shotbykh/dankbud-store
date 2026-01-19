import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'DankBud | Members Only';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const textureUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/assets/acid_ribbon_texture_v1.png` 
    : 'http://localhost:3000/assets/acid_ribbon_texture_v1.png';

  return new ImageResponse(
    (
      <div
        style={{
            background: '#fff', // Bright base
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: 'sans-serif',
            overflow: 'hidden',
        }}
      >
        {/* 1. ACID RIBBON BACKGROUND (Full Bleed) */}
        <img 
            src={textureUrl}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.2)', // Zoom in to get abstract curves
            }} 
        />
        
        {/* 2. THE SWISS GRID (Black Lines) */}
        {/* Vertical Lines */}
        <div style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.5)' }} />
        {/* Horizontal Lines */}
        <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.5)' }} />

        {/* 3. MASSIVE TYPOGRAPHY (The Reference Style) */}
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '40px',
            zIndex: 10,
        }}>
            <div style={{
                fontSize: 220,
                lineHeight: 0.8,
                fontWeight: 900,
                color: '#000', // Black text on color
                letterSpacing: '-0.06em',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <span>DANK</span>
                <span>BUD</span>
            </div>
        </div>

        {/* 4. CORNER DATA (The "Data" Look) */}
        <div style={{ position: 'absolute', top: 30, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
             <div style={{ fontSize: 60, fontWeight: 900, color: '#000', lineHeight: 0.9 }}>EST.</div>
             <div style={{ fontSize: 60, fontWeight: 900, color: '#000', lineHeight: 0.9 }}>2026</div>
        </div>

        <div style={{ position: 'absolute', bottom: 30, right: 40, background: '#000', color: '#fff', padding: '10px 30px', fontSize: 24, fontWeight: 900, borderRadius: '100px' }}>
            dankbud.co.za
        </div>

      </div>
    ),
    {
      ...size,
    }
  );
}
