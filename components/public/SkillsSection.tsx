interface Skill {
  id: string
  name: string
  category: string | null
  sort_order: number
}

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  // Group by category
  const grouped: Record<string, Skill[]> = {}
  skills.forEach((s) => {
    const cat = s.category || 'General'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(s)
  })

  const categories = Object.keys(grouped)

  return (
    <section id="skills" className="section-alt">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Skills & Keahlian</h2>
          <p className="section-subtitle">Teknologi dan keahlian yang saya kuasai</p>
        </div>

        {skills.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Belum ada skill yang ditambahkan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {categories.map((cat) => (
              <div key={cat}>
                {categories.length > 1 && (
                  <h3 style={{
                    fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#2563eb', marginBottom: '0.875rem',
                  }}>
                    {cat}
                  </h3>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                  {grouped[cat].map((skill, i) => (
                    <span
                      key={skill.id}
                      className="badge"
                      style={{
                        animation: `fadeInUp 0.4s ease ${i * 0.04}s both`,
                        cursor: 'default',
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
