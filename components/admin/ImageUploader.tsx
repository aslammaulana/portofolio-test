'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  currentUrl?: string | null
  onUpload: (file: File) => Promise<string | null>
  onRemove?: () => void
  label?: string
  accept?: string
  maxSizeMB?: number
}

export default function ImageUploader({
  currentUrl,
  onUpload,
  onRemove,
  label = 'Gambar',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 2,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentUrl || null)
  }, [currentUrl])

  const handleFile = useCallback(async (file: File) => {
    setError(null)

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')
      return
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file maksimum ${maxSizeMB}MB.`)
      return
    }

    // Local preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Upload
    setUploading(true)
    const url = await onUpload(file)
    setUploading(false)

    if (url) {
      setPreview(url)
    } else {
      setError('Upload gagal. Coba lagi.')
      setPreview(currentUrl || null)
    }
  }, [currentUrl, maxSizeMB, onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Image
              src={preview}
              alt="Preview"
              width={160}
              height={120}
              style={{ borderRadius: '0.5rem', objectFit: 'cover', display: 'block' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
                onRemove?.()
              }}
              style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#ef4444', border: 'none', borderRadius: '50%',
                width: '22px', height: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div style={{ color: '#94a3b8' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              {dragging ? <Upload size={32} color="#2563eb" /> : <ImageIcon size={32} />}
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569' }}>
              {dragging ? 'Lepas file di sini' : 'Drag & drop atau klik untuk pilih'}
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              JPG, PNG, WebP — maks. {maxSizeMB}MB
            </p>
          </div>
        )}

        {uploading && (
          <p style={{ marginTop: '0.5rem', color: '#2563eb', fontSize: '0.875rem', fontWeight: 500 }}>
            ⏳ Mengupload...
          </p>
        )}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
