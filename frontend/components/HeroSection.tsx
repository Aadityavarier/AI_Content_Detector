'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '120px 24px 60px',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,255,135,0.05) 0%, transparent 70%)'
      }} />

      {/* Status pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        border: '1px solid rgba(0,255,135,0.2)', borderRadius: '999px',
        padding: '6px 16px', marginBottom: '32px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
        letterSpacing: '2px', color: 'rgba(0,255,135,0.7)', textTransform: 'uppercase'
      }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#00FF87', display: 'inline-block',
          animation: 'pulse 2s infinite'
        }} />
        Models Online — Free &amp; Open Source
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>

      {/* Heading */}
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 900,
        fontSize: 'clamp(52px, 10vw, 96px)', lineHeight: '0.9',
        letterSpacing: '-2px', marginBottom: '24px'
      }}>
        <span style={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>KNOW</span>
        <span className="shimmer-text" style={{ display: 'block' }}>WHAT'S REAL</span>
      </h1>

      <p style={{
        color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.7',
        maxWidth: '460px', margin: '0 auto 36px',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        Advanced AI detection for text, audio, and video.
        Powered by open-source ML models — no signup, no cost.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '64px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/detect" style={{
          background: '#00FF87', color: '#020408',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
          boxShadow: '0 0 20px rgba(0,255,135,0.3)'
        }}>
          START DETECTING →
        </Link>
        <a href="#how-it-works" style={{
          border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
          letterSpacing: '2px', textTransform: 'uppercase',
          padding: '14px 28px', borderRadius: '8px', textDecoration: 'none'
        }}>
          HOW IT WORKS ↓
        </a>
      </div>

      {/* Detection type badges */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '56px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '📝', label: 'Text', sub: 'GPT · Claude · Gemini' },
          { icon: '🎵', label: 'Audio', sub: 'Voice clones · TTS' },
          { icon: '🎬', label: 'Video', sub: 'Deepfakes · Synthetic' },
        ].map(b => (
          <div key={b.label} style={{
            background: 'rgba(6,13,20,0.8)', border: '1px solid rgba(0,255,135,0.15)',
            borderRadius: '16px', padding: '20px 28px', textAlign: 'center', minWidth: '120px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{b.icon}</div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
              color: '#00FF87', letterSpacing: '1px', textTransform: 'uppercase'
            }}>{b.label}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{b.sub}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { v: '94.2%', l: 'Text Accuracy' },
          { v: '87.6%', l: 'Audio Accuracy' },
          { v: '91.3%', l: 'Video Accuracy' },
          { v: '<3s', l: 'Analysis Time' },
        ].map(s => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '26px',
              color: '#00FF87', textShadow: '0 0 20px rgba(0,255,135,0.3)'
            }}>{s.v}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
              color: 'rgba(255,255,255,0.3)', letterSpacing: '2px',
              textTransform: 'uppercase', marginTop: '4px'
            }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
