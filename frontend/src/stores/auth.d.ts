export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'
  activo: boolean
}

export interface AuthStore {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isDocente: boolean
  isEstudiante: boolean
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (data: any) => Promise<{ success: boolean; error?: string }>
  checkAuth: () => Promise<boolean>
  clearError: () => void
}