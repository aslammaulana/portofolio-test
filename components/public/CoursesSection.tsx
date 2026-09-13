import { GraduationCap, MapPin, Calendar } from 'lucide-react'

interface Course {
  id: string
  course_name: string
  organizer: string
  year: string
  location: string
  description: string
  sort_order: number
}

export default function CoursesSection({ courses }: { courses: Course[] }) {
  return (
    <section id="courses" className="section">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Kursus & Pelatihan</h2>
          <p className="section-subtitle">Sertifikasi dan pelatihan yang telah saya ikuti</p>
        </div>

        {courses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Belum ada kursus yang ditambahkan.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  animation: `fadeInUp 0.5s ease ${i * 0.07}s both`,
                }}
              >
                <div style={{
                  width: '40px', height: '40px',
                  background: '#dbeafe',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.875rem',
                }}>
                  <GraduationCap size={20} color="#2563eb" />
                </div>

                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                  {course.course_name}
                </h3>
                <p style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.625rem' }}>
                  {course.organizer}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.8125rem' }}>
                    <Calendar size={12} /> {course.year}
                  </span>
                  {course.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.8125rem' }}>
                      <MapPin size={12} /> {course.location}
                    </span>
                  )}
                </div>

                {course.description && (
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
