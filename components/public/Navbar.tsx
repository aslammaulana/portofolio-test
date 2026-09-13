'use client'

import { useState } from 'react'

export default function Navbar({ brandName }: { brandName?: string }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const navLinks = [
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#courses', label: 'Pelatihan' },
    { href: '#languages', label: 'Bahasa' },
    { href: '#contact', label: 'Kontak' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 1.5rem',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <a href="#hero" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#2563eb' }}>
            {brandName || 'Portfolio'}
          </span>
        </a>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {navLinks.map(({ href, label }) => {
            const isHover = hovered === href
            return (
              <a
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '0.4rem 0.875rem', borderRadius: '0.5rem',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: isHover ? '#2563eb' : '#475569',
                  background: isHover ? '#eff6ff' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.15s ease',
                }}
              >
                {label}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
