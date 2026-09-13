'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { createClient } from '@/lib/supabase/client'
import { Check, Save, MessageCircle, Mail } from 'lucide-react'
import { InstagramIcon, LinkedinIcon } from '@/components/icons'

interface ContactData {
  id?: string
  whatsapp_url: string
  email: string
  instagram_url: string
  linkedin_url: string
}

export default function AdminContactsPage() {
  const [formData, setFormData] = useState<ContactData>({
    whatsapp_url: '',
    email: '',
    instagram_url: '',
    linkedin_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadContacts() {
      setLoading(true)
      try {
        const { data } = await supabase.from('contacts').select('*').single()
        if (data) {
          setFormData({
            id: data.id,
            whatsapp_url: data.whatsapp_url || '',
            email: data.email || '',
            instagram_url: data.instagram_url || '',
            linkedin_url: data.linkedin_url || '',
          })
        }
      } catch (err) {
        console.error('Error fetching contacts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('contacts')
          .update({
            whatsapp_url: formData.whatsapp_url,
            email: formData.email,
            instagram_url: formData.instagram_url,
            linkedin_url: formData.linkedin_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('contacts').insert({
          whatsapp_url: formData.whatsapp_url,
          email: formData.email,
          instagram_url: formData.instagram_url,
          linkedin_url: formData.linkedin_url,
        })

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Informasi kontak berhasil diperbarui!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan kontak'
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
            Kelola Kontak
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Atur tautan media sosial dan channel komunikasi Anda untuk bagian Hubungi Saya.
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
              Memuat data kontak...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="whatsapp_url">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageCircle size={16} color="#25D366" /> Link WhatsApp
                  </span>
                </label>
                <input
                  id="whatsapp_url"
                  type="url"
                  className="form-input"
                  placeholder="https://wa.me/6281234567890"
                  value={formData.whatsapp_url}
                  onChange={(e) => setFormData({ ...formData, whatsapp_url: e.target.value })}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Format: https://wa.me/&lt;nomor-internasional&gt; (gunakan 62, bukan 08)
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact_email">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={16} color="#2563eb" /> Alamat Email
                  </span>
                </label>
                <input
                  id="contact_email"
                  type="email"
                  className="form-input"
                  placeholder="anda@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="instagram_url">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <InstagramIcon size={16} color="#e1306c" /> Link Instagram
                  </span>
                </label>
                <input
                  id="instagram_url"
                  type="url"
                  className="form-input"
                  placeholder="https://instagram.com/username_anda"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="linkedin_url">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <LinkedinIcon size={16} color="#0a66c2" /> Link LinkedIn
                  </span>
                </label>
                <input
                  id="linkedin_url"
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/username_anda"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
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
                  {saving ? 'Menyimpan...' : 'Simpan Kontak'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
