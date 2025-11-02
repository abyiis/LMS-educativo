<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  ¡Bienvenido de nuevo, {{ authStore.user?.nombre }}! 👋
                </h1>
                <p class="text-muted mb-0 fs-5">
                  <i class="bi bi-person-badge me-2"></i>
                  {{ getRoleText(authStore.user?.rol) }}
                </p>
              </div>
              <div class="d-none d-md-flex align-items-center gap-3">
                <div class="text-end">
                  <small class="text-muted d-block">Último acceso</small>
                  <strong>{{ fechaActual }}</strong>
                </div>
                <div class="position-relative">
                  <div class="rounded-circle bg-gradient-primary text-white d-flex align-items-center justify-content-center pulse" 
                       style="width: 70px; height: 70px; font-size: 1.8rem; font-weight: 700;">
                    {{ userInitials }}
                  </div>
                  <div class="position-absolute bottom-0 end-0">
                    <span class="badge bg-success rounded-circle p-2">
                      <i class="bi bi-check-lg"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-5">
        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Mis Cursos</p>
                  <p class="h3 mb-0 text-primary fw-bold">{{ stats.misCursos }}</p>
                  <small class="text-success">
                    <i class="bi bi-arrow-up me-1"></i>+2 este mes
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                    <i class="bi bi-book-fill text-primary fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Tareas Pendientes</p>
                  <p class="h3 mb-0 text-warning fw-bold">{{ stats.tareasPendientes }}</p>
                  <small class="text-warning">
                    <i class="bi bi-clock me-1"></i>Requieren atención
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-3">
                    <i class="bi bi-clipboard-check-fill text-warning fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Tareas Completadas</p>
                  <p class="h3 mb-0 text-success fw-bold">{{ stats.tareasCompletadas }}</p>
                  <small class="text-success">
                    <i class="bi bi-check-circle me-1"></i>¡Excelente trabajo!
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3">
                    <i class="bi bi-check-circle-fill text-success fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.4s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Mensajes</p>
                  <p class="h3 mb-0 text-info fw-bold">{{ stats.mensajes }}</p>
                  <small class="text-info">
                    <i class="bi bi-chat-dots me-1"></i>Nuevos mensajes
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-info bg-opacity-10 p-3">
                    <i class="bi bi-chat-dots-fill text-info fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progreso General -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card-hover animate-slide-in" style="animation-delay: 0.5s;">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="mb-0 text-gradient">
                  <i class="bi bi-graph-up me-2"></i>Tu Progreso Este Mes
                </h5>
                <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  {{ progresoMensual }}% Completado
                </span>
              </div>
              <div class="progress mb-2" style="height: 20px;">
                <div 
                  class="progress-bar bg-gradient-primary" 
                  :style="{ width: progresoMensual + '%' }"
                  role="progressbar">
                  <span class="fw-bold">{{ progresoMensual }}%</span>
                </div>
              </div>
              <div class="d-flex justify-content-between text-muted small">
                <span>{{ stats.tareasCompletadas }} tareas completadas</span>
                <span>Meta: {{ stats.tareasCompletadas + stats.tareasPendientes }} tareas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="row g-4">
        <!-- Mis Cursos -->
        <div class="col-lg-6">
          <div class="card-hover h-100 animate-slide-in" style="animation-delay: 0.6s;">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="card-title mb-0 text-gradient">
                  <i class="bi bi-book-fill me-2"></i>Mis Cursos
                </h5>
                <RouterLink to="/cursos" class="btn btn-outline-primary btn-sm">
                  Ver todos
                </RouterLink>
              </div>
            </div>
            <div class="card-body p-4">
              <div v-if="loading" class="text-center py-5">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-muted mt-3">Cargando cursos...</p>
              </div>
              <div v-else-if="cursos.length === 0" class="text-center py-5">
                <div class="mb-3">
                  <i class="bi bi-book text-muted" style="font-size: 3rem;"></i>
                </div>
                <h6 class="text-muted">No estás matriculado en ningún curso</h6>
                <p class="text-muted small">Explora los cursos disponibles y comienza tu aprendizaje</p>
                <RouterLink to="/cursos" class="btn btn-gradient mt-2">
                  Explorar Cursos
                </RouterLink>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="(curso, index) in cursos"
                  :key="curso.id"
                  class="d-flex align-items-center justify-content-between p-3 glass-effect rounded-3 hover-lift"
                  :style="{ animationDelay: `${0.7 + index * 0.1}s` }"
                >
                  <div class="d-flex align-items-center flex-grow-1">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-book text-primary fs-5"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 fw-semibold">{{ curso.curso.titulo }}</h6>
                      <small class="text-muted">{{ curso.curso.codigo }}</small>
                      <div class="progress mt-2" style="height: 6px;">
                        <div class="progress-bar bg-gradient-primary" :style="{ width: curso.progreso + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <RouterLink
                    :to="`/cursos/${curso.curso.id}`"
                    class="btn btn-gradient btn-sm ms-3"
                  >
                    <i class="bi bi-arrow-right"></i>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tareas Recientes -->
        <div class="col-lg-6">
          <div class="card-hover h-100 animate-slide-in" style="animation-delay: 0.8s;">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="card-title mb-0 text-gradient">
                  <i class="bi bi-clipboard-check-fill me-2"></i>Tareas Próximas
                </h5>
                <RouterLink to="/tareas" class="btn btn-outline-primary btn-sm">
                  Ver todas
                </RouterLink>
              </div>
            </div>
            <div class="card-body p-4">
              <div v-if="loading" class="text-center py-5">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-muted mt-3">Cargando tareas...</p>
              </div>
              <div v-else-if="tareas.length === 0" class="text-center py-5">
                <div class="mb-3">
                  <i class="bi bi-clipboard-check text-muted" style="font-size: 3rem;"></i>
                </div>
                <h6 class="text-muted">No hay tareas asignadas</h6>
                <p class="text-muted small">Las tareas aparecerán aquí cuando estén disponibles</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="(tarea, index) in tareas"
                  :key="tarea.id"
                  class="d-flex align-items-center justify-content-between p-3 glass-effect rounded-3 hover-lift"
                  :style="{ animationDelay: `${0.9 + index * 0.1}s` }"
                >
                  <div class="d-flex align-items-center flex-grow-1">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                      <i class="bi bi-clipboard-check text-warning fs-5"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 fw-semibold">{{ tarea.titulo }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-calendar me-1"></i>
                        {{ formatDate(tarea.fechaLimite) }}
                      </small>
                      <div class="mt-1">
                        <span class="badge bg-info bg-opacity-10 text-info small">
                          {{ getDiasRestantes(tarea.fechaLimite) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <RouterLink
                    :to="`/tareas/${tarea.id}`"
                    class="btn btn-gradient btn-sm ms-3"
                  >
                    <i class="bi bi-arrow-right"></i>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card-hover animate-slide-in" style="animation-delay: 1s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-clock-history me-2"></i>Actividad Reciente
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div v-for="(actividad, index) in actividadReciente" :key="index" class="col-md-6 col-lg-3">
                  <div class="glass-effect p-3 rounded-3 hover-lift">
                    <div class="d-flex align-items-start">
                      <div class="rounded-circle me-3 p-2" :class="actividad.bgClass">
                        <i :class="actividad.icon"></i>
                      </div>
                      <div class="flex-grow-1">
                        <p class="mb-1 fw-semibold small">{{ actividad.titulo }}</p>
                        <small class="text-muted">{{ actividad.tiempo }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="row g-4 mt-4">
        <div class="col-12">
          <div class="card-hover animate-fade-in" style="animation-delay: 1.1s;">
            <div class="card-body p-4">
              <h5 class="card-title text-gradient mb-4">
                <i class="bi bi-lightning-fill me-2"></i>Acciones Rápidas
              </h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/cursos" class="btn btn-outline-primary w-100 p-3 hover-lift text-center">
                    <i class="bi bi-book-fill d-block mb-2 fs-4"></i>
                    <span class="small">Explorar Cursos</span>
                  </RouterLink>
                </div>
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/tareas" class="btn btn-outline-success w-100 p-3 hover-lift text-center">
                    <i class="bi bi-clipboard-check-fill d-block mb-2 fs-4"></i>
                    <span class="small">Ver Tareas</span>
                  </RouterLink>
                </div>
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/calificaciones" class="btn btn-outline-warning w-100 p-3 hover-lift text-center">
                    <i class="bi bi-star-fill d-block mb-2 fs-4"></i>
                    <span class="small">Calificaciones</span>
                  </RouterLink>
                </div>
                <div class="col-md-3 col-sm-6">
                  <RouterLink to="/profile" class="btn btn-outline-info w-100 p-3 hover-lift text-center">
                    <i class="bi bi-person-fill d-block mb-2 fs-4"></i>
                    <span class="small">Mi Perfil</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(true)
const cursos = ref([])
const tareas = ref([])
const stats = ref({
  misCursos: 0,
  tareasPendientes: 0,
  tareasCompletadas: 0,
  mensajes: 0
})

const actividadReciente = ref([
  {
    titulo: 'Tarea entregada',
    tiempo: 'Hace 2 horas',
    icon: 'bi bi-check-circle text-success',
    bgClass: 'bg-success bg-opacity-10'
  },
  {
    titulo: 'Nuevo curso iniciado',
    tiempo: 'Hace 1 día',
    icon: 'bi bi-book text-primary',
    bgClass: 'bg-primary bg-opacity-10'
  },
  {
    titulo: 'Calificación recibida',
    tiempo: 'Hace 2 días',
    icon: 'bi bi-star text-warning',
    bgClass: 'bg-warning bg-opacity-10'
  },
  {
    titulo: 'Mensaje nuevo',
    tiempo: 'Hace 3 horas',
    icon: 'bi bi-chat-dots text-info',
    bgClass: 'bg-info bg-opacity-10'
  }
])

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.nombre[0]}${authStore.user.apellido[0]}`.toUpperCase()
})

const progresoMensual = computed(() => {
  const total = stats.value.tareasCompletadas + stats.value.tareasPendientes
  if (total === 0) return 0
  return Math.round((stats.value.tareasCompletadas / total) * 100)
})

const getRoleText = (rol) => {
  switch (rol) {
    case 'ADMIN': return 'Administrador'
    case 'DOCENTE': return 'Docente'
    case 'ESTUDIANTE': return 'Estudiante'
    default: return ''
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

const getDiasRestantes = (fechaLimite) => {
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diferencia = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
  
  if (diferencia < 0) return 'Vencida'
  if (diferencia === 0) return 'Vence hoy'
  if (diferencia === 1) return 'Vence mañana'
  return `${diferencia} días restantes`
}

const loadDashboardData = async () => {
  try {
    loading.value = true

    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 800))

    // Datos de ejemplo para demo
    cursos.value = [
      {
        id: 1,
        curso: {
          id: 1,
          titulo: 'Introducción a la Programación',
          codigo: 'PROG-101'
        },
        progreso: 75
      },
      {
        id: 2,
        curso: {
          id: 2,
          titulo: 'Base de Datos Avanzada',
          codigo: 'BD-301'
        },
        progreso: 60
      },
      {
        id: 3,
        curso: {
          id: 3,
          titulo: 'Desarrollo Web Full Stack',
          codigo: 'WEB-401'
        },
        progreso: 45
      },
      {
        id: 4,
        curso: {
          id: 4,
          titulo: 'Machine Learning',
          codigo: 'ML-501'
        },
        progreso: 30
      }
    ]

    tareas.value = [
      {
        id: 1,
        titulo: 'Ejercicio de Variables',
        fechaLimite: '2024-02-20',
        estado: 'PENDIENTE'
      },
      {
        id: 2,
        titulo: 'Proyecto Final - Base de Datos',
        fechaLimite: '2024-02-25',
        estado: 'PENDIENTE'
      },
      {
        id: 3,
        titulo: 'API RESTful con Node.js',
        fechaLimite: '2024-02-18',
        estado: 'PENDIENTE'
      },
      {
        id: 4,
        titulo: 'Portfolio Personal',
        fechaLimite: '2024-03-01',
        estado: 'PENDIENTE'
      }
    ]

    // Calcular estadísticas
    stats.value = {
      misCursos: cursos.value.length,
      tareasPendientes: tareas.value.filter(t => t.estado === 'PENDIENTE').length,
      tareasCompletadas: 12,
      mensajes: 8
    }

  } catch (error) {
    console.error('Error cargando datos del dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.progress-bar.bg-gradient-primary {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
</style>