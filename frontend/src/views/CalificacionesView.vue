<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="glass-effect p-4 animate-fade-in">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h2 mb-1">Mis Calificaciones</h1>
          <p class="text-muted">Revisa tus calificaciones y progreso académico</p>
        </div>
      </div>

      <!-- Resumen de calificaciones -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-star-fill text-warning fs-1 mb-2"></i>
              <h4 class="mb-1">{{ promedioGeneral }}</h4>
              <p class="text-muted mb-0">Promedio General</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
              <h4 class="mb-1">{{ tareasCompletadas }}</h4>
              <p class="text-muted mb-0">Tareas Completadas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-clock-fill text-info fs-1 mb-2"></i>
              <h4 class="mb-1">{{ tareasPendientes }}</h4>
              <p class="text-muted mb-0">Tareas Pendientes</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="bi bi-trophy-fill text-primary fs-1 mb-2"></i>
              <h4 class="mb-1">{{ mejorCalificacion }}</h4>
              <p class="text-muted mb-0">Mejor Calificación</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <select v-model="filtroCurso" class="form-select" @change="cargarCalificaciones">
            <option value="">Todos los cursos</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.titulo }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="filtroPeriodo" class="form-select" @change="cargarCalificaciones">
            <option value="">Todos los períodos</option>
            <option value="2024-1">2024-1</option>
            <option value="2024-2">2024-2</option>
            <option value="2023-2">2023-2</option>
          </select>
        </div>
      </div>

      <!-- Lista de calificaciones -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else-if="calificaciones.length === 0" class="text-center py-5 text-muted">
        No hay calificaciones disponibles
      </div>

      <div v-else class="row g-4">
        <div
          v-for="calificacion in calificaciones"
          :key="calificacion.id"
          class="col-md-6 col-lg-4"
        >
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title mb-1">{{ calificacion.tarea.titulo }}</h5>
                  <small class="text-muted">{{ calificacion.curso.titulo }}</small>
                </div>
                <span
                  class="badge fs-6"
                  :class="getCalificacionClass(calificacion.puntaje)"
                >
                  {{ calificacion.puntaje }}/{{ calificacion.tarea.puntajeMaximo }}
                </span>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-between text-muted small mb-1">
                  <span>Progreso</span>
                  <span>{{ Math.round((calificacion.puntaje / calificacion.tarea.puntajeMaximo) * 100) }}%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div
                    class="progress-bar"
                    :class="getCalificacionClass(calificacion.puntaje).replace('bg-', 'bg-')"
                    :style="{ width: `${(calificacion.puntaje / calificacion.tarea.puntajeMaximo) * 100}%` }"
                  ></div>
                </div>
              </div>

              <div class="d-flex justify-content-between text-muted small mb-3">
                <span><i class="bi bi-calendar me-1"></i>{{ formatDate(calificacion.fechaEntrega) }}</span>
                <span><i class="bi bi-person me-1"></i>{{ calificacion.profesor.nombre }}</span>
              </div>

              <div v-if="calificacion.comentarios" class="mb-3">
                <small class="text-muted">
                  <strong>Comentarios:</strong><br>
                  {{ calificacion.comentarios }}
                </small>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  {{ getCalificacionTexto(calificacion.puntaje) }}
                </small>
                <RouterLink
                  :to="`/tareas/${calificacion.tarea.id}`"
                  class="btn btn-outline-primary btn-sm"
                >
                  Ver Detalles
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'
// @ts-ignore
import Layout from '../components/Layout.vue'

// Tipos
interface Curso {
  id: number
  titulo: string
}

interface Calificacion {
  id: number
  puntaje: number
  fechaEntrega: string
  comentarios: string
  tarea: {
    id: number
    titulo: string
    puntajeMaximo: number
  }
  curso: {
    id: number
    titulo: string
  }
  profesor: {
    nombre: string
  }
}

// Estado reactivo
const loading = ref(true)
const calificaciones = ref<Calificacion[]>([])
const cursos = ref<Curso[]>([])
const filtroCurso = ref('')
const filtroPeriodo = ref('')

// Función para cargar cursos
const cargarCursos = async () => {
  try {
    // Datos de ejemplo para cursos
    cursos.value = [
      { id: 1, titulo: 'Introducción a la Programación' },
      { id: 2, titulo: 'Base de Datos' },
      { id: 3, titulo: 'Desarrollo Web' },
      { id: 4, titulo: 'Algoritmos y Estructuras de Datos' },
      { id: 5, titulo: 'Machine Learning' },
      { id: 6, titulo: 'Desarrollo Móvil' }
    ]
  } catch (error) {
    console.error('Error cargando cursos:', error)
  }
}

const promedioGeneral = computed(() => {
  if (calificaciones.value.length === 0) return '0.0'
  const suma = calificaciones.value.reduce((acc, cal) => acc + cal.puntaje, 0)
  const total = calificaciones.value.reduce((acc, cal) => acc + cal.tarea.puntajeMaximo, 0)
  return (suma / total * 100).toFixed(1)
})

const tareasCompletadas = computed(() => {
  return calificaciones.value.length
})

const tareasPendientes = computed(() => {
  return 2 // Simulado
})

const mejorCalificacion = computed(() => {
  if (calificaciones.value.length === 0) return '0'
  const max = Math.max(...calificaciones.value.map(cal => cal.puntaje))
  return max.toString()
})

const getCalificacionClass = (puntaje: number) => {
  if (puntaje >= 90) return 'bg-success'
  if (puntaje >= 80) return 'bg-info'
  if (puntaje >= 70) return 'bg-warning'
  return 'bg-danger'
}

const getCalificacionTexto = (puntaje: number) => {
  if (puntaje >= 90) return 'Excelente'
  if (puntaje >= 80) return 'Bueno'
  if (puntaje >= 70) return 'Satisfactorio'
  return 'Necesita mejorar'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const cargarCalificaciones = async () => {
  loading.value = true
  
  try {
    // Intentar cargar desde la API real
    const response = await api.get('/calificaciones/mis-calificaciones')
    let calificacionesData = response.data || []
    
    // Si no hay calificaciones desde la API, usar datos demo para estudiantes
    if (calificacionesData.length === 0) {
      calificacionesData = [
          {
            id: 1,
            puntaje: 92,
            fechaEntrega: '2024-01-18',
            comentarios: 'Excelente trabajo. Muy bien estructurado y completo.',
            tarea: {
              id: 1,
              titulo: 'Ejercicio de Variables y Tipos de Datos',
              puntajeMaximo: 100
            },
            curso: {
              id: 1,
              titulo: 'Introducción a la Programación'
            },
            profesor: {
              nombre: 'Juan Pérez'
            }
          },
          {
            id: 3,
            puntaje: 85,
            fechaEntrega: '2024-01-17',
            comentarios: 'Buen trabajo. Cumple con los requisitos básicos.',
            tarea: {
              id: 1,
              titulo: 'Ejercicio de Variables y Tipos de Datos',
              puntajeMaximo: 100
            },
            curso: {
              id: 1,
              titulo: 'Introducción a la Programación'
            },
            profesor: {
              nombre: 'Juan Pérez'
            }
          },
          {
            id: 4,
            puntaje: 135,
            fechaEntrega: '2024-03-08',
            comentarios: 'Diseño de base de datos completado correctamente.',
            tarea: {
              id: 3,
              titulo: 'Diseño de Base de Datos',
              puntajeMaximo: 150
            },
            curso: {
              id: 2,
              titulo: 'Base de Datos'
            },
            profesor: {
              nombre: 'María García'
            }
          }
      ]
    }
    
    // Aplicar filtros
    let calificacionesFiltradas = calificacionesData
    
    if (filtroCurso.value) {
      calificacionesFiltradas = calificacionesFiltradas.filter(cal => 
        cal.curso && cal.curso.id === parseInt(filtroCurso.value)
      )
    }
    
    calificaciones.value = calificacionesFiltradas
  } catch (apiError) {
    // Si falla la API, usar datos demo directamente
    console.warn('Usando datos demo para calificaciones:', apiError)    
    const calificacionesDemo = [
      {
        id: 1,
        puntaje: 92,
        fechaEntrega: '2024-01-18',
        comentarios: 'Excelente trabajo. Muy bien estructurado y completo.',
        tarea: {
          id: 1,
          titulo: 'Ejercicio de Variables y Tipos de Datos',
          puntajeMaximo: 100
        },
        curso: {
          id: 1,
          titulo: 'Introducción a la Programación'
        },
        profesor: {
          nombre: 'Juan Pérez'
        }
      },
      {
        id: 4,
        puntaje: 135,
        fechaEntrega: '2024-03-08',
        comentarios: 'Diseño de base de datos completado correctamente.',
        tarea: {
          id: 3,
          titulo: 'Diseño de Base de Datos',
          puntajeMaximo: 150
        },
        curso: {
          id: 2,
          titulo: 'Base de Datos'
        },
        profesor: {
          nombre: 'María García'
        }
      }
    ]
    
    let calificacionesFiltradas = calificacionesDemo
    
    if (filtroCurso.value) {
      calificacionesFiltradas = calificacionesFiltradas.filter(cal => 
        cal.curso.id === parseInt(filtroCurso.value)
      )
    }
    
    calificaciones.value = calificacionesFiltradas
  } finally {
    loading.value = false
  }
}

// Inicializar datos al montar el componente
onMounted(() => {
  Promise.all([
    cargarCalificaciones(),
    cargarCursos()
  ])
})
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
}
</style>