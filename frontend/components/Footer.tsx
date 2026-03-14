'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0,255,135,0.08)',
      padding: '48px 24px', maxWidth: '1100px', margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
        <div style={{ maxWidth: '280px' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px',
            color: '#00FF87', letterSpacing: '2px', marginBottom: '12px'
          }}>VERIDIAN</div>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
            color: 'rgba(255,255,255,0.3)', lineHeight: '1.7'
          }}>
            Open-source AI content detection platform. Built for researchers,
            journalists, and everyone who wants to know what's real.
          </p>
        </div>
        <div>
          <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Product</h4>
          {['Text Detector', 'Audio Detector', 'Video Detector'].map(l => (
            <div key={l} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>{l}</div>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Stack</h4>
          {['Next.js 14', 'FastAPI', 'PyTorch', 'HuggingFace'].map(l => (
            <div key={l} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px'
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '1px' }}>
          © 2025 Veridian — MIT License
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.1)', letterSpacing: '1px' }}>
          Student project · Not for legal use
        </span>
      </div>
    </footer>
  )
}