'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import FormDialog from '@/components/admin/FormDialog'
import ImageUploader from '@/components/admin/ImageUploader'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/upload'
import { Plus, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  external_url: string | null
  sort_order: number
  created_at?: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '' as string | null,
    external_url: '',
    sort_order: 0,
  })

  const supabase = createClient()

  const loadProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleOpenAdd = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      image_url: null,
      external_url: '',
      sort_order: projects.length + 1,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      external_url: project.external_url || '',
      sort_order: project.sort_order,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Gagal menghapus proyek.')
    }
  }

  const handleUploadImage = async (file: File) => {
    const url = await uploadImage(file, 'projects')
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }))
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || null,
        external_url: formData.external_url || null,
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
      }

      setDialogOpen(false)
      loadProjects()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan proyek'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'image_url',
      label: 'Thumbnail',
      render: (row: Project) => (
        <div style={{
          width: '50px',
          height: '40px',
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          background: '#f1f5f9',
        }}>
          {row.image_url ? (
            <Image
              src={row.image_url}
              alt={row.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              📁
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Judul Proyek',
      render: (row: Project) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.title}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: 'external_url',
      label: 'Link Eksternal',
      render: (row: Project) => (
        row.external_url ? (
          <a
            href={row.external_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.8125rem',
            }}
          >
            Buka <ExternalLink size={12} />
          </a>
        ) : (
          <span style={{ color: '#94a3b8' }}>—</span>
        )
      ),
    },
    {
      key: 'sort_order',
      label: 'Urutan',
    },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
              Kelola Projects
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Tambah, perbarui, atau hapus proyek portofolio Anda.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Tambah Proyek
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <DataTable
            columns={columns}
            data={projects}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Dialog Modal */}
        <FormDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <ImageUploader
            label="Thumbnail Proyek (Bucket: projects)"
            currentUrl={formData.image_url}
            onUpload={handleUploadImage}
            onRemove={() => setFormData(prev => ({ ...prev, image_url: null }))}
          />

          <div className="form-group">
            <label className="form-label" htmlFor="project_title">Judul Proyek</label>
            <input
              id="project_title"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: AI-Powered Medical Diagnosis App"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="project_desc">Deskripsi Singkat</label>
            <textarea
              id="project_desc"
              rows={3}
              required
              className="form-input"
              style={{ resize: 'vertical' }}
              placeholder="Jelaskan apa yang dibuat, teknologi yang dipakai, dan dampaknya..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="external_url">Link Eksternal / Google Drive</label>
            <input
              id="external_url"
              type="url"
              className="form-input"
              placeholder="https://github.com/... atau https://drive.google.com/..."
              value={formData.external_url}
              onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
            />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Dapat berupa tautan demo, repository GitHub, atau link Google Drive untuk video/animasi besar.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sort_order">Urutan Tampil</label>
            <input
              id="sort_order"
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
