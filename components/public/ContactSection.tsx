'use client'

import { MessageCircle, Mail } from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '@/components/icons'

interface Contact {
  whatsapp_url: string
  email: string
  instagram_url: string
  linkedin_url: string
}

const links = [
  {
    key: 'whatsapp_url' as const,
    label: 'WhatsApp',
    icon: MessageCircle,
    color: '#25D366',
    bg: '#dcfce7',
    prefix: '',
  },
  {
    key: 'email' as const,
    label: 'Email',
    icon: Mail,
    color: '#2563eb',
    bg: '#dbeafe',
    prefix: 'mailto:',
  },
  {
    key: 'instagram_url' as const,
    label: 'Instagram',
    icon: InstagramIcon,
    color: '#e1306c',
    bg: '#fce7f3',
    prefix: '',
  },
  {
    key: 'linkedin_url' as const,
    label: 'LinkedIn',
    icon: LinkedinIcon,
    color: '#0a66c2',
    bg: '#dbeafe',
    prefix: '',
  },
]

export default function ContactSection({ contact }: { contact: Contact | null }) {
  return (
    <section id="contact" className="section" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)' }}>
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Hubungi Saya</h2>
          <p className="section-subtitle">Jangan ragu untuk menghubungi saya melalui platform berikut</p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {links.map(({ key, label, icon: Icon, color, bg, prefix }, i) => {
            const value = contact?.[key]
            if (!value) return null
            const href = key === 'email' ? `mailto:${value}` : value
            return (
              <a
                key={key}
                href={href}
                target={key === 'email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  background: '#fff',
                  border: `2px solid ${bg}`,
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s ease',
                  animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  minWidth: '160px',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = bg
                  el.style.borderColor = color
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = `0 8px 20px ${color}30`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = '#fff'
                  el.style.borderColor = bg
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{
                  width: '36px', height: '36px',
                  background: bg, borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={color} />
                </div>
                {label}
              </a>
            )
          })}
        </div>

        {!contact?.whatsapp_url && !contact?.email && !contact?.instagram_url && !contact?.linkedin_url && (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Kontak belum dikonfigurasi.</p>
        )}
      </div>
    </section>
  )
}
