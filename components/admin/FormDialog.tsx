'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface FormDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  loading?: boolean
  submitLabel?: string
}

export default function FormDialog({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  loading = false,
  submitLabel = 'Simpan',
}: FormDialogProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Dialog */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#fff',
        borderRadius: '1rem',
        width: '100%', maxWidth: '540px',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        animation: 'fadeInUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', borderRadius: '0.5rem',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget).style.background = '#e2e8f0' }}
            onMouseLeave={e => { (e.currentTarget).style.background = '#f1f5f9' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div style={{ padding: '1.5rem' }}>
            {children}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            borderRadius: '0 0 1rem 1rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.25rem', background: '#f1f5f9',
                border: 'none', borderRadius: '0.5rem',
                fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem',
                color: '#475569',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1.25rem', background: loading ? '#93c5fd' : '#2563eb',
                border: 'none', borderRadius: '0.5rem',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem', color: '#fff',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Menyimpan...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
