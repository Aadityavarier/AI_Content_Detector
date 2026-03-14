import Navbar from '@/components/Navbar'
import UploadBox from '@/components/UploadBox'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Detect — Veridian AI Detector',
}

export default function DetectPage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <div className="scan-line" />
      <Navbar />
      <div style={{ paddingTop: '96px' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px 0' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            letterSpacing: '3px',
            color: 'rgba(0,255,135,0.5)',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            // DETECTION ENGINE v1.0
          </p>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '12px'
          }}>
            AI Content Detector
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
            Paste text or upload audio/video. Results in seconds.
          </p>
        </div>
        <UploadBox />
      </div>
      <Footer />
    </main>
  )
}
