// src/api/axiosInstance.ts
import axios from 'axios'
import { getAuthTokens } from './tokenVault'

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL
const DEFAULT_API_BASE_URL = 'https://shiporbit-main-ultimate-production.up.railway.app/api'

const getApiBaseUrl = () => {
  const fallback = DEFAULT_API_BASE_URL.replace(/\/+$/, '')

  try {
    if (!RAW_API_BASE_URL) return fallback

    const candidate = new URL(RAW_API_BASE_URL, window.location.origin)
    const currentHost = window.location.hostname
    const isHostedFrontend = currentHost.endsWith('netlify.app') || currentHost.endsWith('vercel.app')
    const isLocalhost =
      currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost === '0.0.0.0'
    const pointsBackToFrontend = candidate.hostname === currentHost

    if (pointsBackToFrontend && (isHostedFrontend || !isLocalhost)) {
      return fallback
    }

    const normalized = candidate.href.replace(/\/+$/, '')
    if (normalized.endsWith('/api') || normalized.includes('/api/')) return normalized
    return `${normalized}/api`
  } catch {
    return fallback
  }
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((cfg) => {
  const { accessToken } = getAuthTokens()
  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`
  return cfg
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status
    if (status === 401) {
      return Promise.reject(err)
    }

    return Promise.reject(err)
  },
)

export default api
