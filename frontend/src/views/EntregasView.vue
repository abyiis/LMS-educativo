<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  <i class="bi bi-file-earmark-check-fill me-2"></i>Gestión de Entregas
                </h1>
                <p class="text-muted mb-0 fs-5">Revisa y califica las entregas de tus estudiantes</p>
              </div>
              <button
                @click="cargarEntregas"
                class="btn btn-outline-primary"
                :disabled="loading"
                title="Actualizar entregas"
              >
                <i class="bi bi-arrow-clockwise me-2" :class="{ 'spin': loading }"></i>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="glass-effect p-4 rounded-4 card-hover animate-bounce-in">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2">Total de Entregas</h6>
                <h3 class="fw-bold mb-0 text-primary">{{ totalEntregas }}</h3>
              </div>
              <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                <i class="bi bi-file-earmark-check text-primary fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-4 rounded-4 card-hover animate-bounce-in" style="animation-delay: 0.1s;">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2">Pendientes</h6>
                <h3 class="fw-bold mb-0 text-warning">{{ entregasPendientes }}</h3>
              </div>
              <div class="rounded-circle bg-warning bg-opacity-10 p-3">
                <i class="bi bi-clock text-warning fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-4 rounded-4 card-hover animate-bounce-in" style="animation-delay: 0.2s;">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2">Calificadas</h6>
                <h3 class="fw-bold mb-0 text-success">{{ entregasCalificadas }}</h3>
              </div>
              <div class="rounded-circle bg-success bg-opacity-10 p-3">
                <i class="bi bi-check-circle text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-4 rounded-4 card-hover animate-bounce-in" style="animation-delay: 0.3s;">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-muted mb-2">Promedio</h6>
                <h3 class="fw-bold mb-0 text-info">{{ promedioCalificacion }}%</h3>
              </div>
              <div class="rounded-circle bg-info bg-opacity-10 p-3">
                <i class="bi bi-graph-up text-info fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-funnel me-1"></i>Filtrar por curso
            </label>
            <select v-model="filtroCurso" class="form-select border-0 bg-transparent" @change="aplicarFiltros">
              <option value="">Todos los cursos</option>
              <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                {{ curso.titulo }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.1s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-filter me-1"></i>Estado
            </label>
            <select v-model="filtroEstado" class="form-select border-0 bg-transparent" @change="aplicarFiltros">
              <option value="">Todas las entregas</option>
              <option value="ENTREGADA">Pendientes de calificar</option>
              <option value="CALIFICADA">Calificadas</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.2s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-search me-1"></i>Buscar estudiante
            </label>
            <input
              v-model="busqueda"
              type="text"
              class="form-control border-0 bg-transparent"
              placeholder="Nombre o email..."
              @input="aplicarFiltros"
            />
          </div>
        </div>
      </div>

      <!-- Tabla de entregas -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando entregas...</p>
      </div>

      <div v-else-if="entregasFiltradas.length === 0" class="text-center py-5">
        <div class="glass-effect p-5 animate-bounce-in">
          <div class="mb-4">
            <i class="bi bi-clipboard-x text-muted" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-muted mb-3">No hay entregas disponibles</h4>
          <p class="text-muted mb-4">Las entregas aparecerán aquí cuando los estudiantes entreguen sus tareas</p>
        </div>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Tarea</th>
                    <th>Curso</th>
                    <th>Fecha de Entrega</th>
                    <th>Comentario</th>
                    <th>Estado</th>
                    <th>Calificación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entrega in entregasFiltradas" :key="entrega.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-2"
                             style="width: 40px; height: 40px; font-weight: 600;">
                          {{ getIniciales(entrega.estudiante) }}
                        </div>
                        <div>
                          <strong class="d-block">{{ entrega.estudiante?.nombre }} {{ entrega.estudiante?.apellido }}</strong>
                          <small class="text-muted">{{ entrega.estudiante?.email }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{{ entrega.tarea?.titulo }}</strong>
                      <br>
                      <small class="text-muted">Max: {{ entrega.tarea?.puntaje }} pts</small>
                    </td>
                    <td>
                      <span class="badge bg-info bg-opacity-10 text-info">
                        {{ getCursoNombre(entrega.tarea?.cursoId) }}
                      </span>
                    </td>
                    <td>
                      <small>{{ formatDate(entrega.createdAt) }}</small>
                      <br>
                      <small class="text-muted">{{ formatTime(entrega.createdAt) }}</small>
                    </td>
                    <td>
                      <span v-if="entrega.comentario" class="text-muted small">
                        {{ truncateText(entrega.comentario, 50) }}
                      </span>
                      <span v-else class="text-muted fst-italic small">Sin comentario</span>
                    </td>
                    <td>
                      <span 
                        class="badge px-3 py-2"
                        :class="getEstadoBadgeClass(entrega.estado)"
                      >
                        <i class="bi me-1" :class="getEstadoIcon(entrega.estado)"></i>
                        {{ getEstadoText(entrega.estado) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <input
                          type="number"
                          v-model.number="calificaciones[entrega.id]"
                          :placeholder="entrega.calificacion !== null && entrega.calificacion !== undefined ? entrega.calificacion.toString() : '0'"
                          :min="0"
                          :max="entrega.tarea?.puntaje || 100"
                          class="form-control form-control-sm"
                          style="width: 80px;"
                          :disabled="calificando[entrega.id]"
                        />
                        <span class="text-muted">/ {{ entrega.tarea?.puntaje || 100 }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex gap-2">
                        <button
                          v-if="entrega.archivoUrl"
                          @click="descargarEntrega(entrega)"
                          class="btn btn-sm btn-outline-info"
                          title="Descargar archivo"
                        >
                          <i class="bi bi-download"></i>
                        </button>
                        <button
                          @click="verDetalle(entrega)"
                          class="btn btn-sm btn-outline-secondary"
                          title="Ver detalles"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <button
                          @click="calificarEntrega(entrega)"
                          class="btn btn-sm btn-gradient"
                          :disabled="calificando[entrega.id] || (calificaciones[entrega.id] === undefined && entrega.calificacion === null)"
                          :title="entrega.calificacion ? 'Actualizar calificación' : 'Calificar entrega'"
                        >
                          <span v-if="calificando[entrega.id]">
                            <div class="loading-spinner d-inline-block me-1" style="width: 12px; height: 12px;"></div>
                          </span>
                          <i v-else class="bi" :class="entrega.calificacion ? 'bi-pencil' : 'bi-check-lg'"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
const loading = ref(false)
const entregas = ref([])
const cursos = ref([])
const filtroCurso = ref('')
const filtroEstado = ref('')
const busqueda = ref('')
const calificaciones = ref({})
const calificando = ref({})

// Computed para estadísticas
const totalEntregas = computed(() => entregas.value.length)
const entregasPendientes = computed(() => 
  entregas.value.filter(e => e.estado === 'ENTREGADA').length
)
const entregasCalificadas = computed(() => 
  entregas.value.filter(e => e.estado === 'CALIFICADA').length
)
const promedioCalificacion = computed(() => {
  const calificadas = entregas.value.filter(e => e.estado === 'CALIFICADA' && e.calificacion !== null)
  if (calificadas.length === 0) return 0
  const suma = calificadas.reduce((acc, e) => {
    const tarea = e.tarea
    if (!tarea || !tarea.puntaje) return acc
    return acc + (e.calificacion / tarea.puntaje * 100)
  }, 0)
  return Math.round(suma / calificadas.length)
})

// Computed para entregas filtradas
const entregasFiltradas = computed(() => {
  let resultado = [...entregas.value]
  
  // Filtrar por curso
  if (filtroCurso.value) {
    resultado = resultado.filter(e => e.tarea?.cursoId === parseInt(filtroCurso.value))
  }
  
  // Filtrar por estado
  if (filtroEstado.value) {
    resultado = resultado.filter(e => e.estado === filtroEstado.value)
  }
  
  // Filtrar por búsqueda
  if (busqueda.value) {
    const busquedaLower = busqueda.value.toLowerCase()
    resultado = resultado.filter(e => {
      const nombre = `${e.estudiante?.nombre || ''} ${e.estudiante?.apellido || ''}`.toLowerCase()
      const email = (e.estudiante?.email || '').toLowerCase()
      return nombre.includes(busquedaLower) || email.includes(busquedaLower)
    })
  }
  
  // Ordenar por fecha de entrega (más recientes primero)
  resultado.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  return resultado
})

const getEstadoBadgeClass = (estado) => {
  switch (estado) {
    case 'ENTREGADA': return 'bg-warning bg-opacity-10 text-warning'
    case 'CALIFICADA': return 'bg-success bg-opacity-10 text-success'
    default: return 'bg-secondary bg-opacity-10 text-secondary'
  }
}

const getEstadoIcon = (estado) => {
  switch (estado) {
    case 'ENTREGADA': return 'bi-clock-fill'
    case 'CALIFICADA': return 'bi-check-circle-fill'
    default: return 'bi-circle'
  }
}

const getEstadoText = (estado) => {
  switch (estado) {
    case 'ENTREGADA': return 'Pendiente'
    case 'CALIFICADA': return 'Calificada'
    default: return 'Desconocido'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const getIniciales = (estudiante) => {
  if (!estudiante) return '??'
  return `${estudiante.nombre?.[0] || ''}${estudiante.apellido?.[0] || ''}`.toUpperCase()
}

const getCursoNombre = (cursoId) => {
  const curso = cursos.value.find(c => c.id === cursoId)
  return curso ? curso.titulo : 'N/A'
}

const cargarCursos = async () => {
  try {
    const response = await api.get('/cursos')
    cursos.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error cargando cursos:', error)
  }
}

const cargarEntregas = async () => {
  try {
    loading.value = true
    
    // Cargar entregas de todos los cursos del docente
    const cursosResponse = await api.get('/cursos')
    const cursosDelDocente = cursosResponse.data?.data || cursosResponse.data || []
    
    // Si el usuario es docente, filtrar solo sus cursos
    let cursosARevisar = cursosDelDocente
    if (authStore.isDocente && !authStore.isAdmin) {
      cursosARevisar = cursosDelDocente.filter(c => c.creadorId === authStore.user?.id)
    }
    
    // Si no hay cursos, inicializar entregas vacías
    if (!cursosARevisar || cursosARevisar.length === 0) {
      entregas.value = []
      return
    }
    
    // Cargar entregas de cada curso
    const todasLasEntregas = []
    for (const curso of cursosARevisar) {
      try {
        const entregasResponse = await api.get(`/cursos/${curso.id}/entregas`)
        
        // Verificar que la respuesta tenga la estructura esperada
        if (entregasResponse.data && entregasResponse.data.entregas && Array.isArray(entregasResponse.data.entregas)) {
          // Aplanar las entregas agrupadas por tarea
          entregasResponse.data.entregas.forEach(grupo => {
            if (grupo && grupo.entregas && Array.isArray(grupo.entregas) && grupo.entregas.length > 0) {
              grupo.entregas.forEach(entrega => {
                if (entrega) {
                  todasLasEntregas.push({
                    ...entrega,
                    tarea: grupo.tarea || entrega.tarea
                  })
                }
              })
            }
          })
        }
      } catch (error) {
        console.error(`Error cargando entregas del curso ${curso.id}:`, error)
        // Continuar con el siguiente curso si hay un error
      }
    }
    
    entregas.value = todasLasEntregas
    
    // Inicializar calificaciones con los valores actuales
    entregas.value.forEach(entrega => {
      if (entrega.calificacion !== null && entrega.calificacion !== undefined) {
        calificaciones.value[entrega.id] = entrega.calificacion
      }
    })
  } catch (error) {
    console.error('Error cargando entregas:', error)
    // No mostrar alert si es un error 404 o de permisos, solo loguear
    if (error.response?.status !== 404 && error.response?.status !== 403) {
      alert('Error al cargar las entregas. Por favor, intenta nuevamente.')
    }
    entregas.value = []
  } finally {
    loading.value = false
  }
}

const aplicarFiltros = () => {
  // Los filtros se aplican automáticamente mediante computed
}

const calificarEntrega = async (entrega) => {
  const calificacion = calificaciones.value[entrega.id] !== undefined 
    ? calificaciones.value[entrega.id] 
    : entrega.calificacion
  
  if (calificacion === undefined || calificacion === null) {
    alert('Por favor ingresa una calificación')
    return
  }
  
  const puntajeMaximo = entrega.tarea?.puntaje || 100
  if (calificacion < 0 || calificacion > puntajeMaximo) {
    alert(`La calificación debe estar entre 0 y ${puntajeMaximo}`)
    return
  }
  
  try {
    calificando.value[entrega.id] = true
    
    await api.patch(`/entregas/${entrega.id}`, {
      calificacion: calificacion
    })
    
    // Actualizar el estado local
    entrega.calificacion = calificacion
    entrega.estado = 'CALIFICADA'
    
    alert('Entrega calificada exitosamente')
  } catch (error) {
    console.error('Error calificando entrega:', error)
    alert('Error al calificar la entrega. Por favor, intenta nuevamente.')
  } finally {
    calificando.value[entrega.id] = false
    // Recargar entregas para actualizar estadísticas
    await cargarEntregas()
  }
}

const descargarEntrega = async (entrega) => {
  try {
    if (!entrega.archivoUrl) {
      alert('Esta entrega no tiene archivo asociado')
      return
    }
    
    // Si el archivo tiene una URL completa, abrirla
    if (entrega.archivoUrl.startsWith('http')) {
      window.open(entrega.archivoUrl, '_blank')
    } else {
      // Intentar descargar desde la API
      try {
        const response = await api.get(`/materiales/download-url/${entrega.archivoUrl.split('/').pop()}`)
        window.open(response.data, '_blank')
      } catch (error) {
        // Si no hay endpoint de descarga, mostrar mensaje
        alert('Función de descarga no disponible. Archivo: ' + entrega.archivoUrl)
      }
    }
  } catch (error) {
    console.error('Error descargando entrega:', error)
    alert('Error al descargar el archivo')
  }
}

const verDetalle = (entrega) => {
  router.push(`/tareas/${entrega.tareaId}`)
}

onMounted(async () => {
  await Promise.all([
    cargarCursos(),
    cargarEntregas()
  ])
})
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

