<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header específico por rol -->
      <div class="row mb-4">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="h2 mb-2">
                  <i :class="getHeaderIcon() + ' me-2'"></i>
                  {{ getHeaderTitle() }}
                </h1>
                <p class="text-muted mb-0">{{ getHeaderSubtitle() }}</p>
              </div>
              <div v-if="authStore.isDocente" class="d-flex gap-2">
                <router-link to="/tareas/crear" class="btn btn-gradient">
                  <i class="bi bi-plus-circle me-2"></i>Nueva Tarea
                </router-link>
                <router-link to="/entregas" class="btn btn-outline-primary">
                  <i class="bi bi-file-earmark-check me-2"></i>Ver Entregas
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard para Docentes -->
      <div v-if="authStore.isDocente">
        <!-- Estadísticas del docente -->
        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in">
              <div class="card-body text-center">
                <i class="bi bi-book-fill text-primary fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.cursosActivos }}</h4>
                <p class="text-muted mb-0">Cursos Activos</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
              <div class="card-body text-center">
                <i class="bi bi-people-fill text-success fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.totalEstudiantes }}</h4>
                <p class="text-muted mb-0">Estudiantes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
              <div class="card-body text-center">
                <i class="bi bi-clipboard-check text-warning fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.tareasPendientes }}</h4>
                <p class="text-muted mb-0">Tareas Activas</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
              <div class="card-body text-center">
                <i class="bi bi-file-earmark-check text-danger fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.entregasSinCalificar }}</h4>
                <p class="text-muted mb-0">Sin Calificar</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Entregas pendientes de calificar -->
        <div v-if="entregasPendientes.length > 0" class="row mb-4">
          <div class="col-12">
            <div class="card-hover animate-fade-in">
              <div class="card-header border-0 bg-transparent">
                <h5 class="mb-0">
                  <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                  Entregas Pendientes de Calificar
                </h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Tarea</th>
                        <th>Curso</th>
                        <th>Fecha Entrega</th>
                        <th>Puntaje Máx</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="entrega in entregasPendientes" :key="entrega.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center" 
                                 style="width: 32px; height: 32px; font-size: 12px;">
                              {{ getInitials(entrega.estudiante) }}
                            </div>
                            <span>{{ entrega.estudiante.nombre }} {{ entrega.estudiante.apellido }}</span>
                          </div>
                        </td>
                        <td>{{ entrega.tarea.titulo }}</td>
                        <td><span class="badge bg-primary">{{ entrega.curso.codigo }}</span></td>
                        <td>{{ formatDate(entrega.createdAt) }}</td>
                        <td><strong>{{ entrega.tarea.puntaje }}</strong> pts</td>
                        <td>
                          <button @click="abrirModalCalificacion(entrega)" class="btn btn-sm btn-gradient">
                            <i class="bi bi-pencil-square me-1"></i>Calificar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mis cursos -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card-hover animate-fade-in">
              <div class="card-header border-0 bg-transparent d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-book-fill me-2"></i>Mis Cursos
                </h5>
                <router-link to="/cursos" class="btn btn-sm btn-outline-primary">
                  Ver Todos
                </router-link>
              </div>
              <div class="card-body">
                <div v-if="cursosDocente.length === 0" class="text-center py-5">
                  <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
                  <p class="text-muted">No tienes cursos asignados</p>
                </div>
                <div v-else class="row g-3">
                  <div v-for="curso in cursosDocente" :key="curso.id" class="col-md-6">
                    <div class="glass-effect p-3 rounded-3 hover-lift cursor-pointer" @click="$router.push(`/cursos/${curso.id}`)">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 class="mb-1 fw-bold">{{ curso.titulo }}</h6>
                          <small class="text-muted">{{ curso.codigo }}</small>
                        </div>
                        <span class="badge" :class="curso.activo ? 'bg-success' : 'bg-secondary'">
                          {{ curso.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                      <p class="text-muted small mb-2">{{ curso.descripcion }}</p>
                      <div class="d-flex gap-3 text-muted small">
                        <span><i class="bi bi-people-fill me-1"></i>{{ curso.totalEstudiantes }} estudiantes</span>
                        <span><i class="bi bi-collection-play-fill me-1"></i>{{ curso.totalClases }} clases</span>
                        <span><i class="bi bi-clipboard-check me-1"></i>{{ curso.totalTareas }} tareas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard para Estudiantes (tu código existente) -->
      <div v-else-if="authStore.isEstudiante">
        <!-- Aquí va el dashboard de estudiantes existente -->
        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card-hover h-100">
              <div class="card-body text-center">
                <i class="bi bi-book-fill text-primary fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.cursosInscritos }}</h4>
                <p class="text-muted mb-0">Cursos Inscritos</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100">
              <div class="card-body text-center">
                <i class="bi bi-clipboard-check text-success fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.tareasCompletadas }}</h4>
                <p class="text-muted mb-0">Tareas Completadas</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100">
              <div class="card-body text-center">
                <i class="bi bi-clock-fill text-warning fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.tareasPendientes }}</h4>
                <p class="text-muted mb-0">Tareas Pendientes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100">
              <div class="card-body text-center">
                <i class="bi bi-star-fill text-danger fs-1 mb-2"></i>
                <h4 class="mb-1">{{ estadisticas.promedioGeneral }}</h4>
                <p class="text-muted mb-0">Promedio General</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Calificación -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content glass-effect">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i>Calificar Entrega
            </h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="entregaSeleccionada" class="mb-3">
              <p class="mb-2"><strong>Estudiante:</strong> {{ entregaSeleccionada.estudiante.nombre }} {{ entregaSeleccionada.estudiante.apellido }}</p>
              <p class="mb-2"><strong>Tarea:</strong> {{ entregaSeleccionada.tarea.titulo }}</p>
              <p class="mb-2"><strong>Comentario del estudiante:</strong></p>
              <p class="glass-effect p-2 rounded">{{ entregaSeleccionada.comentario || 'Sin comentarios' }}</p>
              
              <div class="mb-3">
                <label class="form-label fw-semibold">Calificación</label>
                <input 
                  v-model.number="calificacionForm.puntaje" 
                  type="number" 
                  class="form-control" 
                  :max="entregaSeleccionada.tarea.puntaje"
                  :placeholder="`Máximo: ${entregaSeleccionada.tarea.puntaje}`">
                <small class="text-muted">Puntaje máximo: {{ entregaSeleccionada.tarea.puntaje }}</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Retroalimentación (Opcional)</label>
                <textarea 
                  v-model="calificacionForm.retroalimentacion" 
                  class="form-control" 
                  rows="3"
                  placeholder="Escribe comentarios sobre la entrega..."></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" @click="cerrarModal">Cancelar</button>
            <button type="button" class="btn btn-gradient" @click="guardarCalificacion" :disabled="!calificacionForm.puntaje">
              <i class="bi bi-check-circle me-2"></i>Guardar Calificación
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import { api } from '../services/api'
import Layout from '../components/Layout.vue'

const router = useRouter()
const estadisticas = ref({
  cursosActivos: 0,
  totalEstudiantes: 0,
  tareasPendientes: 0,
  entregasSinCalificar: 0,
  cursosInscritos: 0,
  tareasCompletadas: 0,
  promedioGeneral: 0
})

const cursosDocente = ref([])
const entregasPendientes = ref([])
const mostrarModal = ref(false)
const entregaSeleccionada = ref(null)
const calificacionForm = ref({
  puntaje: null,
  retroalimentacion: ''
})

const getHeaderTitle = () => {
  if (authStore.isDocente) return 'Dashboard del Docente'
  if (authStore.isEstudiante) return 'Mi Dashboard'
  return 'Dashboard'
}

const getHeaderSubtitle = () => {
  if (authStore.isDocente) return 'Gestiona tus cursos y califica entregas'
  if (authStore.isEstudiante) return 'Resumen de tu progreso académico'
  return 'Bienvenido al sistema'
}

const getHeaderIcon = () => {
  if (authStore.isDocente) return 'bi bi-mortarboard-fill'
  if (authStore.isEstudiante) return 'bi bi-house-fill'
  return 'bi bi-grid-fill'
}

const getInitials = (usuario) => {
  return `${usuario.nombre[0]}${usuario.apellido[0]}`.toUpperCase()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarDatosDocente = async () => {
  try {
    // Datos demo para docente
    const docenteId = authStore.user.id

    // Cargar cursos del docente
    cursosDocente.value = [
      {
        id: 1,
        titulo: 'Introducción a la Programación',
        codigo: 'PROG-101',
        descripcion: 'Curso básico de programación',
        activo: true,
        totalEstudiantes: 45,
        totalClases: 12,
        totalTareas: 8
      },
      {
        id: 2,
        titulo: 'Base de Datos',
        codigo: 'BD-201',
        descripcion: 'Diseño de bases de datos',
        activo: true,
        totalEstudiantes: 32,
        totalClases: 10,
        totalTareas: 6
      },
      {
        id: 3,
        titulo: 'Desarrollo Web',
        codigo: 'WEB-301',
        descripcion: 'Aplicaciones web modernas',
        activo: false,
        totalEstudiantes: 28,
        totalClases: 15,
        totalTareas: 10
      }
    ]

    // Cargar entregas pendientes
    entregasPendientes.value = [
      {
        id: 2,
        comentario: 'Entrega del proyecto final',
        createdAt: '2024-02-10',
        estudiante: {
          nombre: 'María',
          apellido: 'García'
        },
        tarea: {
          id: 2,
          titulo: 'Proyecto Final - Sistema de Gestión',
          puntaje: 200
        },
        curso: {
          codigo: 'PROG-101'
        }
      },
      {
        id: 5,
        comentario: 'Consultas SQL realizadas',
        createdAt: '2024-03-20',
        estudiante: {
          nombre: 'Carlos',
          apellido: 'López'
        },
        tarea: {
          id: 4,
          titulo: 'Consultas SQL Avanzadas',
          puntaje: 120
        },
        curso: {
          codigo: 'BD-201'
        }
      },
      {
        id: 6,
        comentario: 'Ejercicio de variables completado',
        createdAt: '2024-01-21',
        estudiante: {
          nombre: 'Ana',
          apellido: 'Martínez'
        },
        tarea: {
          id: 1,
          titulo: 'Ejercicio de Variables',
          puntaje: 100
        },
        curso: {
          codigo: 'PROG-101'
        }
      }
    ]

    // Calcular estadísticas
    estadisticas.value = {
      cursosActivos: cursosDocente.value.filter(c => c.activo).length,
      totalEstudiantes: cursosDocente.value.reduce((sum, c) => sum + c.totalEstudiantes, 0),
      tareasPendientes: cursosDocente.value.reduce((sum, c) => sum + c.totalTareas, 0),
      entregasSinCalificar: entregasPendientes.value.length
    }
  } catch (error) {
    console.error('Error cargando datos del docente:', error)
  }
}

const cargarDatosEstudiante = async () => {
  estadisticas.value = {
    cursosInscritos: 3,
    tareasCompletadas: 5,
    tareasPendientes: 2,
    promedioGeneral: 88.5
  }
}

const abrirModalCalificacion = (entrega) => {
  entregaSeleccionada.value = entrega
  calificacionForm.value = {
    puntaje: null,
    retroalimentacion: ''
  }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  entregaSeleccionada.value = null
  calificacionForm.value = {
    puntaje: null,
    retroalimentacion: ''
  }
}

const guardarCalificacion = async () => {
  try {
    if (!calificacionForm.value.puntaje) {
      alert('Debes ingresar una calificación')
      return
    }

    if (calificacionForm.value.puntaje > entregaSeleccionada.value.tarea.puntaje) {
      alert(`La calificación no puede ser mayor a ${entregaSeleccionada.value.tarea.puntaje}`)
      return
    }

    // Aquí iría la llamada a la API
    console.log('Calificando entrega:', {
      entregaId: entregaSeleccionada.value.id,
      puntaje: calificacionForm.value.puntaje,
      retroalimentacion: calificacionForm.value.retroalimentacion
    })

    // Remover de la lista de pendientes
    entregasPendientes.value = entregasPendientes.value.filter(
      e => e.id !== entregaSeleccionada.value.id
    )

    // Actualizar estadísticas
    estadisticas.value.entregasSinCalificar--

    alert('Calificación guardada exitosamente')
    cerrarModal()
  } catch (error) {
    console.error('Error guardando calificación:', error)
    alert('Error al guardar la calificación')
  }
}

onMounted(() => {
  if (authStore.isDocente) {
    cargarDatosDocente()
  } else if (authStore.isEstudiante) {
    cargarDatosEstudiante()
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.modal.show {
  display: block;
}
</style>