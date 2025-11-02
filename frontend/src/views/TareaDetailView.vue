<template>
  <Layout>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else-if="!tarea" class="text-center py-8 text-gray-500">
      Tarea no encontrada
    </div>

    <div v-else class="container-fluid">
      <!-- Header de la tarea -->
      <div class="row mb-4">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <RouterLink to="/tareas" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-arrow-left me-2"></i>Volver
                  </RouterLink>
                  <span
                    class="badge px-3 py-2"
                    :class="getEstadoBadgeClass(tarea.estado || 'PENDIENTE')"
                  >
                    <i class="bi" :class="getEstadoIcon(tarea.estado || 'PENDIENTE') + ' me-1'"></i>
                    {{ getEstadoText(tarea.estado || 'PENDIENTE') }}
                  </span>
                </div>
                <h1 class="h2 mb-2 text-gradient">{{ tarea.titulo }}</h1>
                <p class="text-muted mb-2 fs-5">
                  <i class="bi bi-book me-2"></i>{{ tarea.curso?.titulo || 'Curso no especificado' }}
                </p>
                <p class="text-muted mb-0">{{ tarea.descripcion }}</p>
              </div>
              <div class="text-end">
                <div class="mb-2">
                  <small class="text-muted d-block">Fecha límite</small>
                  <strong>{{ formatDate(tarea.fechaLimite) }}</strong>
                  <span :class="getDiasRestantesClass(tarea.fechaLimite)" class="small d-block mt-1">
                    {{ getDiasRestantes(tarea.fechaLimite) }}
                  </span>
                </div>
                <div>
                  <small class="text-muted d-block">Puntaje máximo</small>
                  <strong class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                    {{ tarea.puntaje }} pts
                  </strong>
                </div>
                <div v-if="tarea._count?.entregas" class="mt-2">
                  <small class="text-muted d-block">Total entregas</small>
                  <strong class="badge bg-info bg-opacity-10 text-info px-3 py-2">
                    {{ tarea._count.entregas }}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón prominente de adjuntar tarea para estudiantes -->
      <div v-if="authStore.isEstudiante && !yaVencio(tarea.fechaLimite)" class="row mb-4">
        <div class="col-12">
          <div class="glass-effect p-3 animate-bounce-in">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h5 class="mb-1 fw-bold">
                  <i class="bi bi-upload me-2 text-primary"></i>¿Listo para entregar tu tarea?
                </h5>
                <p class="text-muted mb-0 small">Sube tu archivo y agrega un comentario opcional</p>
              </div>
              <button
                @click="mostrarFormularioEntrega = !mostrarFormularioEntrega"
                class="btn btn-gradient btn-lg"
                :class="{ 'btn-success': mostrarFormularioEntrega }"
              >
                <i class="bi" :class="(mostrarFormularioEntrega ? 'bi-x-lg' : 'bi-paperclip') + ' me-2'"></i>
                {{ mostrarFormularioEntrega ? 'Cerrar' : 'Adjuntar Tarea' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="row g-4">
        <!-- Formulario de entrega (para estudiantes) -->
        <div v-if="authStore.isEstudiante && (mostrarFormularioEntrega || miEntrega)" class="col-lg-6">
          <div class="card-hover h-100 animate-slide-in">
            <div class="card-header border-0 bg-transparent p-4">
              <h2 class="h5 mb-0 text-gradient">
                <i class="bi bi-cloud-upload me-2"></i>Mi Entrega
              </h2>
            </div>
            <div class="card-body p-4">
              <!-- Estado de entrega actual -->
              <div v-if="miEntrega" class="mb-4">
                <div class="glass-effect p-4 rounded-3">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <h5 class="mb-0 fw-bold">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>Entrega Actual
                    </h5>
                    <span
                      class="badge px-3 py-2"
                      :class="getEstadoBadgeClass(miEntrega.estado)"
                    >
                      {{ getEstadoText(miEntrega.estado) }}
                    </span>
                  </div>
                  <div v-if="miEntrega.comentario" class="mb-3">
                    <small class="text-muted d-block mb-1">Comentario:</small>
                    <p class="mb-0">{{ miEntrega.comentario }}</p>
                  </div>
                  <div v-if="miEntrega.archivoUrl" class="mb-3">
                    <small class="text-muted d-block mb-1">Archivo:</small>
                    <button
                      @click="descargarEntrega(miEntrega)"
                      class="btn btn-sm btn-outline-info"
                    >
                      <i class="bi bi-download me-1"></i>Ver archivo adjunto
                    </button>
                  </div>
                  <div v-if="miEntrega.calificacion !== null && miEntrega.calificacion !== undefined" class="mt-3 pt-3 border-top">
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-award-fill text-warning fs-5"></i>
                      <div>
                        <small class="text-muted d-block">Calificación</small>
                        <strong class="fs-5">{{ miEntrega.calificacion }}/{{ tarea.puntaje }} pts</strong>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <small class="text-muted">
                      <i class="bi bi-calendar me-1"></i>
                      Entregado: {{ formatDate(miEntrega.createdAt || miEntrega.fechaEntrega) }}
                    </small>
                  </div>
                </div>
              </div>

              <!-- Formulario de entrega -->
              <div v-if="mostrarFormularioEntrega || !miEntrega">
                <form @submit.prevent="entregarTarea">
                  <div class="mb-4">
                    <label for="comentario" class="form-label fw-semibold">
                      <i class="bi bi-chat-left-text me-1"></i>Comentario (opcional)
                    </label>
                    <textarea
                      id="comentario"
                      v-model="entregaForm.comentario"
                      rows="4"
                      class="form-control border-0 bg-transparent"
                      placeholder="Agrega un comentario sobre tu entrega..."
                    ></textarea>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold mb-2">
                      <i class="bi bi-paperclip me-1"></i>Archivo
                    </label>
                    <div class="glass-effect p-3 rounded-3">
                      <input
                        type="file"
                        @change="seleccionarArchivo"
                        class="form-control border-0 bg-transparent"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                        :disabled="subiendoArchivo"
                      />
                      <div v-if="entregaForm.archivo" class="mt-2">
                        <small class="text-success">
                          <i class="bi bi-check-circle me-1"></i>
                          Archivo seleccionado: {{ entregaForm.archivo.name }}
                          ({{ formatFileSize(entregaForm.archivo.size) }})
                        </small>
                      </div>
                      <small class="text-muted d-block mt-2">
                        Formatos permitidos: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR
                      </small>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    <button
                      type="submit"
                      :disabled="subiendoArchivo || !entregaForm.archivo"
                      class="btn btn-gradient flex-grow-1"
                    >
                      <span v-if="subiendoArchivo">
                        <div class="loading-spinner d-inline-block me-2" style="width: 16px; height: 16px;"></div>
                        Subiendo...
                      </span>
                      <span v-else>
                        <i class="bi" :class="(miEntrega ? 'bi-arrow-clockwise' : 'bi-upload') + ' me-2'"></i>
                        {{ miEntrega ? 'Actualizar Entrega' : 'Entregar Tarea' }}
                      </span>
                    </button>
                    <button
                      v-if="mostrarFormularioEntrega"
                      type="button"
                      @click="mostrarFormularioEntrega = false"
                      class="btn btn-outline-secondary"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Información de la tarea (solo para estudiantes) -->
        <div v-if="authStore.isEstudiante" class="col-lg-6">
          <div class="card-hover h-100">
            <div class="card-header border-0 bg-transparent p-4">
              <h2 class="h5 mb-0 text-gradient">
                <i class="bi bi-info-circle me-2"></i>Información
              </h2>
            </div>
            <div class="card-body p-4">
              <div class="mb-4">
                <h3 class="h6 fw-bold mb-3">Detalles</h3>
                <ul class="list-unstyled mb-0">
                  <li class="mb-2">
                    <i class="bi bi-book text-primary me-2"></i>
                    <strong>Curso:</strong> {{ tarea.curso.titulo }}
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-calendar-event text-primary me-2"></i>
                    <strong>Fecha límite:</strong> {{ formatDate(tarea.fechaLimite) }}
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-star-fill text-warning me-2"></i>
                    <strong>Puntaje máximo:</strong> {{ tarea.puntaje }} puntos
                  </li>
                  <li class="mb-0">
                    <i class="bi bi-file-earmark-check text-info me-2"></i>
                    <strong>Total de entregas:</strong> {{ tarea.entregas?.length || 0 }}
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="h6 fw-bold mb-3">Navegación</h3>
                <div class="d-flex flex-column gap-2">
                  <RouterLink
                    :to="`/cursos/${tarea.curso.id}`"
                    class="btn btn-outline-primary w-100"
                  >
                    <i class="bi bi-arrow-left me-2"></i>Volver al Curso
                  </RouterLink>
                  <RouterLink
                    to="/tareas"
                    class="btn btn-outline-secondary w-100"
                  >
                    <i class="bi bi-list me-2"></i>Ver Todas las Tareas
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sección completa de entregas para docentes (toma todo el ancho) -->
      <div v-if="authStore.isDocente || authStore.isAdmin" class="row mt-4">
        <div class="col-12">
          <div class="card-hover">
          <div class="card-header border-0 bg-transparent p-4">
            <div class="d-flex justify-content-between align-items-center">
              <h2 class="h5 mb-0 text-gradient">
                <i class="bi bi-clipboard-check me-2"></i>Entregas de Estudiantes
              </h2>
              <button
                @click="cargarTarea"
                class="btn btn-sm btn-outline-primary"
                :disabled="cargandoEntregas"
                title="Actualizar entregas"
              >
                <i class="bi bi-arrow-clockwise" :class="{ 'spin': cargandoEntregas }"></i>
              </button>
            </div>
            <div v-if="entregas.length > 0" class="mt-3">
              <div class="d-flex gap-3">
                <span class="badge bg-info bg-opacity-10 text-info">
                  <i class="bi bi-file-earmark-check me-1"></i>{{ entregas.length }} total
                </span>
                <span class="badge bg-success bg-opacity-10 text-success">
                  <i class="bi bi-check-circle me-1"></i>{{ entregasCalificadas }} calificadas
                </span>
                <span class="badge bg-warning bg-opacity-10 text-warning">
                  <i class="bi bi-clock me-1"></i>{{ entregasPendientes }} pendientes
                </span>
              </div>
            </div>
          </div>
          <div class="card-body p-4">
            <div v-if="cargandoEntregas" class="text-center py-5">
              <div class="loading-spinner mx-auto"></div>
              <p class="text-muted mt-3">Cargando entregas...</p>
            </div>
            <div v-else-if="entregas.length === 0" class="text-center py-5">
              <i class="bi bi-clipboard-x text-muted" style="font-size: 3rem;"></i>
              <p class="text-muted mt-3">No hay entregas aún</p>
              <p class="text-muted small">Las entregas aparecerán aquí cuando los estudiantes entreguen sus tareas</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Email</th>
                    <th>Fecha de Entrega</th>
                    <th>Comentario</th>
                    <th>Estado</th>
                    <th>Calificación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entrega in entregas" :key="entrega.id">
                    <td>
                      <strong>{{ entrega.estudiante?.nombre }} {{ entrega.estudiante?.apellido }}</strong>
                    </td>
                    <td>{{ entrega.estudiante?.email }}</td>
                    <td>{{ formatDate(entrega.createdAt) }}</td>
                    <td>
                      <span v-if="entrega.comentario" class="text-muted small">
                        {{ entrega.comentario }}
                      </span>
                      <span v-else class="text-muted fst-italic small">Sin comentario</span>
                    </td>
                    <td>
                      <span 
                        class="badge px-3 py-2"
                        :class="getEstadoBadgeClass(entrega.estado)"
                      >
                        {{ getEstadoText(entrega.estado) }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <input
                          type="number"
                          v-model.number="calificaciones[entrega.id]"
                          :placeholder="entrega.calificacion || '0'"
                          :min="0"
                          :max="tarea.puntaje"
                          class="form-control form-control-sm"
                          style="width: 80px;"
                          :disabled="calificando[entrega.id]"
                        />
                        <span class="text-muted">/ {{ tarea.puntaje }}</span>
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
                          @click="calificarEntrega(entrega)"
                          class="btn btn-sm btn-gradient"
                          :disabled="calificando[entrega.id] || (calificaciones[entrega.id] === undefined && !entrega.calificacion)"
                          title="Calificar entrega"
                        >
                          <span v-if="calificando[entrega.id]">
                            <div class="loading-spinner d-inline-block me-1" style="width: 12px; height: 12px;"></div>
                          </span>
                          <i v-else class="bi bi-check-lg"></i>
                          {{ entrega.calificacion ? 'Actualizar' : 'Calificar' }}
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
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from '@/stores/auth'
import { api } from '@/services/api'
import Layout from '@/components/Layout.vue'

const route = useRoute()
const loading = ref(true)
const cargandoEntregas = ref(false)
const tarea = ref(null)
const entregas = ref([])
const miEntrega = ref(null)
const subiendoArchivo = ref(false)
const calificaciones = ref({})
const calificando = ref({})
const mostrarFormularioEntrega = ref(false)

const entregaForm = ref({
  comentario: '',
  archivo: null
})

// Computed para estadísticas
const entregasCalificadas = computed(() => {
  return entregas.value.filter(e => e.estado === 'CALIFICADA').length
})

const entregasPendientes = computed(() => {
  return entregas.value.filter(e => e.estado === 'ENTREGADA').length
})

const getEstadoClass = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-warning bg-opacity-10 text-warning'
    case 'ENTREGADA': return 'bg-info bg-opacity-10 text-info'
    case 'CALIFICADA': return 'bg-success bg-opacity-10 text-success'
    default: return 'bg-secondary bg-opacity-10 text-secondary'
  }
}

const getEstadoBadgeClass = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-warning bg-opacity-10 text-warning'
    case 'ENTREGADA': return 'bg-info bg-opacity-10 text-info'
    case 'CALIFICADA': return 'bg-success bg-opacity-10 text-success'
    default: return 'bg-secondary bg-opacity-10 text-secondary'
  }
}

const getEstadoText = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente'
    case 'ENTREGADA': return 'Entregada'
    case 'CALIFICADA': return 'Calificada'
    default: return 'Desconocido'
  }
}

const getEstadoIcon = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'bi-clock-fill'
    case 'ENTREGADA': return 'bi-check-circle-fill'
    case 'CALIFICADA': return 'bi-award-fill'
    default: return 'bi-circle'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'No especificada'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDiasRestantes = (fechaLimite) => {
  if (!fechaLimite) return 'No especificada'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diferencia = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
  
  if (diferencia < 0) return 'Vencida'
  if (diferencia === 0) return 'Vence hoy'
  if (diferencia === 1) return 'Vence mañana'
  return `${diferencia} días restantes`
}

const getDiasRestantesClass = (fechaLimite) => {
  if (!fechaLimite) return 'text-muted'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diferencia = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
  
  if (diferencia < 0) return 'text-danger fw-bold'
  if (diferencia <= 2) return 'text-warning fw-bold'
  return 'text-muted'
}

const yaVencio = (fechaLimite) => {
  if (!fechaLimite) return false
  return new Date(fechaLimite) < new Date()
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const cargarTarea = async () => {
  try {
    loading.value = true
    cargandoEntregas.value = true
    const tareaId = route.params.id
    console.log('Cargando tarea con ID:', tareaId)
    const response = await api.get(`/tareas/${tareaId}`)
    tarea.value = response.data
    entregas.value = response.data.entregas || []
    
    // Si es estudiante, buscar su entrega específica
    if (authStore.isEstudiante && entregas.value.length > 0) {
      miEntrega.value = entregas.value.find(e => 
        e.estudiante?.id === authStore.user?.id || 
        e.estudianteId === authStore.user?.id
      ) || null
    }
    
    // Inicializar calificaciones con los valores actuales
    entregas.value.forEach(entrega => {
      if (entrega.calificacion !== null && entrega.calificacion !== undefined) {
        calificaciones.value[entrega.id] = entrega.calificacion
      }
    })
  } catch (error) {
    console.error('Error cargando tarea:', error)
    // En caso de error, usar datos demo si está en modo demo
    if (error.code === 'ERR_NETWORK' || !error.response) {
      const tareaId = parseInt(route.params.id)
      const tareasDemo = [
        {
          id: 1,
          titulo: 'Ejercicio de Variables y Tipos de Datos',
          descripcion: 'Crear un programa que demuestre el uso de diferentes tipos de variables en JavaScript',
          estado: 'PENDIENTE',
          fechaLimite: '2024-02-20',
          puntaje: 100,
          curso: { id: 1, titulo: 'Introducción a la Programación' },
          _count: { entregas: 15 },
          entregas: []
        }
      ]
      tarea.value = tareasDemo.find(t => t.id === tareaId) || tareasDemo[0]
      entregas.value = []
      miEntrega.value = null
    }
  } finally {
    loading.value = false
    cargandoEntregas.value = false
  }
}

const seleccionarArchivo = (event) => {
  const target = event.target
  if (target.files && target.files[0]) {
    entregaForm.value.archivo = target.files[0]
  }
}

const entregarTarea = async () => {
  try {
    subiendoArchivo.value = true
    let archivoUrl = null

    // Subir archivo si se seleccionó uno
    if (entregaForm.value.archivo) {
      const fileName = entregaForm.value.archivo.name
      const contentType = entregaForm.value.archivo.type
      
      const uploadResponse = await api.get(`/entregas/upload-url?fileName=${fileName}&contentType=${contentType}`)
      const { presignedUrl, objectName } = uploadResponse.data

      // Subir archivo a MinIO
      await fetch(presignedUrl, {
        method: 'PUT',
        body: entregaForm.value.archivo,
        headers: {
          'Content-Type': contentType
        }
      })

      archivoUrl = objectName
    }

    // Crear/actualizar entrega
    const entregaData = {
      tareaId: tarea.value.id,
      comentario: entregaForm.value.comentario,
      archivoUrl
    }

    if (miEntrega.value) {
      await api.patch(`/entregas/${miEntrega.value.id}`, entregaData)
    } else {
      await api.post('/entregas', entregaData)
    }

    // Recargar datos
    await cargarTarea()
    
    // Cerrar formulario y limpiar
    mostrarFormularioEntrega.value = false
    entregaForm.value = {
      comentario: '',
      archivo: null
    }
    
    alert('Tarea entregada exitosamente')
  } catch (error) {
    console.error('Error entregando tarea:', error)
    alert('Error al entregar la tarea')
  } finally {
    subiendoArchivo.value = false
  }
}

const calificarEntrega = async (entrega) => {
  const calificacion = calificaciones.value[entrega.id] !== undefined 
    ? calificaciones.value[entrega.id] 
    : entrega.calificacion
  
  if (calificacion === undefined || calificacion === null) {
    alert('Por favor ingresa una calificación')
    return
  }
  
  if (calificacion < 0 || calificacion > tarea.value.puntaje) {
    alert(`La calificación debe estar entre 0 y ${tarea.value.puntaje}`)
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
    
    // Recargar tarea para actualizar datos
    await cargarTarea()
    
    alert('Entrega calificada exitosamente')
  } catch (error) {
    console.error('Error calificando entrega:', error)
    alert('Error al calificar la entrega. Por favor, intenta nuevamente.')
  } finally {
    calificando.value[entrega.id] = false
  }
}

const descargarEntrega = async (entrega) => {
  try {
    const response = await api.get(`/entregas/download-url/${entrega.archivoUrl}`)
    window.open(response.data, '_blank')
  } catch (error) {
    console.error('Error descargando entrega:', error)
  }
}

onMounted(() => {
  cargarTarea()
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
