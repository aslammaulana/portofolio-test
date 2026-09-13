'use client'

import { Pencil, Trash2 } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  onEdit: (row: T) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          border: '3px solid #dbeafe', borderTopColor: '#2563eb',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        Memuat data...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
        <p>Belum ada data. Klik &ldquo;Tambah&rdquo; untuk memulai.</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            <th style={{ width: '120px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                </td>
              ))}
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onEdit(row)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.375rem 0.75rem', background: '#dbeafe',
                      color: '#2563eb', border: 'none', borderRadius: '0.375rem',
                      fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget).style.background = '#bfdbfe' }}
                    onMouseLeave={e => { (e.currentTarget).style.background = '#dbeafe' }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus?')) onDelete(row.id)
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.375rem 0.75rem', background: '#fee2e2',
                      color: '#ef4444', border: 'none', borderRadius: '0.375rem',
                      fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget).style.background = '#fecaca' }}
                    onMouseLeave={e => { (e.currentTarget).style.background = '#fee2e2' }}
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
