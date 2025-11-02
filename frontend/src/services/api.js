import axios from 'axios'

// ✅ Detectar modo demo desde auth store
const DEMO_MODE = true // Debe coincidir con auth.js

// Configurar axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  withCredentials: true,
})

// Interceptor para agregar token
api.interceptors.request.use(config => {
  if (DEMO_MODE) {
    // En modo demo, usar token demo
    const token = localStorage.getItem('demo_token') || 'demo-token'
    config.headers.Authorization = `Bearer ${token}`
  } else {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para manejar errores 401
api.interceptors.response.use(
  response => response,
  async error => {
    // ✅ NO redirigir en modo demo - las vistas manejan los errores con datos demo
    if (!DEMO_MODE && error.response?.status === 401) {
      // Limpiar token y redirigir al login
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { api }