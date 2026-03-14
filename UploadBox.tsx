'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Type, Mic, Video, X, AlertCircle, Loader2 } from 'lucide-react'
import axios from 'axios'
import ResultCard from './ResultCard'

type DetectionType = 'text' | 'audio' | 'video'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const tabs: { id: DetectionType; label: string; icon: React.ReactNode; accept: string; hint: string }[] = [
  {
    id: 'text',
    label: 'Text',
    icon: <Type className="w-4 h-4" />,
    accept: '',
    hint: 'Paste text from emails, essays, articles, or any content you want to verify.'
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: <Mic className="w-4 h-4" />,
    accept: '.mp3,.wav,.ogg,.flac,.m4a',
    hint: 'Upload audio files (MP3, WAV, OGG, FLAC, M4A). Max 50MB.'
  },
  {
    id: 'video',
    label: 'Video',
    icon: <Video className="w-4 h-4" />,
    accept: '.mp4,.mov,.avi,.mkv,.webm',
    hint: 'Upload video files (MP4, MOV, AVI, MKV, WEBM). Max 50MB.'
  },
]

export default function UploadBox() {
  const [activeTab, setActiveTab] = useState<DetectionType>('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const currentTab = tabs.find(t => t.id === activeTab)!

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: activeTab !== 'text' ? { 'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.m4a'], 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] } : {},
    maxFiles: 1,
    disabled: activeTab === 'text',
  })

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
        response = await axios.post(`${API_BASE}/detect/text`, form)

      } else if (activeTab === 'audio') {
        if (!file) { setError('Please select an audio file.'); setLoading(false); return }
        const form = new FormData()
        form.append('file', file)
        response = await axios.post(`${API_BASE}/detect/audio`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

      } else {
        if (!file) { setError('Please select a video file.'); setLoading(false); return }
        const form = new FormData()
        form.append('file', file)
        response = await axios.post(`${API_BASE}/detect/video`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      setResult({ ...response.data, type: activeTab })

    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Detection failed. Please try again.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  const resetAll = () => {
    setText('')
    setFile(null)
    setResult(null)
    setError(null)
  }

  const isReady = activeTab === 'text' ? text.trim().length >= 50 : !!file

  return (
    <section id="detect" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="font-mono text-xs tracking-widest text-neon-green/60 uppercase mb-3">
            // DETECTION ENGINE
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Analyze Content
          </h2>
          <p className="text-white/40 font-body">
            Select the content type, upload or paste, and get your result in seconds.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border-glow rounded-2xl overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex border-b border-neon-green/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); resetAll() }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-mono text-xs tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'text-neon-green border-b-2 border-neon-green bg-neon-green/5'
                    : 'text-white/30 hover:text-white/60 border-b-2 border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">

            {/* Hint */}
            <p className="font-mono text-xs text-white/30 mb-5">{currentTab.hint}</p>

            {/* Text input */}
            {activeTab === 'text' && (
              <div className="relative">
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setResult(null); setError(null) }}
                  placeholder="Paste text here to analyze..."
                  className="w-full h-48 bg-void-800/50 border border-neon-green/10 rounded-xl px-4 py-3 text-white/80 font-body text-sm resize-none focus:outline-none focus:border-neon-green/30 focus:ring-1 focus:ring-neon-green/20 placeholder-white/20 transition-all"
                />
                <div className="absolute bottom-3 right-3 font-mono text-xs text-white/20">
                  {text.length} / 50000
                </div>
              </div>
            )}

            {/* File drop zone */}
            {activeTab !== 'text' && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-neon-green/60 bg-neon-green/5'
                    : file
                    ? 'border-neon-cyan/40 bg-neon-cyan/5'
                    : 'border-white/10 hover:border-neon-green/30 hover:bg-neon-green/3'
                }`}
              >
                <input {...getInputProps()} />

                {file ? (
                  <div>
                    <div className="text-3xl mb-3">{activeTab === 'audio' ? '🎵' : '🎬'}</div>
                    <p className="font-mono text-sm text-neon-cyan font-medium">{file.name}</p>
                    <p className="font-mono text-xs text-white/30 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null) }}
                      className="mt-3 text-white/30 hover:text-neon-red/70 transition-colors"
                    >
                      <X className="w-4 h-4 inline" /> Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50 font-body mb-1">
                      {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="font-mono text-xs text-white/20">
                      {activeTab === 'audio' ? 'MP3, WAV, OGG, FLAC, M4A' : 'MP4, MOV, AVI, MKV, WEBM'} • Max 50MB
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-start gap-2 text-neon-red/80 bg-neon-red/5 border border-neon-red/20 rounded-lg px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="font-mono text-xs">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!isReady || loading}
              className={`mt-6 w-full flex items-center justify-center gap-3 font-mono font-bold text-sm tracking-wider py-4 rounded-xl transition-all ${
                isReady && !loading
                  ? 'bg-neon-green text-void-900 glow-green hover:bg-neon-cyan hover:scale-[1.02]'
                  : 'bg-void-700 text-white/20 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                `DETECT ${currentTab.label.toUpperCase()} →`
              )}
            </button>

            {/* Loading indicator */}
            {loading && (
              <div className="mt-4">
                <div className="h-0.5 bg-void-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neon-green"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  />
                </div>
                <p className="font-mono text-xs text-white/30 text-center mt-2">
                  Running ML inference...
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6"
            >
              <ResultCard result={result} onReset={resetAll} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
