import { MapPin, Calendar } from 'lucide-react'

interface Experience {
  id: string
  company_name: string
  location: string
  year_start: string
  year_end: string | null
  description: string
  sort_order: number
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-alt">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Pengalaman Kerja</h2>
          <p className="section-subtitle">Perjalanan karir dan pengalaman profesional saya</p>
        </div>

        {experiences.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Belum ada pengalaman yang ditambahkan.</p>
        ) : (
          <div className="timeline" style={{ maxWidth: '700px', margin: '0 auto' }}>
            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className="timeline-item"
                style={{ animation: `slideInLeft 0.5s ease ${i * 0.1}s both` }}
              >
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.625rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#0f172a' }}>
                      {exp.company_name}
                    </h3>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      background: '#dbeafe', color: '#2563eb',
                      padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500,
                    }}>
                      <Calendar size={12} />
                      {exp.year_start} — {exp.year_end || 'Sekarang'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    <MapPin size={13} />
                    {exp.location}
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
