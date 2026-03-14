'use client'

export default function HowItWorks() {
  const steps = [
    { num: '01', icon: '📂', title: 'Upload Content', color: '#00FF87',
      desc: 'Paste text or drag-and-drop audio/video. All common formats up to 50MB.' },
    { num: '02', icon: '⚡', title: 'ML Processing', color: '#00E5FF',
      desc: 'FastAPI routes your content to the right model — RoBERTa, wav2vec2, or EfficientNet.' },
    { num: '03', icon: '🔬', title: 'Feature Extraction', color: '#FFB800',
      desc: 'Token patterns for text, MFCC waveforms for audio, frame embeddings for video.' },
    { num: '04', icon: '📊', title: 'Probability Score', color: '#00FF87',
      desc: 'AI probability (0–100%) returned with confidence rating and model metadata.' },
  ]

  return (
    <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
          letterSpacing: '3px', color: 'rgba(0,255,135,0.5)',
          textTransform: 'uppercase', marginBottom: '12px'
        }}>// HOW IT WORKS</p>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(28px,4vw,46px)', color: '#fff'
        }}>The Detection Pipeline</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {steps.map(s => (
          <div key={s.num} style={{
            background: 'rgba(6,13,20,0.7)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '18px', padding: '24px', position: 'relative'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '14px' }}>{s.icon}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
              fontWeight: 700, letterSpacing: '2px', color: s.color,
              textTransform: 'uppercase', marginBottom: '8px'
            }}>{s.num}</div>
            <h3 style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
              fontSize: '15px', color: '#fff', marginBottom: '10px'
            }}>{s.title}</h3>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
              color: 'rgba(255,255,255,0.4)', lineHeight: '1.7'
            }}>{s.desc}</p>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '2px', borderRadius: '0 0 18px 18px',
              background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
              opacity: 0.4
            }} />
          </div>
        ))}
      </div>

      {/* Models table */}
      <div style={{
        marginTop: '48px', background: 'rgba(6,13,20,0.8)',
        border: '1px solid rgba(0,255,135,0.12)', borderRadius: '16px', overflow: 'hidden'
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0,255,135,0.08)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#00FF87' }}>
            Models Used
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
            All open-source, free to use
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Type', 'Model', 'Source', 'Accuracy'].map(h => (
                <th key={h} style={{
                  padding: '12px 24px', textAlign: 'left',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { type: 'Text', color: '#00FF87', model: 'roberta-base-openai-detector', source: 'HuggingFace', acc: '94.2%' },
              { type: 'Audio', color: '#00E5FF', model: 'wav2vec2 + MFCC Classifier', source: 'Facebook / Custom', acc: '87.6%' },
              { type: 'Video', color: '#FFB800', model: 'EfficientNet-B0 Deepfake', source: 'PyTorch / Custom', acc: '91.3%' },
            ].map(r => (
              <tr key={r.type} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: r.color }}>{r.type}</td>
                <td style={{ padding: '14px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{r.model}</td>
                <td style={{ padding: '14px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{r.source}</td>
                <td style={{ padding: '14px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: r.color }}>{r.acc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
