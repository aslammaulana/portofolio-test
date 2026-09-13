export async function uploadImage(file: File, bucket: 'avatars' | 'projects'): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', bucket)

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json()
      console.error('Upload error:', err)
      return null
    }
    const data = await res.json()
    return data.url
  } catch (err) {
    console.error('Upload network error:', err)
    return null
  }
}
