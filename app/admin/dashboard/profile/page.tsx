'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUploader from '@/components/admin/ImageUploader'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/upload'
import { Check, Save } from 'lucide-react'

interface ProfileData {
  id?: string
  full_name: string
  tagline: string
  description: string
  avatar_url: string | null
}

export default function AdminProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    tagline: '',
    description: '',
    avatar_url: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('profile').select('*').single()
        if (data) {
          setFormData({
            id: data.id,
            full_name: data.full_name || '',
            tagline: data.tagline || '',
            description: data.description || '',
            avatar_url: data.avatar_url || null,
          })
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadImage(file, 'avatars')
    if (url) {
      setFormData(prev => ({ ...prev, avatar_url: url }))
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('profile')
          .update({
            full_name: formData.full_name,
            tagline: formData.tagline,
            description: formData.description,
            avatar_url: formData.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('profile').insert({
          full_name: formData.full_name,
          tagline: formData.tagline,
          description: formData.description,
          avatar_url: formData.avatar_url,
        })

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data'
      setMessage({ type: 'error', text: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
            Kelola Profil (Hero Section)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Informasi ini ditampilkan di bagian paling atas (Hero) pada website portofolio Anda.
          </p>
        </div>

        {message && (
          <div style={{
            padding: '0.875rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
          }}>
            {message.type === 'success' ? <Check size={18} /> : <span>⚠️</span>}
            <span>{message.text}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              Memuat data profil...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <ImageUploader
                label="Foto Profil (Avatar)"
                currentUrl={formData.avatar_url}
                onUpload={handleUploadAvatar}
                onRemove={() => setFormData(prev => ({ ...prev, avatar_url: null }))}
              />

              <div className="form-group">
                <label className="form-label" htmlFor="full_name">Nama Lengkap</label>
                <input
                  id="full_name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: Muhammad Aslam"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tagline">Tagline / Headline Profesi</label>
                <input
                  id="tagline"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: AI Engineer & Full Stack Developer"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Deskripsi Singkat</label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  className="form-input"
                  style={{ resize: 'vertical' }}
                  placeholder="Ceritakan ringkasan latar belakang, fokus keahlian, dan minat profesional Anda..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ minWidth: '140px', justifyContent: 'center' }}
                >
                  <Save size={16} />
                  {saving ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
