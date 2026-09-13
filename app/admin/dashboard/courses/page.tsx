'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import FormDialog from '@/components/admin/FormDialog'
import { createClient } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'

interface Course {
  id: string
  course_name: string
  organizer: string
  year: string
  location: string
  description: string
  sort_order: number
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [formData, setFormData] = useState({
    course_name: '',
    organizer: '',
    year: '',
    location: '',
    description: '',
    sort_order: 0,
  })

  const supabase = createClient()

  const loadCourses = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCourses(data || [])
    } catch (err) {
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleOpenAdd = () => {
    setEditingCourse(null)
    setFormData({
      course_name: '',
      organizer: '',
      year: new Date().getFullYear().toString(),
      location: '',
      description: '',
      sort_order: courses.length + 1,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      course_name: course.course_name,
      organizer: course.organizer,
      year: course.year,
      location: course.location,
      description: course.description,
      sort_order: course.sort_order,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
      setCourses(courses.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting course:', err)
      alert('Gagal menghapus kursus/pelatihan.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        course_name: formData.course_name,
        organizer: formData.organizer,
        year: formData.year,
        location: formData.location,
        description: formData.description,
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('courses').insert(payload)
        if (error) throw error
      }

      setDialogOpen(false)
      loadCourses()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan pelatihan'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'course_name',
      label: 'Nama Pelatihan',
      render: (row: Course) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.course_name}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{row.organizer}</div>
        </div>
      ),
    },
    {
      key: 'year',
      label: 'Tahun',
      render: (row: Course) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2563eb' }}>
          {row.year}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Lokasi',
      render: (row: Course) => (
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
          {row.location || 'Online'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Urutan',
    },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
              Kelola Kursus & Pelatihan
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Kelola daftar sertifikasi, workshop, dan pelatihan yang pernah Anda ikuti.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Tambah Pelatihan
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <DataTable
            columns={columns}
            data={courses}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Dialog Modal */}
        <FormDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingCourse ? 'Edit Pelatihan' : 'Tambah Pelatihan Baru'}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="course_name">Nama Kursus / Pelatihan</label>
            <input
              id="course_name"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: AWS Certified Solutions Architect"
              value={formData.course_name}
              onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="organizer">Penyelenggara / Institusi</label>
            <input
              id="organizer"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: Amazon Web Services / Coursera"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="course_year">Tahun Pelaksanaan</label>
              <input
                id="course_year"
                type="text"
                required
                className="form-input"
                placeholder="Contoh: 2023"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="course_location">Lokasi / Format</label>
              <input
                id="course_location"
                type="text"
                className="form-input"
                placeholder="Contoh: Online / Jakarta"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="course_desc">Deskripsi Singkat</label>
            <textarea
              id="course_desc"
              rows={3}
              className="form-input"
              style={{ resize: 'vertical' }}
              placeholder="Materi inti atau sertifikat yang diraih..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="course_order">Urutan Tampil</label>
            <input
              id="course_order"
              type="number"
              className="form-input"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />
          </div>
        </FormDialog>
      </div>
    </AdminLayout>
  )
}
