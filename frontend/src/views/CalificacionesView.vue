<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">📊 Mis Calificaciones</h1>
        <p class="text-gray-600">Revisa tu rendimiento académico en todos tus cursos</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm mb-1">Promedio General</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.promedioGeneral }}</p>
              </div>
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm mb-1">Cursos Aprobados</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.cursosAprobados }}</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm mb-1">Cursos Activos</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.cursosActivos }}</p>
              </div>
              <div class="bg-yellow-100 rounded-full p-3">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-500 text-sm mb-1">Total Tareas</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalTareas }}</p>
              </div>
              <div class="bg-purple-100 rounded-full p-3">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-[200px]">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar curso..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
            </div>
            <select
              v-model="filterEstado"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="aprobado">Aprobados</option>
              <option value="reprobado">Reprobados</option>
              <option value="en_progreso">En progreso</option>
            </select>
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="nombre">Ordenar por nombre</option>
              <option value="calificacion">Ordenar por calificación</option>
              <option value="fecha">Ordenar por fecha</option>
            </select>
          </div>
        </div>

        <!-- Calificaciones List -->
        <div class="space-y-6">
          <div
            v-for="calificacion in calificacionesFiltradas"
            :key="calificacion.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div class="p-6">
              <!-- Course Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ calificacion.curso }}</h3>
                  <p class="text-gray-600 mb-2">{{ calificacion.descripcion }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                      {{ calificacion.categoria }}
                    </span>
                    <span :class="getEstadoBadge(calificacion.estado)">
                      {{ calificacion.estado }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div :class="getCalificacionColor(calificacion.calificacion_final)" 
                       class="text-center p-4 rounded-xl min-w-[100px]">
                    <p class="text-sm font-medium mb-1">Calificación</p>
                    <p class="text-3xl font-bold">{{ calificacion.calificacion_final }}</p>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso del curso</span>
                  <span>{{ calificacion.progreso }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="getProgressColor(calificacion.progreso)"
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${calificacion.progreso}%` }"
                  ></div>
                </div>
              </div>

              <!-- Detalles de Tareas -->
              <div class="border-t pt-4">
                <button
                  @click="toggleDetalles(calificacion.id)"
                  class="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ver detalles de tareas ({{ calificacion.tareas.length }})
                  </span>
                  <svg 
                    :class="{ 'rotate-180': mostrarDetalles[calificacion.id] }"
                    class="w-5 h-5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Tareas Detail -->
                <div v-if="mostrarDetalles[calificacion.id]" class="mt-4 space-y-3">
                  <div
                    v-for="tarea in calificacion.tareas"
                    :key="tarea.id"
                    class="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 mb-1">{{ tarea.titulo }}</h4>
                      <div class="flex items-center gap-4 text-sm text-gray-600">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ new Date(tarea.fecha_entrega).toLocaleDateString() }}
                        </span>
                        <span :class="getEstadoTareaBadge(tarea.estado)">
                          {{ tarea.estado }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div :class="getTareaCalificacionColor(tarea.calificacion)" 
                           class="text-center px-4 py-2 rounded-lg min-w-[80px]">
                        <p class="text-xl font-bold">
                          {{ tarea.calificacion !== null ? tarea.calificacion : '-' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Course Actions -->
              <div class="flex gap-3 mt-4 pt-4 border-t">
                <button
                  @click="verCurso(calificacion.curso_id)"
                  class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver Curso
                </button>
                <button
                  v-if="calificacion.certificado_disponible"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Obtener Certificado
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="calificacionesFiltradas.length === 0" 
               class="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron calificaciones</h3>
            <p class="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { authStore } from '../stores/auth'

const router = useRouter()

// State
const loading = ref(true)
const error = ref(null)
const calificaciones = ref([])
const mostrarDetalles = ref({})

// Filters
const searchQuery = ref('')
const filterEstado = ref('todos')
const sortBy = ref('nombre')

// Computed Stats
const stats = computed(() => {
  const total = calificaciones.value.length
  const aprobados = calificaciones.value.filter(c => c.estado === 'Aprobado').length
  const activos = calificaciones.value.filter(c => c.estado === 'En progreso').length
  const totalTareas = calificaciones.value.reduce((sum, c) => sum + c.tareas.length, 0)
  
  const promedioTotal = calificaciones.value.reduce((sum, c) => sum + c.calificacion_final, 0)
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
  let resultado = [...calificaciones.value]
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    resultado = resultado.filter(c => 
      c.curso.toLowerCase().includes(query) ||
      c.descripcion.toLowerCase().includes(query) ||
      c.categoria.toLowerCase().includes(query)
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
    if (sortBy.value === 'nombre') return a.curso.localeCompare(b.curso)
    if (sortBy.value === 'calificacion') return b.calificacion_final - a.calificacion_final
    if (sortBy.value === 'fecha') return new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion)
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

const getCalificacionColor = (calificacion) => {
  if (calificacion >= 90) return 'bg-green-100 text-green-800'
  if (calificacion >= 80) return 'bg-blue-100 text-blue-800'
  if (calificacion >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getTareaCalificacionColor = (calificacion) => {
  if (calificacion === null) return 'bg-gray-100 text-gray-600'
  if (calificacion >= 90) return 'bg-green-100 text-green-800'
  if (calificacion >= 80) return 'bg-blue-100 text-blue-800'
  if (calificacion >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getProgressColor = (progreso) => {
  if (progreso >= 90) return 'bg-green-500'
  if (progreso >= 70) return 'bg-blue-500'
  if (progreso >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getEstadoBadge = (estado) => {
  if (estado === 'Aprobado') return 'px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'
  if (estado === 'En progreso') return 'px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'
  if (estado === 'Reprobado') return 'px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full'
  return 'px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full'
}

const getEstadoTareaBadge = (estado) => {
  if (estado === 'Entregada') return 'px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'
  if (estado === 'Pendiente') return 'px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'
  if (estado === 'Atrasada') return 'px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'
  return 'px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full'
}

const fetchCalificaciones = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get(`/calificaciones/estudiante/${authStore.user.id}`)
    calificaciones.value = response.data
  } catch (err) {
    console.error('Error al cargar calificaciones:', err)
    error.value = 'Error al cargar las calificaciones. Por favor, intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCalificaciones()
})
</script>