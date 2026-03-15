'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(6,13,20,0.95)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,255,135,0.1)',
      padding: '0 20px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>

      {/* Logo */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px',
        color: '#00FF87', textDecoration: 'none', letterSpacing: '2px',
        flexShrink: 0
      }}>
        <div style={{
          width: '28px', height: '28px', border: '1px solid rgba(0,255,135,0.4)',
          borderRadius: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V8C13 11 10 13 7 13C4 13 1 11 1 8V4L7 1Z"
              stroke="#00FF87" strokeWidth="1.2" fill="none"/>
            <path d="M4.5 7L6.5 9L9.5 5.5"
              stroke="#00FF87" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        VERIDIAN
      </Link>

      {/* Desktop links — hidden on mobile */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px',
      }} className="desktop-nav">
        <Link href="/#how-it-works" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '2px', color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap'
        }}>
          How It Works
        </Link>
        <Link href="/#accuracy" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '2px', color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap'
        }}>
          Accuracy
        </Link>
        <Link href="/detect" style={{
          background: '#00FF87', color: '#020408',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          padding: '8px 18px', borderRadius: '6px', textDecoration: 'none',
          whiteSpace: 'nowrap'
        }}>
          Try Free →
        </Link>
      </div>

      {/* Mobile: Try Free button + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        className="mobile-nav">
        <Link href="/detect" style={{
          background: '#00FF87', color: '#020408',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
          padding: '8px 14px', borderRadius: '6px', textDecoration: 'none',
          whiteSpace: 'nowrap'
        }}>
          Try Free
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px', padding: '6px 8px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: '4px'
          }}
        >
          <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#00FF87' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? 'transparent' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#00FF87' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'rgba(6,13,20,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,255,135,0.1)',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          <Link href="/#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              letterSpacing: '2px', color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none', textTransform: 'uppercase',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
            How It Works
          </Link>
          <Link href="/#accuracy"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              letterSpacing: '2px', color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none', textTransform: 'uppercase',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
            Accuracy
          </Link>
          <Link href="/detect"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              letterSpacing: '2px', color: '#00FF87',
              textDecoration: 'none', textTransform: 'uppercase',
              padding: '12px 0'
            }}>
            Try Free →
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 640px) {
          .mobile-nav { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}