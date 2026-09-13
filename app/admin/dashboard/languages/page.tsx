'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import FormDialog from '@/components/admin/FormDialog'
import { createClient } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'

interface Language {
  id: string
  language_name: string
  level: string
  sort_order: number
}

const levelOptions = ['Native', 'Fluent', 'Intermediate', 'Basic']

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingLang, setEditingLang] = useState<Language | null>(null)

  const [formData, setFormData] = useState({
    language_name: '',
    level: 'Fluent',
    sort_order: 0,
  })

  const supabase = createClient()

  const loadLanguages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setLanguages(data || [])
    } catch (err) {
      console.error('Error fetching languages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLanguages()
  }, [])

  const handleOpenAdd = () => {
    setEditingLang(null)
    setFormData({
      language_name: '',
      level: 'Fluent',
      sort_order: languages.length + 1,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (lang: Language) => {
    setEditingLang(lang)
    setFormData({
      language_name: lang.language_name,
      level: lang.level,
      sort_order: lang.sort_order,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('languages').delete().eq('id', id)
      if (error) throw error
      setLanguages(languages.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error deleting language:', err)
      alert('Gagal menghapus bahasa.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        language_name: formData.language_name,
        level: formData.level,
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingLang) {
        const { error } = await supabase
          .from('languages')
          .update(payload)
          .eq('id', editingLang.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('languages').insert(payload)
        if (error) throw error
      }

      setDialogOpen(false)
      loadLanguages()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan bahasa'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'language_name',
      label: 'Bahasa',
      render: (row: Language) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.language_name}</span>
      ),
    },
    {
      key: 'level',
      label: 'Tingkat Kemahiran',
      render: (row: Language) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Native: { bg: '#dcfce7', text: '#15803d' },
          Fluent: { bg: '#dbeafe', text: '#1d4ed8' },
          Intermediate: { bg: '#fef3c7', text: '#b45309' },
          Basic: { bg: '#fee2e2', text: '#b91c1c' },
        }
        const c = colors[row.level] || { bg: '#f1f5f9', text: '#475569' }
        return (
          <span style={{
            background: c.bg,
            color: c.text,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            {row.level}
          </span>
        )
      },
    },
    {
      key: 'sort_order',
      label: 'Urutan',
    },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
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
              Kelola Bahasa
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Atur bahasa yang Anda kuasai beserta tingkat kemahirannya.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Tambah Bahasa
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <DataTable
            columns={columns}
            data={languages}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Dialog Modal */}
        <FormDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingLang ? 'Edit Bahasa' : 'Tambah Bahasa Baru'}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="lang_name">Nama Bahasa</label>
            <input
              id="lang_name"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: Bahasa Indonesia, English, Japanese"
              value={formData.language_name}
              onChange={(e) => setFormData({ ...formData, language_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lang_level">Tingkat Kemahiran</label>
            <select
              id="lang_level"
              className="form-input"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              {levelOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lang_order">Urutan Tampil</label>
            <input
              id="lang_order"
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
