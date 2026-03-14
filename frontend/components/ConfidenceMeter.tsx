'use client'

interface ConfidenceMeterProps {
  probability: number  // 0 to 1
  label?: string
}

export default function ConfidenceMeter({ probability, label }: ConfidenceMeterProps) {
  const percent = Math.round(probability * 100)

  const getColor = () => {
    if (probability >= 0.75) return '#FF3D57'
    if (probability >= 0.5)  return '#FFB800'
    if (probability >= 0.25) return '#00E5FF'
    return '#00FF87'
  }

  const getLabel = () => {
    if (probability >= 0.85) return 'Very High'
    if (probability >= 0.70) return 'High'
    if (probability >= 0.55) return 'Moderate'
    if (probability >= 0.45) return 'Uncertain'
    return 'Low'
  }

  const color = getColor()
  const circumference = 2 * Math.PI * 54
  const strokeDash = (percent / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* Circular gauge */}
      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background ring */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            style={{
              filter: `drop-shadow(0 0 8px ${color}80)`,
              transition: 'stroke-dasharray 1s ease'
            }}
            transform="rotate(-90 70 70)"
          />
        </svg>

        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: '28px', color,
            textShadow: `0 0 20px ${color}80`
          }}>
            {percent}%
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '8px', color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px'
          }}>
            AI PROB
          </span>
        </div>
      </div>

      {/* Confidence label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '2px',
          textTransform: 'uppercase', marginBottom: '4px'
        }}>
          CONFIDENCE
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: '13px', color,
          textShadow: `0 0 10px ${color}60`
        }}>
          {getLabel()}
        </div>
      </div>

      {/* Horizontal bar */}
      <div style={{ width: '140px' }}>
        <div style={{
          height: '4px', background: 'rgba(255,255,255,0.06)',
          borderRadius: '2px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${percent}%`,
            background: color, borderRadius: '2px',
            boxShadow: `0 0 8px ${color}60`,
            transition: 'width 1s ease'
          }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '4px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '8px', color: 'rgba(255,255,255,0.2)'
        }}>
          <span>HUMAN</span>
          <span>AI</span>
        </div>
      </div>
    </div>
  )
}
