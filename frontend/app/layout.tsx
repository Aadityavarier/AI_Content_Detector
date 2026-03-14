import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Veridian — AI Content Detector',
  description: 'Detect AI-generated text, audio, and video with advanced ML models.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { 
            background-color: #020408 !important; 
            color: #fff !important; 
            min-height: 100vh;
            background-image: linear-gradient(rgba(0,255,135,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.025) 1px, transparent 1px);
            background-size: 50px 50px;
          }
        `}</style>
      </head>
      <body style={{ backgroundColor: '#020408', color: '#fff', margin: 0, minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}