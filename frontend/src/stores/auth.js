import { reactive } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  withCredentials: true,
})

// ✅ Configuración consistente del modo demo
const DEMO_MODE = true

// ✅ Usuarios demo con datos completos
const USUARIOS_DEMO = {
  'admin@lms.com': {
    id: 1,
    nombre: 'Admin',
    apellido: 'Sistema',
    rol: 'ADMIN',
    activo: true
  },
  'docente@lms.com': {
    id: 2,
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'DOCENTE',
    activo: true
  },
  'estudiante@lms.com': {
    id: 3,
    nombre: 'María',
    apellido: 'García',
    rol: 'ESTUDIANTE',
    activo: true
  }
}

// ✅ Estado inicial mejorado
export const authStore = reactive({
  user: DEMO_MODE ? USUARIOS_DEMO['estudiante@lms.com'] : null,
  token: DEMO_MODE ? 'demo-token' : null,
  loading: false,
  error: null,

  get isAuthenticated() {
    return !!this.token
  },
  get isAdmin() {
    return this.user?.rol === 'ADMIN'
  },
  get isDocente() {
    return this.user?.rol === 'DOCENTE'
  },
  get isEstudiante() {
    return this.user?.rol === 'ESTUDIANTE'
  },

  async login(credentials) {
    if (DEMO_MODE) {
      return this._loginDemo(credentials)
    }
    return this._loginReal(credentials)
  },

  // ✅ Login demo mejorado
  async _loginDemo(credentials) {
    this.loading = true
    this.error = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const user = USUARIOS_DEMO[credentials.email]
      
      // ✅ Validación de contraseña en modo demo
      const passwordsValidas = ['password', 'admin123']
      if (!user || !passwordsValidas.includes(credentials.password)) {
        this.error = 'Credenciales inválidas. Usa: admin123 o password'
        return { success: false, error: this.error }
      }
      
      // ✅ Actualizar estado
      this.user = { ...user, email: credentials.email }
      this.token = `demo-token-${Date.now()}`
      
      // ✅ Persistencia en localStorage
      localStorage.setItem('demo_token', this.token)
      localStorage.setItem('demo_user', JSON.stringify(this.user))
      
      return { success: true }
    } catch (error) {
      this.error = 'Error en el inicio de sesión'
      return { success: false, error: this.error }
    } finally {
      this.loading = false
    }
  },

  // ✅ Login real (para cuando se conecte backend real)
  async _loginReal(credentials) {
    this.loading = true
    this.error = null

    try {
      const response = await api.post('/auth/login', credentials)
      const { access_token, user } = response.data

      this.token = access_token
      this.user = user
      localStorage.setItem('access_token', access_token)

      return { success: true }
    } catch (err) {
      this.error = err.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, error: this.error }
    } finally {
      this.loading = false
    }
  },

  async register(data) {
    if (DEMO_MODE) {
      return this._registerDemo(data)
    }
    return this._registerReal(data)
  },

  // ✅ Registro demo
  async _registerDemo(data) {
    this.loading = true
    this.error = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simular verificación de email duplicado
      if (USUARIOS_DEMO[data.email]) {
        this.error = 'El email ya está registrado'
        return { success: false, error: this.error }
      }
      
      // En modo demo, no guardamos el usuario pero simulamos éxito
      return { success: true }
    } catch (error) {
      this.error = 'Error en el registro'
      return { success: false, error: this.error }
    } finally {
      this.loading = false
    }
  },

  async _registerReal(data) {
    this.loading = true
    this.error = null

    try {
      await api.post('/auth/register', data)
      return { success: true }
    } catch (err) {
      this.error = err.response?.data?.message || 'Error al registrarse'
      return { success: false, error: this.error }
    } finally {
      this.loading = false
    }
  },

  async logout() {
    if (DEMO_MODE) {
      this.user = null
      this.token = null
      localStorage.removeItem('demo_token')
      localStorage.removeItem('demo_user')
      return
    }

    this.loading = true

    try {
      if (this.token) {
        await api.post('/auth/logout')
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      this.loading = false
    }
  },

  async checkAuth() {
    if (DEMO_MODE) {
      const token = localStorage.getItem('demo_token')
      const user = localStorage.getItem('demo_user')
      if (token && user) {
        try {
          this.token = token
          this.user = JSON.parse(user)
          return true
        } catch (error) {
          console.error('Error parseando usuario demo:', error)
          return false
        }
      }
      return false
    }

    const token = localStorage.getItem('access_token')
    if (!token) return false

    try {
      const response = await api.get('/users/me')
      this.user = response.data
      this.token = token
      return true
    } catch (err) {
      await this.logout()
      return false
    }
  },

  clearError() {
    this.error = null
  }
})

// ✅ Interceptores solo en modo real
if (!DEMO_MODE) {
  api.interceptors.request.use(config => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  api.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        await authStore.logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
}

export { api }