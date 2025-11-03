<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <h1 class="h2 mb-2 text-gradient">
              <i class="bi bi-graph-up-arrow me-2"></i>Mis Calificaciones
            </h1>
            <p class="text-muted mb-0 fs-5">Revisa tu rendimiento académico en todos tus cursos</p>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in">
            <i class="bi bi-award-fill text-primary fs-3 mb-2"></i>
            <h4 class="mb-0">{{ stats.promedioGeneral }}</h4>
            <small class="text-muted">Promedio General</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in" style="animation-delay: 0.1s;">
            <i class="bi bi-check-circle-fill text-success fs-3 mb-2"></i>
            <h4 class="mb-0">{{ stats.cursosAprobados }}</h4>
            <small class="text-muted">Cursos Aprobados</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in" style="animation-delay: 0.2s;">
            <i class="bi bi-book-fill text-info fs-3 mb-2"></i>
            <h4 class="mb-0">{{ stats.cursosActivos }}</h4>
            <small class="text-muted">Cursos Activos</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in" style="animation-delay: 0.3s;">
            <i class="bi bi-list-task text-warning fs-3 mb-2"></i>
            <h4 class="mb-0">{{ stats.totalTareas }}</h4>
            <small class="text-muted">Total Tareas</small>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-search me-1"></i>Buscar curso
            </label>
            <input 
              v-model="searchQuery"
              type="text" 
              class="form-control border-0 bg-transparent" 
              placeholder="Buscar por nombre...">
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.1s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-funnel me-1"></i>Estado
            </label>
            <select v-model="filterEstado" class="form-select border-0 bg-transparent">
              <option value="todos">Todos los estados</option>
              <option value="aprobado">Aprobados</option>
              <option value="reprobado">Reprobados</option>
              <option value="en_progreso">En progreso</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.2s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-sort-down me-1"></i>Ordenar por
            </label>
            <select v-model="sortBy" class="form-select border-0 bg-transparent">
              <option value="nombre">Nombre del curso</option>
              <option value="calificacion">Calificación</option>
              <option value="fecha">Fecha</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Calificaciones List -->
      <div class="row g-4">
        <div v-for="calif in calificacionesFiltradas" :key="calif.id" class="col-12">
          <div class="card glass-effect border-0 hover-lift animate-fade-in">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <!-- Curso Info -->
                <div class="col-md-8">
                  <h5 class="card-title mb-2">
                    <i class="bi bi-book me-2"></i>{{ calif.curso }}
                  </h5>
                  <p class="text-muted mb-2">{{ calif.descripcion }}</p>
                  <div class="d-flex gap-2 flex-wrap mb-3">
                    <span class="badge bg-primary">{{ calif.categoria }}</span>
                    <span :class="getEstadoBadgeClass(calif.estado)">
                      {{ calif.estado }}
                    </span>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="mb-2">
                    <div class="d-flex justify-content-between text-sm mb-1">
                      <small class="text-muted">Progreso del curso</small>
                      <small class="fw-bold">{{ calif.progreso }}%</small>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div 
                        :class="getProgressClass(calif.progreso)"
                        class="progress-bar" 
                        role="progressbar" 
                        :style="{width: calif.progreso + '%'}">
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Calificación -->
                <div class="col-md-4 text-center">
                  <div :class="getCalificacionClass(calif.calificacion_final)" class="p-4 rounded-3">
                    <p class="text-muted mb-1">Calificación</p>
                    <h2 class="display-4 mb-0">{{ calif.calificacion_final }}</h2>
                  </div>
                </div>
              </div>

              <!-- Tareas Details (Collapsible) -->
              <div class="mt-3">
                <button 
                  class="btn btn-link text-decoration-none w-100 text-start p-0"
                  @click="toggleDetalles(calif.id)">
                  <div class="d-flex justify-content-between align-items-center">
                    <span>
                      <i class="bi bi-list-check me-2"></i>
                      Ver detalles de tareas ({{ calif.tareas.length }})
                    </span>
                    <i :class="mostrarDetalles[calif.id] ? 'bi-chevron-up' : 'bi-chevron-down'" class="bi"></i>
                  </div>
                </button>

                <div v-if="mostrarDetalles[calif.id]" class="mt-3">
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Tarea</th>
                          <th>Fecha Entrega</th>
                          <th>Estado</th>
                          <th class="text-center">Calificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="tarea in calif.tareas" :key="tarea.id">
                          <td>{{ tarea.titulo }}</td>
                          <td>
                            <i class="bi bi-calendar3 me-1"></i>
                            {{ formatDate(tarea.fecha_entrega) }}
                          </td>
                          <td>
                            <span :class="getEstadoTareaClass(tarea.estado)" class="badge">
                              {{ tarea.estado }}
                            </span>
                          </td>
                          <td class="text-center">
                            <span :class="getTareaCalificacionClass(tarea.calificacion)" class="badge">
                              {{ tarea.calificacion !== null ? tarea.calificacion : '-' }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-3 d-flex gap-2">
                <button @click="verCurso(calif.curso_id)" class="btn btn-primary btn-sm">
                  <i class="bi bi-eye me-1"></i>Ver Curso
                </button>
                <button v-if="calif.certificado_disponible" class="btn btn-success btn-sm">
                  <i class="bi bi-award me-1"></i>Obtener Certificado
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="calificacionesFiltradas.length === 0" class="col-12">
          <div class="glass-effect p-5 text-center animate-fade-in">
            <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
            <h5 class="text-muted">No se encontraron calificaciones</h5>
            <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '../components/Layout.vue'
import { api } from '../services/api'
import { authStore } from '../stores/auth'

const router = useRouter()

// State
const loading = ref(false)
const error = ref(null)
const calificaciones = ref([
  {
    id: 1,
    curso_id: 1,
    curso: 'Desarrollo Web Full Stack',
    descripcion: 'Aprende a crear aplicaciones web modernas con Vue.js y Node.js',
    categoria: 'Desarrollo Web',
    calificacion_final: 92,
    progreso: 85,
    estado: 'En progreso',
    certificado_disponible: false,
    tareas: [
      { id: 1, titulo: 'HTML y CSS Básico', calificacion: 95, estado: 'Entregada', fecha_entrega: '2024-10-15' },
      { id: 2, titulo: 'JavaScript Fundamentos', calificacion: 88, estado: 'Entregada', fecha_entrega: '2024-10-22' },
      { id: 3, titulo: 'Vue.js Componentes', calificacion: 93, estado: 'Entregada', fecha_entrega: '2024-10-29' },
      { id: 4, titulo: 'Proyecto Final Frontend', calificacion: null, estado: 'Pendiente', fecha_entrega: '2024-11-15' }
    ]
  },
  {
    id: 2,
    curso_id: 2,
    curso: 'Python para Data Science',
    descripcion: 'Análisis de datos con Python, Pandas y Matplotlib',
    categoria: 'Ciencia de Datos',
    calificacion_final: 88,
    progreso: 100,
    estado: 'Aprobado',
    certificado_disponible: true,
    tareas: [
      { id: 5, titulo: 'Pandas Básico', calificacion: 90, estado: 'Entregada', fecha_entrega: '2024-09-10' },
      { id: 6, titulo: 'Visualización de Datos', calificacion: 85, estado: 'Entregada', fecha_entrega: '2024-09-20' },
      { id: 7, titulo: 'Machine Learning Intro', calificacion: 89, estado: 'Entregada', fecha_entrega: '2024-09-30' }
    ]
  },
  {
    id: 3,
    curso_id: 3,
    curso: 'Diseño UI/UX Avanzado',
    descripcion: 'Principios de diseño de interfaces y experiencia de usuario',
    categoria: 'Diseño',
    calificacion_final: 95,
    progreso: 100,
    estado: 'Aprobado',
    certificado_disponible: true,
    tareas: [
      { id: 8, titulo: 'Fundamentos de UI', calificacion: 92, estado: 'Entregada', fecha_entrega: '2024-08-15' },
      { id: 9, titulo: 'Prototipado en Figma', calificacion: 98, estado: 'Entregada', fecha_entrega: '2024-08-25' },
      { id: 10, titulo: 'Proyecto Final UI/UX', calificacion: 95, estado: 'Entregada', fecha_entrega: '2024-09-05' }
    ]
  },
  {
    id: 4,
    curso_id: 4,
    curso: 'Bases de Datos SQL',
    descripcion: 'Diseño y optimización de bases de datos relacionales',
    categoria: 'Backend',
    calificacion_final: 78,
    progreso: 70,
    estado: 'En progreso',
    certificado_disponible: false,
    tareas: [
      { id: 11, titulo: 'Consultas SQL Básicas', calificacion: 80, estado: 'Entregada', fecha_entrega: '2024-10-05' },
      { id: 12, titulo: 'Normalización de BD', calificacion: 75, estado: 'Entregada', fecha_entrega: '2024-10-18' },
      { id: 13, titulo: 'Optimización de Queries', calificacion: null, estado: 'Pendiente', fecha_entrega: '2024-11-10' }
    ]
  }
])
const mostrarDetalles = ref({})

// Filters
const searchQuery = ref('')
const filterEstado = ref('todos')
const sortBy = ref('nombre')

// Computed Stats
const stats = computed(() => {
  const total = calificaciones.value?.length || 0
  const aprobados = calificaciones.value?.filter(c => c.estado === 'Aprobado').length || 0
  const activos = calificaciones.value?.filter(c => c.estado === 'En progreso').length || 0
  const totalTareas = calificaciones.value?.reduce((sum, c) => sum + (c.tareas?.length || 0), 0) || 0
  
  const promedioTotal = calificaciones.value?.reduce((sum, c) => sum + (c.calificacion_final || 0), 0) || 0
  const promedio = total > 0 ? (promedioTotal / total).toFixed(1) : '0.0'
  
  return {
    promedioGeneral: promedio,
    cursosAprobados: aprobados,
    cursosActivos: activos,
    totalTareas
  }
})

// Computed Filtered
const calificacionesFiltradas = computed(() => {
  if (!calificaciones.value || calificaciones.value.length === 0) {
    return []
  }
  
  let resultado = [...calificaciones.value]
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    resultado = resultado.filter(c => 
      c.curso?.toLowerCase().includes(query) ||
      c.descripcion?.toLowerCase().includes(query) ||
      c.categoria?.toLowerCase().includes(query)
    )
  }
  
  // Filtrar por estado
  if (filterEstado.value !== 'todos') {
    resultado = resultado.filter(c => {
      if (filterEstado.value === 'aprobado') return c.estado === 'Aprobado'
      if (filterEstado.value === 'reprobado') return c.estado === 'Reprobado'
      if (filterEstado.value === 'en_progreso') return c.estado === 'En progreso'
      return true
    })
  }
  
  // Ordenar
  resultado.sort((a, b) => {
    if (sortBy.value === 'nombre') return (a.curso || '').localeCompare(b.curso || '')
    if (sortBy.value === 'calificacion') return (b.calificacion_final || 0) - (a.calificacion_final || 0)
    if (sortBy.value === 'fecha') return new Date(b.fecha_actualizacion || 0) - new Date(a.fecha_actualizacion || 0)
    return 0
  })
  
  return resultado
})

// Methods
const toggleDetalles = (id) => {
  mostrarDetalles.value[id] = !mostrarDetalles.value[id]
}

const verCurso = (cursoId) => {
  router.push(`/cursos/${cursoId}`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCalificacionClass = (calificacion) => {
  if (calificacion >= 90) return 'bg-success bg-opacity-10 text-success'
  if (calificacion >= 80) return 'bg-info bg-opacity-10 text-info'
  if (calificacion >= 70) return 'bg-warning bg-opacity-10 text-warning'
  return 'bg-danger bg-opacity-10 text-danger'
}

const getTareaCalificacionClass = (calificacion) => {
  if (calificacion === null) return 'bg-secondary'
  if (calificacion >= 90) return 'bg-success'
  if (calificacion >= 80) return 'bg-info'
  if (calificacion >= 70) return 'bg-warning'
  return 'bg-danger'
}

const getProgressClass = (progreso) => {
  if (progreso >= 90) return 'bg-success'
  if (progreso >= 70) return 'bg-info'
  if (progreso >= 50) return 'bg-warning'
  return 'bg-danger'
}

const getEstadoBadgeClass = (estado) => {
  if (estado === 'Aprobado') return 'badge bg-success'
  if (estado === 'En progreso') return 'badge bg-info'
  if (estado === 'Reprobado') return 'badge bg-danger'
  return 'badge bg-secondary'
}

const getEstadoTareaClass = (estado) => {
  if (estado === 'Entregada') return 'bg-success'
  if (estado === 'Pendiente') return 'bg-warning'
  if (estado === 'Atrasada') return 'bg-danger'
  return 'bg-secondary'
}

const fetchCalificaciones = async () => {
  // Si no hay usuario autenticado, usar solo datos demo
  if (!authStore.user || !authStore.user.id) {
    console.log('Usando datos demo (sin usuario autenticado)')
    return
  }
  
  // Si estamos en modo DEMO (token es "demo-token-..."), no llamar al backend
  if (authStore.token && authStore.token.startsWith('demo-token')) {
    console.log('Usando datos demo (modo DEMO activo)')
    return
  }
  
  // Intentar cargar desde backend real si hay usuario y token válido
  try {
    const response = await api.get(`/calificaciones/estudiante/${authStore.user.id}`)
    calificaciones.value = response.data
    console.log('Calificaciones cargadas desde backend')
  } catch (err) {
    console.log('Usando datos demo (backend no disponible o error de permisos)')
    // Los datos demo ya están inicializados
  }
}

onMounted(() => {
  fetchCalificaciones()
})
</script>