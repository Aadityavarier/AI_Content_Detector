'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(6,13,20,0.95)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,255,135,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: '64px'
    }}>
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px',
        color: '#00FF87', textDecoration: 'none', letterSpacing: '2px'
      }}>
        <div style={{
          width: '28px', height: '28px', border: '1px solid rgba(0,255,135,0.4)',
          borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V8C13 11 10 13 7 13C4 13 1 11 1 8V4L7 1Z" stroke="#00FF87" strokeWidth="1.2" fill="none"/>
            <path d="M4.5 7L6.5 9L9.5 5.5" stroke="#00FF87" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        VERIDIAN
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link href="/#how-it-works" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '2px', color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', textTransform: 'uppercase'
        }}>
          How It Works
        </Link>
        <Link href="/#accuracy" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '2px', color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none', textTransform: 'uppercase'
        }}>
          Accuracy
        </Link>
        <Link href="/detect" style={{
          background: '#00FF87', color: '#020408',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          padding: '8px 18px', borderRadius: '6px', textDecoration: 'none'
        }}>
          Try Free →
        </Link>
      </div>
    </nav>
  )
}
