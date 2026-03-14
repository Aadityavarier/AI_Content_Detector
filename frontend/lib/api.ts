import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120_000,
})

export async function detectText(text: string) {
  const form = new FormData()
  form.append('text', text)
  const res = await api.post('/detect/text', form)
  return { ...res.data, type: 'text' }
}

export async function detectAudio(file: File) {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post('/detect/audio', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return { ...res.data, type: 'audio' }
}

export async function detectVideo(file: File) {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post('/detect/video', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return { ...res.data, type: 'video' }
}

export default api
