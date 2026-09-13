'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  FolderOpen, Wrench, Briefcase, GraduationCap,
  Languages, Phone, ExternalLink, PlusCircle, ArrowUpRight
} from 'lucide-react'

interface Stats {
  projects: number
  skills: number
  experiences: number
  courses: number
  languages: number
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    courses: 0,
    languages: 0,
  })
  const [fullName, setFullName] = useState<string>('')
  const [tagline, setTagline] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const [
          { count: pCount },
          { count: sCount },
          { count: eCount },
          { count: cCount },
          { count: lCount },
          { data: prof },
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
          supabase.from('experiences').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('languages').select('*', { count: 'exact', head: true }),
          supabase.from('profile').select('full_name, tagline').single(),
        ])

        setStats({
          projects: pCount || 0,
          skills: sCount || 0,
          experiences: eCount || 0,
          courses: cCount || 0,
          languages: lCount || 0,
        })

        if (prof) {
          setFullName(prof.full_name || '')
          setTagline(prof.tagline || '')
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Projects',
      count: stats.projects,
      icon: FolderOpen,
      color: '#2563eb',
      bg: '#dbeafe',
      href: '/admin/dashboard/projects',
    },
    {
      title: 'Skills',
      count: stats.skills,
      icon: Wrench,
      color: '#059669',
      bg: '#d1fae5',
      href: '/admin/dashboard/skills',
    },
    {
      title: 'Experiences',
      count: stats.experiences,
      icon: Briefcase,
      color: '#7c3aed',
      bg: '#ede9fe',
      href: '/admin/dashboard/experiences',
    },
    {
      title: 'Courses',
      count: stats.courses,
      icon: GraduationCap,
      color: '#d97706',
      bg: '#fef3c7',
      href: '/admin/dashboard/courses',
    },
    {
      title: 'Languages',
      count: stats.languages,
      icon: Languages,
      color: '#0891b2',
      bg: '#cffafe',
      href: '/admin/dashboard/languages',
    },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
              Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Selamat datang{fullName ? `, ${fullName}` : ''}! {tagline ? `(${tagline})` : 'Kelola portofolio Anda di sini.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <ExternalLink size={15} /> Lihat Website Publik
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {statCards.map(({ title, count, icon: Icon, color, bg, href }) => (
            <Link
              key={title}
              href={href}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <ArrowUpRight size={18} color="#94a3b8" />
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
                {loading ? '...' : count}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                Total {title}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions & Navigation Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Quick Actions Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Aksi Cepat
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href="/admin/dashboard/projects"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = '#2563eb'; (e.currentTarget).style.background = '#eff6ff' }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = '#e2e8f0'; (e.currentTarget).style.background = '#f8fafc' }}
              >
                <PlusCircle size={16} color="#2563eb" />
                Tambah / Kelola Proyek Portfolio
              </Link>
              <Link
                href="/admin/dashboard/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = '#2563eb'; (e.currentTarget).style.background = '#eff6ff' }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = '#e2e8f0'; (e.currentTarget).style.background = '#f8fafc' }}
              >
                <PlusCircle size={16} color="#2563eb" />
                Ubah Profil & Foto Hero Section
              </Link>
              <Link
                href="/admin/dashboard/skills"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = '#2563eb'; (e.currentTarget).style.background = '#eff6ff' }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = '#e2e8f0'; (e.currentTarget).style.background = '#f8fafc' }}
              >
                <PlusCircle size={16} color="#2563eb" />
                Perbarui Daftar Skills & Kategori
              </Link>
              <Link
                href="/admin/dashboard/contacts"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = '#2563eb'; (e.currentTarget).style.background = '#eff6ff' }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = '#e2e8f0'; (e.currentTarget).style.background = '#f8fafc' }}
              >
                <Phone size={16} color="#2563eb" />
                Update Kontak (WhatsApp, LinkedIn, dll.)
              </Link>
            </div>
          </div>

          {/* Quick Info / Guide Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e40af' }}>
              💡 Petunjuk Pengelolaan
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6, marginBottom: '1rem' }}>
              Seluruh perubahan yang Anda lakukan di dashboard ini akan langsung tampak di halaman publik secara realtime tanpa perlu deploy ulang kode aplikasi.
            </p>
            <ul style={{ fontSize: '0.8125rem', color: '#3b82f6', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
              <li>Gunakan menu di sidebar kiri untuk navigasi antar modul.</li>
              <li>Upload gambar didukung hingga 2MB (JPG, PNG, WebP).</li>
              <li>Untuk proyek berupa video / animasi besar, Anda dapat menggunakan tautan Google Drive pada kolom <strong>External URL</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
