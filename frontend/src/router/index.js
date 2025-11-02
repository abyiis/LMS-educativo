import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: (to) => {
      // Los admins van a /admin, los docentes a /tareas, otros a /dashboard
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
    meta: { requiresAuth: true, excludeRole: ['ADMIN', 'DOCENTE'] }
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
    path: '/calificaciones',
    name: 'Calificaciones',
    component: () => import('../views/CalificacionesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/certificados',
    name: 'Certificados',
    component: () => import('../views/CertificadosView.vue'),
    meta: { requiresAuth: true, excludeRole: 'ADMIN' }
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: () => import('../views/CalendarioView.vue'),
    meta: { requiresAuth: true, excludeRole: 'ADMIN' }
  },
  {
    path: '/progreso',
    name: 'Progreso',
    component: () => import('../views/ProgresoView.vue'),
    meta: { requiresAuth: true, excludeRole: 'ADMIN' }
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

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  // Si es la ruta raíz, redirigir según rol
  if (to.path === '/' || to.path === '') {
    if (authStore.isAuthenticated || await authStore.checkAuth()) {
      const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
      next(redirectTo)
      return
    }
    next('/login')
    return
  }
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    const isAuth = await authStore.checkAuth()
    if (!isAuth) {
      next('/login')
      return
    }
  }

  // Redirigir usuarios autenticados
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Admin va a /admin, docentes a /tareas, otros a /dashboard
    const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
    next(redirectTo)
    return
  }

  // Verificar roles
  if (to.meta.requiresRole && authStore.user?.rol !== to.meta.requiresRole) {
    // Admin va a /admin, docentes a /tareas, otros a /dashboard
    const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
    next(redirectTo)
    return
  }

  // Verificar exclusión de roles
  if (to.meta.excludeRole) {
    const excludedRoles = Array.isArray(to.meta.excludeRole) 
      ? to.meta.excludeRole 
      : [to.meta.excludeRole]
    if (excludedRoles.includes(authStore.user?.rol)) {
      // Admin va a /admin, docentes a /tareas, otros a /dashboard
      const redirectTo = authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
      next(redirectTo)
      return
    }
  }

  next()
})

export default router