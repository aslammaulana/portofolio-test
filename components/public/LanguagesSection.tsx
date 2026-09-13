import { Languages } from 'lucide-react'

interface Language {
  id: string
  language_name: string
  level: string
  sort_order: number
}

const levelConfig: Record<string, { color: string; bg: string; percent: number }> = {
  Native:       { color: '#059669', bg: '#d1fae5', percent: 100 },
  Fluent:       { color: '#2563eb', bg: '#dbeafe', percent: 85 },
  Intermediate: { color: '#d97706', bg: '#fef3c7', percent: 60 },
  Basic:        { color: '#dc2626', bg: '#fee2e2', percent: 35 },
}

export default function LanguagesSection({ languages }: { languages: Language[] }) {
  return (
    <section id="languages" className="section-alt">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Bahasa</h2>
          <p className="section-subtitle">Kemampuan berbahasa yang saya miliki</p>
        </div>

        {languages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Belum ada bahasa yang ditambahkan.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            {languages.map((lang, i) => {
              const config = levelConfig[lang.level] || { color: '#2563eb', bg: '#dbeafe', percent: 50 }
              return (
                <div
                  key={lang.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: '36px', height: '36px', background: config.bg,
                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Languages size={18} color={config.color} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{lang.language_name}</span>
                    </div>
                    <span style={{
                      background: config.bg, color: config.color,
                      padding: '0.2rem 0.625rem', borderRadius: '9999px',
                      fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {lang.level}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${config.percent}%`,
                      background: config.color,
                      borderRadius: '3px',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
