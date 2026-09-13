import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import SkillsSection from '@/components/public/SkillsSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import ExperienceSection from '@/components/public/ExperienceSection'
import CoursesSection from '@/components/public/CoursesSection'
import LanguagesSection from '@/components/public/LanguagesSection'
import ContactSection from '@/components/public/ContactSection'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase.from('profile').select('*').single()
    return {
      title: profile?.full_name ? `${profile.full_name} — Portfolio` : 'Portfolio | Personal Website',
      description: profile?.tagline || 'Personal portfolio website',
      openGraph: {
        images: profile?.avatar_url ? [profile.avatar_url] : [],
      },
    }
  } catch {
    return {
      title: 'Portfolio | Personal Website',
      description: 'Personal portfolio website',
    }
  }
}

interface SkillItem {
  id: string
  name: string
  category: string | null
  sort_order: number
}

interface ProjectItem {
  id: string
  title: string
  description: string
  image_url: string | null
  external_url: string | null
  sort_order: number
}

interface ExperienceItem {
  id: string
  company_name: string
  location: string
  year_start: string
  year_end: string | null
  description: string
  sort_order: number
}

interface CourseItem {
  id: string
  course_name: string
  organizer: string
  year: string
  location: string
  description: string
  sort_order: number
}

interface LanguageItem {
  id: string
  language_name: string
  level: string
  sort_order: number
}

export default async function HomePage() {
  let profile = null
  let skills: SkillItem[] = []
  let projects: ProjectItem[] = []
  let experiences: ExperienceItem[] = []
  let courses: CourseItem[] = []
  let languages: LanguageItem[] = []
  let contact = null

  try {
    const supabase = await createClient()

    const [
      { data: pData },
      { data: sData },
      { data: prData },
      { data: eData },
      { data: cData },
      { data: lData },
      { data: ctData },
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('experiences').select('*').order('sort_order'),
      supabase.from('courses').select('*').order('sort_order'),
      supabase.from('languages').select('*').order('sort_order'),
      supabase.from('contacts').select('*').single(),
    ])

    profile = pData
    skills = sData || []
    projects = prData || []
    experiences = eData || []
    courses = cData || []
    languages = lData || []
    contact = ctData
  } catch (err) {
    console.warn('Supabase not connected yet, using initial preview data:', err)
  }

  // Fallback preview data if database is empty or not yet connected
  if (!profile) {
    profile = {
      full_name: 'Muhammad Aslam',
      tagline: 'AI Engineer & Full Stack Developer',
      description: 'Membangun solusi teknologi berbasis AI dan sistem web modern yang cepat, terukur, dan berdampak nyata.',
      avatar_url: null,
    }
  }

  if (skills.length === 0) {
    skills = [
      { id: '1', name: 'Next.js 15', category: 'Frontend', sort_order: 1 },
      { id: '2', name: 'React', category: 'Frontend', sort_order: 2 },
      { id: '3', name: 'TypeScript', category: 'Frontend', sort_order: 3 },
      { id: '4', name: 'Tailwind CSS', category: 'Frontend', sort_order: 4 },
      { id: '5', name: 'Python', category: 'AI & Backend', sort_order: 5 },
      { id: '6', name: 'FastAPI', category: 'AI & Backend', sort_order: 6 },
      { id: '7', name: 'PostgreSQL', category: 'Database', sort_order: 7 },
      { id: '8', name: 'Supabase', category: 'Database', sort_order: 8 },
      { id: '9', name: 'Docker', category: 'Tools', sort_order: 9 },
      { id: '10', name: 'Git', category: 'Tools', sort_order: 10 },
    ]
  }

  if (projects.length === 0) {
    projects = [
      {
        id: '1',
        title: 'Portfolio & CMS Platform',
        description: 'Website portofolio dengan CMS admin mandiri, proteksi Supabase Auth, dan auto keep-alive cron.',
        image_url: null,
        external_url: 'https://github.com',
        sort_order: 1,
      },
      {
        id: '2',
        title: 'AI Document Knowledge Base',
        description: 'Sistem tanya jawab cerdas berbasis RAG dan LLM untuk dokumen organisasi.',
        image_url: null,
        external_url: 'https://github.com',
        sort_order: 2,
      },
    ]
  }

  if (experiences.length === 0) {
    experiences = [
      {
        id: '1',
        company_name: 'Tech & AI Solutions',
        location: 'Jakarta, Indonesia',
        year_start: '2023',
        year_end: null,
        description: 'Mengembangkan arsitektur aplikasi berbasis Next.js, integrasi Supabase, dan solusi otomatisasi AI.',
        sort_order: 1,
      },
    ]
  }

  if (courses.length === 0) {
    courses = [
      {
        id: '1',
        course_name: 'Full Stack Engineering & Modern Cloud Architecture',
        organizer: 'Professional Certification',
        year: '2024',
        location: 'Online',
        description: 'Penguasaan arsitektur cloud modern, API design, database relational, dan deployment.',
        sort_order: 1,
      },
    ]
  }

  if (languages.length === 0) {
    languages = [
      { id: '1', language_name: 'Bahasa Indonesia', level: 'Native', sort_order: 1 },
      { id: '2', language_name: 'English', level: 'Fluent', sort_order: 2 },
    ]
  }

  if (!contact) {
    contact = {
      whatsapp_url: 'https://wa.me/',
      email: 'aslam@example.com',
      instagram_url: 'https://instagram.com',
      linkedin_url: 'https://linkedin.com',
    }
  }

  return (
    <main>
      <Navbar brandName={profile?.full_name?.split(' ')[0] || 'Portfolio'} />

      <HeroSection profile={profile} contact={contact} />
      <SkillsSection skills={skills || []} />
      <ProjectsSection projects={projects || []} />
      <ExperienceSection experiences={experiences || []} />
      <CoursesSection courses={courses || []} />
      <LanguagesSection languages={languages || []} />
      <ContactSection contact={contact} />

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '0.875rem',
      }}>
        <p>
          © {new Date().getFullYear()} {profile?.full_name || 'Portfolio'}.
          {' '}Built with Next.js & Supabase.
        </p>
      </footer>
    </main>
  )
}
