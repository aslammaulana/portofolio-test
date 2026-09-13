import Image from 'next/image'
import { MapPin, Briefcase, MessageCircle } from 'lucide-react'

interface Profile {
  full_name: string
  tagline: string
  description: string
  avatar_url: string | null
}

interface Contact {
  whatsapp_url: string
  email: string
}

export default function HeroSection({
  profile,
  contact,
}: {
  profile: Profile | null
  contact: Contact | null
}) {
  const name = profile?.full_name || 'Your Name'
  const tagline = profile?.tagline || 'Your Professional Title'
  const description = profile?.description || 'A passionate professional ready to help your next project.'

  return (
    <section
      id="hero"
      style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0f9ff 100%)',
        padding: '6rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0, animation: 'fadeIn 0.7s ease' }}>
          <div style={{
            width: '200px', height: '200px', borderRadius: '50%',
            border: '4px solid #2563eb', padding: '4px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            boxShadow: '0 20px 40px rgba(37,99,235,0.25)',
            animation: 'pulse-ring 3s ease-in-out infinite',
          }}>
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={name}
                width={192}
                height={192}
                style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '4rem', color: '#fff', fontWeight: 700,
              }}>
                {name[0]}
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#dbeafe', color: '#2563eb', padding: '0.25rem 0.875rem',
            borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600,
            marginBottom: '1rem', animation: 'fadeInUp 0.5s ease',
          }}>
            <Briefcase size={13} />
            Available for opportunities
          </div>

          <h1
            className="gradient-text"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.75rem', animation: 'fadeInUp 0.6s ease 0.1s both' }}
          >
            {name}
          </h1>

          <p style={{
            fontSize: '1.25rem', fontWeight: 500, color: '#475569',
            marginBottom: '1rem', animation: 'fadeInUp 0.6s ease 0.2s both',
          }}>
            {tagline}
          </p>

          <p style={{
            color: '#64748b', maxWidth: '520px', lineHeight: 1.75,
            marginBottom: '2rem', animation: 'fadeInUp 0.6s ease 0.3s both',
          }}>
            {description}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animation: 'fadeInUp 0.6s ease 0.4s both' }}>
            {contact?.whatsapp_url ? (
              <a
                href={contact.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                Hubungi Saya
              </a>
            ) : (
              <a href="#contact" className="btn btn-primary">
                <MessageCircle size={18} />
                Hubungi Saya
              </a>
            )}
            <a href="#projects" className="btn btn-outline">
              Lihat Proyek
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        color: '#94a3b8', fontSize: '0.75rem', animation: 'fadeIn 1s ease 1s both',
      }}>
        <span>Scroll</span>
        <div style={{
          width: '22px', height: '36px', border: '2px solid #cbd5e1',
          borderRadius: '11px', display: 'flex', justifyContent: 'center', paddingTop: '6px',
        }}>
          <div style={{
            width: '4px', height: '8px', background: '#2563eb',
            borderRadius: '2px', animation: 'fadeInUp 1.2s ease infinite',
          }} />
        </div>
      </div>
    </section>
  )
}
