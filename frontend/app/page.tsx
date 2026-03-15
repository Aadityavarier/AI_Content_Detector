import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import UploadBox from '@/components/UploadBox'
import HowItWorks from '@/components/HowItWorks'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{ position: 'relative' }}>
      <div className="scan-line" />
      <Navbar />
      <HeroSection />
      <UploadBox />
      <HowItWorks />
      <StatsSection />

      {/* About section */}
      <section id="about" style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,135,0.02) 50%, transparent 100%)'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>

          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            letterSpacing: '3px', color: 'rgba(0,255,135,0.5)',
            textTransform: 'uppercase', marginBottom: '16px'
          }}>// ABOUT THE PROJECT</p>

          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: 'clamp(32px, 5vw, 52px)', color: '#fff',
            marginBottom: '28px', lineHeight: '1.05', letterSpacing: '-1px'
          }}>
            Why We Built This
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '16px',
            lineHeight: '1.85', marginBottom: '20px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            As AI-generated content floods the internet, the ability to verify
            authenticity becomes critical. Veridian is a free, open-source tool
            that brings state-of-the-art ML detection to everyone — no paid
            subscription, no proprietary black box.
          </p>

          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '14px',
            lineHeight: '1.85', marginBottom: '48px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Built as a student project using entirely free and open-source tools:
            HuggingFace Transformers, PyTorch, Next.js 14, FastAPI, and Supabase.
            The full codebase is available on GitHub under the MIT license.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/detect" style={{
              background: '#00FF87', color: '#020408',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
              fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '16px 32px', borderRadius: '10px', textDecoration: 'none',
              boxShadow: '0 0 30px rgba(0,255,135,0.25)',
              display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}>
              TRY IT NOW →
            </a>
            <a
              href="https://github.com/Aadityavarier/AI_Content_Detector"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                letterSpacing: '2px', textTransform: 'uppercase',
                padding: '16px 32px', borderRadius: '10px', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              ⭐ STAR ON GITHUB
            </a>
          </div>

          {/* Tech badges */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            justifyContent: 'center', marginTop: '48px'
          }}>
            {['Next.js 14', 'FastAPI', 'PyTorch', 'HuggingFace', 'Supabase', 'MIT License'].map(t => (
              <span key={t} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                color: 'rgba(255,255,255,0.35)', letterSpacing: '1px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '6px 14px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.02)'
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}