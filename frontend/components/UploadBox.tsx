'use client'

import { useState, useRef } from 'react'
import axios from 'axios'

type DetectionType = 'text' | 'audio' | 'video'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a']
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv', '.webm']

export default function UploadBox() {
  const [activeTab, setActiveTab] = useState<DetectionType>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hints: Record<DetectionType, string> = {
    text: 'Paste text from emails, essays, articles, or any content. Minimum 50 characters required.',
    audio: 'Upload audio files only — MP3, WAV, OGG, FLAC, M4A. Max 50MB.',
    video: 'Upload video files only — MP4, MOV, AVI, MKV, WEBM. Max 50MB.',
  }

  const resetAll = () => {
    setText('')
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const switchTab = (tab: DetectionType) => {
    setActiveTab(tab)
    resetAll()
  }

  const validateFile = (f: File): string | null => {
    const ext = ('.' + f.name.split('.').pop()?.toLowerCase()) as string
    if (activeTab === 'audio' && !AUDIO_EXTS.includes(ext)) {
      return `Wrong file type "${ext}". Please upload an audio file: ${AUDIO_EXTS.join(', ')}`
    }
    if (activeTab === 'video' && !VIDEO_EXTS.includes(ext)) {
      return `Wrong file type "${ext}". Please upload a video file: ${VIDEO_EXTS.join(', ')}`
    }
    if (f.size > 50 * 1024 * 1024) {
      return 'File size exceeds 50MB limit.'
    }
    return null
  }

  const handleFileSelect = (f: File) => {
    const validationError = validateFile(f)
    if (validationError) {
      setError(validationError)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setFile(f)
    setError(null)
    setResult(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFileSelect(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFileSelect(f)
  }

  const handleSubmit = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      let response
      if (activeTab === 'text') {
        if (text.trim().length < 50) {
          setError('Please enter at least 50 characters for accurate detection.')
          setLoading(false)
          return
        }
        const form = new FormData()
        form.append('text', text)
        response = await axios.post(`${API_BASE}/detect/text`, form, { timeout: 300000 })
      } else if (activeTab === 'audio') {
        if (!file) { setError('Please select an audio file.'); setLoading(false); return }
        const form = new FormData()
        form.append('file', file)
        response = await axios.post(`${API_BASE}/detect/audio`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 300000,
        })
      } else {
        if (!file) { setError('Please select a video file.'); setLoading(false); return }
        const form = new FormData()
        form.append('file', file)
        response = await axios.post(`${API_BASE}/detect/video`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 300000,
        })
      }
      setResult({ ...response.data, type: activeTab })
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Cannot connect to backend server. Make sure uvicorn is running on port 8000.')
      } else {
        const msg = err?.response?.data?.detail || err?.message || 'Detection failed. Please try again.'
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
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

  const acceptStr = activeTab === 'audio' ? AUDIO_EXTS.join(',') : VIDEO_EXTS.join(',')

  // ─── Shared style objects ───────────────────────────────────────────
  const monoSm: React.CSSProperties = { fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '1px' }
  const chip: React.CSSProperties = { background: 'rgba(10,21,32,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px' }

  return (
    <section id="detect" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ ...monoSm, color: 'rgba(0,255,135,0.5)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
            // DETECTION ENGINE
          </p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', color: '#fff', marginBottom: '12px' }}>
            Analyze Content
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            Select the content type, upload or paste, and get your result in seconds.
          </p>
        </div>

        {/* ── Main card ── */}
        <div style={{ background: 'rgba(6,13,20,0.9)', border: '1px solid rgba(0,255,135,0.18)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 60px rgba(0,255,135,0.04)' }}>

          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,255,135,0.1)' }}>
            {(['text', 'audio', 'video'] as DetectionType[]).map(tab => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                style={{
                  flex: 1, padding: '18px 12px', border: 'none', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '2px', textTransform: 'uppercase',
                  background: activeTab === tab ? 'rgba(0,255,135,0.07)' : 'transparent',
                  color: activeTab === tab ? '#00FF87' : 'rgba(255,255,255,0.3)',
                  borderBottom: activeTab === tab ? '2px solid #00FF87' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'text' ? '📝' : tab === 'audio' ? '🎵' : '🎬'} {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px 32px' }}>

            {/* Hint text */}
            <p style={{ ...monoSm, color: 'rgba(255,255,255,0.28)', marginBottom: '18px', lineHeight: '1.6' }}>
              {hints[activeTab]}
            </p>

            {/* ── TEXT INPUT ── */}
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setResult(null); setError(null) }}
                  placeholder="Paste your text here to analyze..."
                  style={{
                    width: '100%', height: '200px',
                    background: 'rgba(2,4,8,0.8)',
                    border: `1px solid ${text.length >= 50 ? 'rgba(0,255,135,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', padding: '16px',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                    resize: 'none', outline: 'none', lineHeight: '1.7',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ ...monoSm, color: text.length >= 50 ? 'rgba(0,255,135,0.6)' : 'rgba(255,100,100,0.5)' }}>
                    {text.length < 50 ? `${50 - text.length} more chars needed` : '✓ Ready to detect'}
                  </span>
                  <span style={{ ...monoSm, color: 'rgba(255,255,255,0.2)' }}>
                    {text.length} / 50,000
                  </span>
                </div>
              </div>
            )}

            {/* ── FILE UPLOAD ── */}
            {activeTab !== 'text' && (
              <div>
                {/* Hidden native input — strictly typed */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptStr}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />

                {/* Drop zone */}
                <div
                  onClick={() => !file && fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${dragOver ? 'rgba(0,255,135,0.6)' : file ? 'rgba(0,229,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '14px', padding: '52px 24px', textAlign: 'center',
                    cursor: file ? 'default' : 'pointer',
                    background: dragOver ? 'rgba(0,255,135,0.03)' : file ? 'rgba(0,229,255,0.03)' : 'rgba(2,4,8,0.5)',
                    transition: 'all 0.2s',
                  }}
                >
                  {file ? (
                    <div>
                      <div style={{ fontSize: '40px', marginBottom: '14px' }}>
                        {activeTab === 'audio' ? '🎵' : '🎬'}
                      </div>
                      <p style={{ ...monoSm, fontSize: '13px', color: '#00E5FF', fontWeight: 700, marginBottom: '6px', wordBreak: 'break-all' }}>
                        {file.name}
                      </p>
                      <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); resetAll() }}
                        style={{
                          background: 'rgba(255,61,87,0.08)', border: '1px solid rgba(255,61,87,0.3)',
                          color: '#FF3D57', cursor: 'pointer', padding: '7px 18px',
                          borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '10px', letterSpacing: '1px',
                        }}
                      >
                        ✕ REMOVE
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '40px', marginBottom: '14px', opacity: 0.25 }}>
                        {activeTab === 'audio' ? '🎵' : '🎬'}
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', marginBottom: '8px' }}>
                        {dragOver ? 'Drop your file here' : 'Drag & drop or click to browse'}
                      </p>
                      <p style={{ ...monoSm, color: 'rgba(255,255,255,0.2)' }}>
                        {activeTab === 'audio'
                          ? 'MP3  ·  WAV  ·  OGG  ·  FLAC  ·  M4A  ·  Max 50MB'
                          : 'MP4  ·  MOV  ·  AVI  ·  MKV  ·  WEBM  ·  Max 50MB'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                marginTop: '16px', padding: '13px 16px',
                background: 'rgba(255,61,87,0.06)', border: '1px solid rgba(255,61,87,0.25)',
                borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <span style={{ color: '#FF3D57', fontSize: '14px', flexShrink: 0 }}>⚠</span>
                <p style={{ ...monoSm, color: 'rgba(255,120,130,0.9)', lineHeight: '1.6' }}>{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!isReady || loading}
              style={{
                marginTop: '20px', width: '100%', padding: '18px',
                border: 'none', borderRadius: '12px',
                cursor: isReady && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                background: isReady && !loading ? '#00FF87' : 'rgba(255,255,255,0.05)',
                color: isReady && !loading ? '#020408' : 'rgba(255,255,255,0.15)',
                boxShadow: isReady && !loading ? '0 0 30px rgba(0,255,135,0.2)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? '⏳ ANALYZING...'
                : !isReady
                ? activeTab === 'text' ? 'ENTER AT LEAST 50 CHARACTERS' : 'SELECT A FILE TO CONTINUE'
                : `DETECT ${activeTab.toUpperCase()} →`
              }
            </button>

            {/* Loading bar */}
            {loading && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg,#00FF87,#00E5FF)', borderRadius: '2px', animation: 'ldbar 1.4s ease-in-out infinite' }} />
                </div>
                <style>{`@keyframes ldbar{0%{width:0%;margin-left:0%}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}`}</style>
                <p style={{ ...monoSm, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '10px', letterSpacing: '2px' }}>
                  {activeTab === 'video' ? 'EXTRACTING FRAMES & RUNNING INFERENCE...' : 'RUNNING ML INFERENCE...'}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ── RESULT CARD ── */}
        {result && (
          <div style={{
            marginTop: '24px', borderRadius: '20px', overflow: 'hidden',
            border: `1px solid ${isAI ? 'rgba(255,61,87,0.35)' : 'rgba(0,255,135,0.3)'}`,
            background: isAI ? 'rgba(18,4,7,0.95)' : 'rgba(2,10,5,0.95)',
          }}>

            {/* Header */}
            <div style={{
              padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: `1px solid ${isAI ? 'rgba(255,61,87,0.15)' : 'rgba(0,255,135,0.12)'}`,
              background: isAI ? 'rgba(255,61,87,0.07)' : 'rgba(0,255,135,0.05)',
            }}>
              <div>
                <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {result.type?.toUpperCase()} ANALYSIS
                </p>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '26px', color: isAI ? '#FF3D57' : '#00FF87' }}>
                  {result.label}
                </p>
              </div>
              <button
                onClick={resetAll}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px', padding: '10px 16px', borderRadius: '8px',
                  cursor: 'pointer', letterSpacing: '1px',
                }}
              >
                ↺ NEW ANALYSIS
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '170px 1fr', gap: '28px', alignItems: 'start' }}>

              {/* Big % */}
              <div style={{
                textAlign: 'center', padding: '24px 12px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${isAI ? 'rgba(255,61,87,0.15)' : 'rgba(0,255,135,0.12)'}`,
                borderRadius: '16px',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '62px', lineHeight: 1,
                  color: isAI ? '#FF3D57' : '#00FF87',
                  textShadow: `0 0 40px ${isAI ? 'rgba(255,61,87,0.4)' : 'rgba(0,255,135,0.4)'}`,
                  marginBottom: '8px',
                }}>
                  {aiPct}%
                </div>
                <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '8px' }}>
                  AI PROBABILITY
                </p>
              </div>

              {/* Bars + chips */}
              <div>
                {/* AI bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <span style={{ ...monoSm, color: 'rgba(255,255,255,0.4)' }}>AI GENERATED</span>
                    <span style={{ ...monoSm, fontWeight: 700, color: '#FF3D57' }}>{aiPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${aiPct}%`, background: 'linear-gradient(90deg,#FF3D57,#FF6B7A)', borderRadius: '4px', transition: 'width 1s ease' }} />
                  </div>
                </div>

                {/* Human bar */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <span style={{ ...monoSm, color: 'rgba(255,255,255,0.4)' }}>HUMAN / AUTHENTIC</span>
                    <span style={{ ...monoSm, fontWeight: 700, color: '#00FF87' }}>{humanPct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${humanPct}%`, background: 'linear-gradient(90deg,#00FF87,#00E5FF)', borderRadius: '4px', transition: 'width 1s ease' }} />
                  </div>
                </div>

                {/* Meta chips */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={chip}>
                    <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', fontSize: '8px', textTransform: 'uppercase', marginBottom: '6px' }}>Confidence</p>
                    <p style={{ ...monoSm, fontWeight: 700, color: '#00E5FF', textTransform: 'capitalize' }}>{result.confidence}</p>
                  </div>
                  <div style={chip}>
                    <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', fontSize: '8px', textTransform: 'uppercase', marginBottom: '6px' }}>Model</p>
                    <p style={{ ...monoSm, fontSize: '9px', color: 'rgba(255,255,255,0.55)', wordBreak: 'break-word' }}>{result.model_used}</p>
                  </div>
                  {result.frames_analyzed && (
                    <div style={chip}>
                      <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', fontSize: '8px', textTransform: 'uppercase', marginBottom: '6px' }}>Frames</p>
                      <p style={{ ...monoSm, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{result.frames_analyzed}</p>
                    </div>
                  )}
                  {result.duration_seconds && (
                    <div style={chip}>
                      <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', fontSize: '8px', textTransform: 'uppercase', marginBottom: '6px' }}>Duration</p>
                      <p style={{ ...monoSm, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{result.duration_seconds}s</p>
                    </div>
                  )}
                  {result.chunks_analyzed && (
                    <div style={chip}>
                      <p style={{ ...monoSm, color: 'rgba(255,255,255,0.3)', fontSize: '8px', textTransform: 'uppercase', marginBottom: '6px' }}>Text Chunks</p>
                      <p style={{ ...monoSm, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{result.chunks_analyzed}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{
                gridColumn: '1 / -1',
                background: 'rgba(255,184,0,0.04)', border: '1px solid rgba(255,184,0,0.12)',
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <span style={{ color: 'rgba(255,184,0,0.5)', fontSize: '12px', flexShrink: 0 }}>⚠</span>
                <p style={{ ...monoSm, color: 'rgba(255,255,255,0.2)', lineHeight: '1.7' }}>
                  Results are probabilistic estimates, not definitive proof. Always combine with human judgment and other verification methods.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}