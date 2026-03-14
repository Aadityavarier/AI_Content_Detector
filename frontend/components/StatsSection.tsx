'use client'

export default function StatsSection() {
  const stats = [
    { value: '94%', label: 'Text Detection Accuracy', sub: 'FakeTextCorpus benchmark' },
    { value: '88%', label: 'Audio Detection Accuracy', sub: 'ASVspoof 2019 dataset' },
    { value: '91%', label: 'Video Detection Accuracy', sub: 'FaceForensics++ dataset' },
    { value: '<3s', label: 'Avg Text Analysis Time', sub: 'Short to medium text' },
    { value: '50MB', label: 'Max File Size', sub: 'Audio and video uploads' },
    { value: '100%', label: 'Free & Open Source', sub: 'MIT license, no signup' },
  ]

  return (
    <section id="accuracy" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
          letterSpacing: '3px', color: 'rgba(0,229,255,0.5)',
          textTransform: 'uppercase', marginBottom: '12px'
        }}>// BENCHMARKS</p>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(28px,4vw,46px)', color: '#fff', marginBottom: '12px'
        }}>Model Performance</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', maxWidth: '480px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
          Tested on industry-standard datasets. Numbers reflect F1 scores on held-out test sets.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'rgba(6,13,20,0.7)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '28px', textAlign: 'center'
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 900,
              fontSize: '42px', color: '#00E5FF',
              textShadow: '0 0 20px rgba(0,229,255,0.2)', marginBottom: '8px'
            }}>{s.value}</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
