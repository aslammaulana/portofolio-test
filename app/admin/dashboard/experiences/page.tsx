'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import FormDialog from '@/components/admin/FormDialog'
import { createClient } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'

interface Experience {
  id: string
  company_name: string
  location: string
  year_start: string
  year_end: string | null
  description: string
  sort_order: number
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)

  const [formData, setFormData] = useState({
    company_name: '',
    location: '',
    year_start: '',
    year_end: '',
    description: '',
    sort_order: 0,
  })

  const supabase = createClient()

  const loadExperiences = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setExperiences(data || [])
    } catch (err) {
      console.error('Error fetching experiences:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExperiences()
  }, [])

  const handleOpenAdd = () => {
    setEditingExp(null)
    setFormData({
      company_name: '',
      location: '',
      year_start: '',
      year_end: '',
      description: '',
      sort_order: experiences.length + 1,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp)
    setFormData({
      company_name: exp.company_name,
      location: exp.location,
      year_start: exp.year_start,
      year_end: exp.year_end || '',
      description: exp.description,
      sort_order: exp.sort_order,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) throw error
      setExperiences(experiences.filter(e => e.id !== id))
    } catch (err) {
      console.error('Error deleting experience:', err)
      alert('Gagal menghapus pengalaman.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        company_name: formData.company_name,
        location: formData.location,
        year_start: formData.year_start,
        year_end: formData.year_end || null,
        description: formData.description,
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingExp) {
        const { error } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', editingExp.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('experiences').insert(payload)
        if (error) throw error
      }

      setDialogOpen(false)
      loadExperiences()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan pengalaman'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'company_name',
      label: 'Instansi / Perusahaan',
      render: (row: Experience) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.company_name}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{row.location}</div>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Periode',
      render: (row: Experience) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2563eb' }}>
          {row.year_start} — {row.year_end || 'Sekarang'}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Deskripsi',
      render: (row: Experience) => (
        <div style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.description}
        </div>
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
              Kelola Pengalaman Kerja
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Tambah atau perbarui riwayat pengalaman profesional untuk timeline karir Anda.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Tambah Pengalaman
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <DataTable
            columns={columns}
            data={experiences}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Dialog Modal */}
        <FormDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingExp ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="company_name">Nama Instansi / Perusahaan</label>
            <input
              id="company_name"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: PT Teknologi Maju Bersama"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp_location">Lokasi</label>
            <input
              id="exp_location"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: Jakarta, Indonesia (atau Remote)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="year_start">Tahun Mulai</label>
              <input
                id="year_start"
                type="text"
                required
                className="form-input"
                placeholder="Contoh: 2022"
                value={formData.year_start}
                onChange={(e) => setFormData({ ...formData, year_start: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="year_end">Tahun Selesai</label>
              <input
                id="year_end"
                type="text"
                className="form-input"
                placeholder="Kosongkan jika 'Sekarang'"
                value={formData.year_end}
                onChange={(e) => setFormData({ ...formData, year_end: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp_desc">Deskripsi Tugas & Pencapaian</label>
            <textarea
              id="exp_desc"
              rows={4}
              required
              className="form-input"
              style={{ resize: 'vertical' }}
              placeholder="Jelaskan peran, tanggung jawab utama, teknologi yang digunakan, serta dampak yang dicapai..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp_order">Urutan Tampil</label>
            <input
              id="exp_order"
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
