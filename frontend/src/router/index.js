import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: (to) => {
      if (authStore.isAdmin) return '/admin'
      if (authStore.isDocente) return '/tareas'
      return '/dashboard'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos',
    name: 'Cursos',
    component: () => import('../views/CursosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos/crear',
    name: 'CrearCurso',
    component: () => import('../views/CrearCursoView.vue'),
    meta: { requiresAuth: true, requiresRole: 'ADMIN' }
  },
  {
    path: '/cursos/:id',
    name: 'CursoDetail',
    component: () => import('../views/CursoDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cursos/:id/clases/:claseId',
    name: 'ClaseDetail',
    component: () => import('../views/ClaseDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas',
    name: 'Tareas',
    component: () => import('../views/TareasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas/crear',
    name: 'CrearTarea',
    component: () => import('../views/CrearTareaView.vue'),
    meta: { requiresAuth: true, requiresRole: 'DOCENTE' }
  },
  {
    path: '/tareas/:id',
    name: 'TareaDetail',
    component: () => import('../views/TareaDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/entregas',
    name: 'Entregas',
    component: () => import('../views/EntregasView.vue'),
    meta: { requiresAuth: true, requiresRole: ['DOCENTE', 'ADMIN'] }
  },
  {
    path: '/calificaciones',
    name: 'Calificaciones',
    component: () => import('../views/CalificacionesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/certificados',
    name: 'Certificados',
    component: () => import('../views/CertificadosView.vue'),
    meta: { requiresAuth: true, requiresRole: ['ESTUDIANTE', 'DOCENTE'] }
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: () => import('../views/CalendarioView.vue'),
    meta: { requiresAuth: true, requiresRole: ['ESTUDIANTE', 'DOCENTE'] }
  },
  {
    path: '/progreso',
    name: 'Progreso',
    component: () => import('../views/ProgresoView.vue'),
    meta: { requiresAuth: true, requiresRole: ['ESTUDIANTE', 'DOCENTE'] }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiresRole: 'ADMIN' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Variable para evitar loops infinitos
let isCheckingAuth = false

// Guard de navegación mejorado
router.beforeEach(async (to, from, next) => {
  // Evitar loops infinitos
  if (isCheckingAuth) {
    next()
    return
  }

  // ✅ PASO 1: Verificar autenticación PRIMERO si la ruta lo requiere
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      isCheckingAuth = true
      const isAuth = await authStore.checkAuth()
      isCheckingAuth = false
      
      if (!isAuth) {
        next('/login')
        return
      }
    }
  }

  // ✅ PASO 2: Manejar ruta raíz
  if (to.path === '/' || to.path === '') {
    if (!authStore.isAuthenticated) {
      isCheckingAuth = true
      const isAuth = await authStore.checkAuth()
      isCheckingAuth = false
      
      if (!isAuth) {
        next('/login')
        return
      }
    }
    
    const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
    next(redirectTo)
    return
  }

  // ✅ PASO 3: Redirigir usuarios autenticados de páginas de invitado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
    next(redirectTo)
    return
  }

  // ✅ PASO 4: Verificar roles requeridos (solo SI ya está autenticado)
  if (to.meta.requiresRole && authStore.isAuthenticated) {
    const requiredRoles = Array.isArray(to.meta.requiresRole) 
      ? to.meta.requiresRole 
      : [to.meta.requiresRole]
    
    if (!requiredRoles.includes(authStore.user?.rol)) {
      console.warn(`Acceso denegado a ${to.path}. Rol requerido: ${requiredRoles}, Rol usuario: ${authStore.user?.rol}`)
      const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
      next(redirectTo)
      return
    }
  }

  // ✅ Todo OK, permitir navegación
  next()
})

export default router