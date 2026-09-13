'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, User, FolderOpen, Wrench,
  Briefcase, GraduationCap, Languages, Phone, LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard',             label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/admin/dashboard/profile',     label: 'Profil',           icon: User },
  { href: '/admin/dashboard/projects',    label: 'Projects',         icon: FolderOpen },
  { href: '/admin/dashboard/skills',      label: 'Skills',           icon: Wrench },
  { href: '/admin/dashboard/experiences', label: 'Experience',       icon: Briefcase },
  { href: '/admin/dashboard/courses',     label: 'Course & Training',icon: GraduationCap },
  { href: '/admin/dashboard/languages',   label: 'Languages',        icon: Languages },
  { href: '/admin/dashboard/contacts',    label: 'Kontak',           icon: Phone },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.5rem 0.875rem',
          }}>
            <div style={{
              width: '32px', height: '32px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LayoutDashboard size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-link ${isActive ? 'active' : ''}`}
                style={{ marginBottom: '0.25rem' }}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            width: '100%', padding: '0.625rem 0.875rem',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500,
            color: '#ef4444', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget).style.background = '#fee2e2' }}
          onMouseLeave={e => { (e.currentTarget).style.background = 'none' }}
        >
          <LogOut size={17} />
          Keluar
        </button>
      </aside>

      {/* Main content */}
      <main className="admin-main">{children}</main>
    </div>
  )
}
