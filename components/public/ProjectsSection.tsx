import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  external_url: string | null
  sort_order: number
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Portfolio & Proyek</h2>
          <p className="section-subtitle">Karya dan proyek yang telah saya kerjakan</p>
        </div>

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Belum ada proyek yang ditambahkan.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="card"
                style={{
                  overflow: 'hidden',
                  animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
                }}
              >
                {/* Project image */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '3rem', color: '#93c5fd',
                    }}>
                      📁
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                    {project.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {project.description}
                  </p>

                  {project.external_url && (
                    <a
                      href={project.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}
                    >
                      <ExternalLink size={15} />
                      Lihat Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
