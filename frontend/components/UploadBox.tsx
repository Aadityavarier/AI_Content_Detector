'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

type DetectionType = 'text' | 'audio' | 'video'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UploadBox() {
  const [activeTab, setActiveTab] = useState<DetectionType>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const hints: Record<DetectionType, string> = {
    text: 'Paste text from emails, essays, articles, or any content you want to verify.',
    audio: 'Upload audio files (MP3, WAV, OGG, FLAC, M4A). Max 50MB.',
    video: 'Upload video files (MP4, MOV, AVI, MKV, WEBM). Max 50MB.',
  }

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: activeTab === 'text',
  })

  const resetAll = () => {
    setText('')
    setFile(null)
    setResult(null)
    setError(null)
  }

  const switchTab = (tab: DetectionType) => {
    setActiveTab(tab)
    resetAll()
  }

  const handleSubmit = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      let response
      if (activeTab === 'text') {
        if (text.trim().length < 50) {
          setError('Please enter at least 50 characters.')
          setLoading(false)
          return
        }
        const form = new FormData()
        form.append('text', text)
        response = await axios.post(`${API_BASE}/detect/text`, form)
      } else if (activeTab === 'audio') {
        if (!file) { setError('Please select an audio file.'); setLoading(false); return }
        const form = new FormData()
        form.append('file', file)
        response = await axios.post(`${API_BASE}/detect/audio`, form)
      } else {
        if (!file) { setError('Please select a video file.'); setLoading(false); return }
        const form = new FormData()
        form.append('file', file)
        response = await axios.post(`${API_BASE}/detect/video`, form)
      }
      setResult({ ...response.data, type: activeTab })
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Detection failed. Please try again.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  const isReady = activeTab === 'text' ? text.trim().length >= 50 : !!file

  const aiProb = result
    ? (result.ai_probability ?? result.ai_generated_probability ?? result.deepfake_probability ?? 0)
    : 0
  const aiPct = Math.round(aiProb * 100)
  const humanPct = 100 - aiPct
  const isAI = aiProb >= 0.5

  return (
    <section id="detect" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            letterSpacing: '3px', color: 'rgba(0,255,135,0.5)',
            textTransform: 'uppercase', marginBottom: '12px'
          }}>// DETECTION ENGINE</p>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: 'clamp(28px, 4vw, 48px)', color: '#fff', marginBottom: '12px'
          }}>Analyze Content</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            Select the content type, upload or paste, and get your result in seconds.
          </p>
        </div>

        {/* Main card */}
        <div style={{
          background: 'rgba(6,13,20,0.85)',
          border: '1px solid rgba(0,255,135,0.15)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0,255,135,0.05)'
        }}>

          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,255,135,0.08)' }}>
            {(['text', 'audio', 'video'] as DetectionType[]).map(tab => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                style={{
                  flex: 1, padding: '16px', border: 'none', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                  background: activeTab === tab ? 'rgba(0,255,135,0.06)' : 'transparent',
                  color: activeTab === tab ? '#00FF87' : 'rgba(255,255,255,0.3)',
                  borderBottom: activeTab === tab ? '2px solid #00FF87' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'text' ? '📝' : tab === 'audio' ? '🎵' : '🎬'} {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: '28px 32px' }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
              color: 'rgba(255,255,255,0.25)', marginBottom: '16px', letterSpacing: '0.5px'
            }}>
              {hints[activeTab]}
            </p>

            {/* Text input */}
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setResult(null); setError(null) }}
                  placeholder="Paste text here to analyze..."
                  style={{
                    width: '100%', height: '180px',
                    background: 'rgba(10,21,32,0.6)',
                    border: '1px solid rgba(0,255,135,0.1)',
                    borderRadius: '12px', padding: '14px 16px',
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                    resize: 'none', outline: 'none', lineHeight: '1.6',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  color: 'rgba(255,255,255,0.2)', textAlign: 'right', marginTop: '6px'
                }}>
                  {text.length} / 50,000
                </p>
              </div>
            )}

            {/* File dropzone */}
            {activeTab !== 'text' && (
              <div
                {...getRootProps()}
                style={{
                  border: `2px dashed ${isDragActive ? 'rgba(0,255,135,0.6)' : file ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '14px', padding: '48px', textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragActive ? 'rgba(0,255,135,0.03)' : file ? 'rgba(0,229,255,0.03)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                      {activeTab === 'audio' ? '🎵' : '🎬'}
                    </div>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#00E5FF', fontWeight: 700 }}>
                      {file.name}
                    </p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); setFile(null); setResult(null) }}
                      style={{
                        marginTop: '10px', background: 'transparent', border: 'none',
                        color: 'rgba(255,61,87,0.6)', cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px'
                      }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '36px', marginBottom: '12px', color: 'rgba(255,255,255,0.2)' }}>⬆</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', marginBottom: '6px' }}>
                      {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
                    </p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
                      {activeTab === 'audio' ? 'MP3, WAV, OGG, FLAC, M4A' : 'MP4, MOV, AVI, MKV, WEBM'} · Max 50MB
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                marginTop: '14px', padding: '12px 16px',
                background: 'rgba(255,61,87,0.06)',
                border: '1px solid rgba(255,61,87,0.2)',
                borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start'
              }}>
                <span style={{ color: '#FF3D57', fontSize: '14px' }}>⚠</span>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,61,87,0.8)' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!isReady || loading}
              style={{
                marginTop: '20px', width: '100%', padding: '16px',
                border: 'none', borderRadius: '12px', cursor: isReady && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                background: isReady && !loading ? '#00FF87' : 'rgba(255,255,255,0.06)',
                color: isReady && !loading ? '#020408' : 'rgba(255,255,255,0.2)',
                boxShadow: isReady && !loading ? '0 0 20px rgba(0,255,135,0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'ANALYZING...' : `DETECT ${activeTab.toUpperCase()} →`}
            </button>

            {/* Loading bar */}
            {loading && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: '#00FF87', borderRadius: '2px',
                    animation: 'sweep 1.2s ease-in-out infinite',
                    width: '40%'
                  }} />
                </div>
                <style>{`@keyframes sweep { 0%{margin-left:0;width:0} 50%{margin-left:20%;width:60%} 100%{margin-left:100%;width:0} }`}</style>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '8px', letterSpacing: '1px'
                }}>
                  RUNNING ML INFERENCE...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Result card */}
        {result && (
          <div style={{
            marginTop: '20px', borderRadius: '20px', overflow: 'hidden',
            border: `1px solid ${isAI ? 'rgba(255,61,87,0.35)' : 'rgba(0,255,135,0.3)'}`,
            background: isAI ? 'rgba(255,61,87,0.04)' : 'rgba(0,255,135,0.04)'
          }}>
            {/* Result header */}
            <div style={{
              padding: '18px 28px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${isAI ? 'rgba(255,61,87,0.15)' : 'rgba(0,255,135,0.12)'}`,
              background: isAI ? 'rgba(255,61,87,0.06)' : 'rgba(0,255,135,0.05)'
            }}>
              <div>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'rgba(255,255,255,0.3)', letterSpacing: '2px',
                  textTransform: 'uppercase', marginBottom: '4px'
                }}>
                  {result.type?.toUpperCase()} ANALYSIS
                </p>
                <p style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '22px',
                  color: isAI ? '#FF3D57' : '#00FF87'
                }}>
                  {result.label}
                </p>
              </div>
              <button
                onClick={resetAll}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                  padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                  letterSpacing: '1px'
                }}
              >
                ↺ NEW
              </button>
            </div>

            {/* Result body */}
            <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>

              {/* Big percentage */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '72px',
                  lineHeight: 1, color: isAI ? '#FF3D57' : '#00FF87',
                  textShadow: `0 0 30px ${isAI ? 'rgba(255,61,87,0.3)' : 'rgba(0,255,135,0.3)'}`,
                  marginBottom: '8px'
                }}>
                  {aiPct}%
                </div>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase'
                }}>
                  AI PROBABILITY
                </p>
              </div>

              {/* Bars + meta */}
              <div>
                {/* AI bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>AI GENERATED</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: isAI ? '#FF3D57' : 'rgba(255,255,255,0.3)' }}>{aiPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${aiPct}%`, background: '#FF3D57', borderRadius: '4px', transition: 'width 1s ease' }} />
                  </div>
                </div>

                {/* Human bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>HUMAN / AUTHENTIC</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 700, color: !isAI ? '#00FF87' : 'rgba(255,255,255,0.3)' }}>{humanPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${humanPct}%`, background: '#00FF87', borderRadius: '4px', transition: 'width 1s ease' }} />
                  </div>
                </div>

                {/* Meta chips */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'rgba(10,21,32,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Confidence</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#00E5FF', textTransform: 'capitalize' }}>{result.confidence}</p>
                  </div>
                  <div style={{ background: 'rgba(10,21,32,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Model</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.6)', wordBreak: 'break-all' }}>{result.model_used}</p>
                  </div>
                  {result.frames_analyzed && (
                    <div style={{ background: 'rgba(10,21,32,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Frames</p>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{result.frames_analyzed}</p>
                    </div>
                  )}
                  {result.duration_seconds && (
                    <div style={{ background: 'rgba(10,21,32,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Duration</p>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{result.duration_seconds}s</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{
                gridColumn: '1 / -1',
                background: 'rgba(255,184,0,0.04)',
                border: '1px solid rgba(255,184,0,0.15)',
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', gap: '8px', alignItems: 'flex-start'
              }}>
                <span style={{ color: 'rgba(255,184,0,0.6)', fontSize: '12px', flexShrink: 0 }}>⚠</span>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', lineHeight: '1.6' }}>
                  Results are probabilistic estimates, not definitive judgments. Use alongside other verification methods.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
