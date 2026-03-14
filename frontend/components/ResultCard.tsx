'use client'

import { motion } from 'framer-motion'
import { RotateCcw, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'

interface ResultCardProps {
  result: {
    type: 'text' | 'audio' | 'video'
    ai_probability?: number
    ai_generated_probability?: number
    deepfake_probability?: number
    human_probability: number
    confidence: string
    model_used: string
    label: string
    analyzed_at: string
    frames_analyzed?: number
    duration_seconds?: number
    chunks_analyzed?: number
  }
  onReset: () => void
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const rawProb =
    result.ai_probability ??
    result.ai_generated_probability ??
    result.deepfake_probability ??
    0

  const aiPercent = Math.round(rawProb * 100)
  const isAI = rawProb >= 0.5

  const confidenceColors: Record<string, string> = {
    'very high': '#00FF87',
    'high': '#00E5FF',
    'moderate': '#FFB800',
    'uncertain': '#FF3D57',
    'low': '#FF3D57',
  }

  const gaugeColor = isAI
    ? rawProb > 0.8 ? '#FF3D57' : '#FFB800'
    : '#00FF87'

  const chartData = [
    { name: 'AI', value: aiPercent, fill: gaugeColor }
  ]

  const typeLabels: Record<string, string> = {
    text: 'TEXT ANALYSIS',
    audio: 'AUDIO ANALYSIS',
    video: 'VIDEO DEEPFAKE ANALYSIS',
  }

  return (
    <div className={`glass rounded-2xl overflow-hidden ${
      isAI ? 'border border-neon-red/30 glow-red' : 'border border-neon-green/30 glow-green'
    }`}>

      {/* Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between ${
        isAI ? 'border-neon-red/20 bg-neon-red/5' : 'border-neon-green/20 bg-neon-green/5'
      }`}>
        <div className="flex items-center gap-3">
          {isAI
            ? <ShieldAlert className="w-5 h-5 text-neon-red" />
            : <ShieldCheck className="w-5 h-5 text-neon-green" />
          }
          <div>
            <p className="font-mono text-xs text-white/40 tracking-widest">{typeLabels[result.type]}</p>
            <p className={`font-display font-black text-xl ${isAI ? 'text-neon-red' : 'text-neon-green'}`}>
              {result.label}
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-white/30 hover:text-white/70 transition-colors p-2 hover:bg-white/5 rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Gauge chart */}
          <div className="relative h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="60%"
                innerRadius="70%"
                outerRadius="90%"
                startAngle={180}
                endAngle={0}
                data={chartData}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={8}
                  background={{ fill: 'rgba(255,255,255,0.05)' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>

            {/* Center overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '10%' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                className={`font-display font-black text-5xl ${
                  isAI ? 'text-neon-red' : 'text-neon-green'
                }`}
                style={{
                  textShadow: isAI
                    ? '0 0 20px rgba(255,61,87,0.5)'
                    : '0 0 20px rgba(0,255,135,0.5)'
                }}
              >
                {aiPercent}%
              </motion.div>
              <p className="font-mono text-xs text-white/40 tracking-widest mt-1">AI PROBABILITY</p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">

            {/* Probability bars */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-xs text-white/50">AI GENERATED</span>
                <span className={`font-mono text-xs font-bold ${isAI ? 'text-neon-red' : 'text-white/40'}`}>
                  {aiPercent}%
                </span>
              </div>
              <div className="h-2 bg-void-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aiPercent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: gaugeColor, boxShadow: `0 0 10px ${gaugeColor}50` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-xs text-white/50">HUMAN / AUTHENTIC</span>
                <span className={`font-mono text-xs font-bold ${!isAI ? 'text-neon-green' : 'text-white/40'}`}>
                  {Math.round(result.human_probability * 100)}%
                </span>
              </div>
              <div className="h-2 bg-void-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(result.human_probability * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-neon-green/70"
                />
              </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-void-800/60 rounded-xl p-3 border border-white/5">
                <p className="font-mono text-xs text-white/30 mb-1">CONFIDENCE</p>
                <p
                  className="font-mono text-sm font-bold capitalize"
                  style={{ color: confidenceColors[result.confidence] || '#00FF87' }}
                >
                  {result.confidence}
                </p>
              </div>

              <div className="bg-void-800/60 rounded-xl p-3 border border-white/5">
                <p className="font-mono text-xs text-white/30 mb-1">MODEL</p>
                <p className="font-mono text-xs text-white/70 truncate" title={result.model_used}>
                  {result.model_used}
                </p>
              </div>

              {result.frames_analyzed && (
                <div className="bg-void-800/60 rounded-xl p-3 border border-white/5">
                  <p className="font-mono text-xs text-white/30 mb-1">FRAMES</p>
                  <p className="font-mono text-sm text-white/70">{result.frames_analyzed}</p>
                </div>
              )}

              {result.duration_seconds && (
                <div className="bg-void-800/60 rounded-xl p-3 border border-white/5">
                  <p className="font-mono text-xs text-white/30 mb-1">DURATION</p>
                  <p className="font-mono text-sm text-white/70">{result.duration_seconds}s</p>
                </div>
              )}

              {result.chunks_analyzed && (
                <div className="bg-void-800/60 rounded-xl p-3 border border-white/5">
                  <p className="font-mono text-xs text-white/30 mb-1">TEXT CHUNKS</p>
                  <p className="font-mono text-sm text-white/70">{result.chunks_analyzed}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-2 bg-void-800/40 border border-white/5 rounded-xl px-4 py-3">
          <AlertTriangle className="w-3.5 h-3.5 text-neon-amber/60 mt-0.5 flex-shrink-0" />
          <p className="font-mono text-xs text-white/25 leading-relaxed">
            Results are probabilistic estimates, not definitive judgments. Use alongside other verification methods.
            Accuracy varies with content quality and model limitations.
          </p>
        </div>
      </div>
    </div>
  )
}
