'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import FormDialog from '@/components/admin/FormDialog'
import { createClient } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string | null
  sort_order: number
  created_at?: string
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sort_order: 0,
  })

  const supabase = createClient()

  const loadSkills = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setSkills(data || [])
    } catch (err) {
      console.error('Error fetching skills:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [])

  const handleOpenAdd = () => {
    setEditingSkill(null)
    setFormData({
      name: '',
      category: '',
      sort_order: skills.length + 1,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category || '',
      sort_order: skill.sort_order,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      setSkills(skills.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting skill:', err)
      alert('Gagal menghapus skill.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name: formData.name,
        category: formData.category || null,
        sort_order: Number(formData.sort_order) || 0,
      }

      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', editingSkill.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('skills').insert(payload)
        if (error) throw error
      }

      setDialogOpen(false)
      loadSkills()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan skill'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Nama Skill',
      render: (row: Skill) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.name}</span>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (row: Skill) => (
        <span className="badge">
          {row.category || 'General'}
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
              Kelola Skills
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Kelola keahlian dan kelompokkan berdasarkan kategori.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Tambah Skill
          </button>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <DataTable
            columns={columns}
            data={skills}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Dialog Modal */}
        <FormDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}
          onSubmit={handleSubmit}
          loading={saving}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="skill_name">Nama Skill</label>
            <input
              id="skill_name"
              type="text"
              required
              className="form-input"
              placeholder="Contoh: Next.js, Python, PostgreSQL, Figma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill_cat">Kategori</label>
            <input
              id="skill_cat"
              type="text"
              className="form-input"
              placeholder="Contoh: Frontend, Backend, AI / Machine Learning, Tools"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill_order">Urutan Tampil</label>
            <input
              id="skill_order"
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
