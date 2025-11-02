<template>
  <Layout>
    <div class="container-fluid">
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando curso...</p>
      </div>

      <div v-else-if="!curso" class="text-center py-5">
        <div class="glass-effect p-5">
          <i class="bi bi-exclamation-circle text-muted" style="font-size: 4rem;"></i>
          <h4 class="text-muted mt-3">Curso no encontrado</h4>
          <RouterLink to="/cursos" class="btn btn-gradient mt-3">
            Volver a Cursos
          </RouterLink>
        </div>
      </div>

      <div v-else>
        <!-- Header del curso -->
        <div class="row mb-5">
          <div class="col">
            <div class="glass-effect p-4 animate-fade-in">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h1 class="h2 mb-2 text-gradient">{{ curso.titulo }}</h1>
                  <p class="text-muted mb-2 fs-5">
                    <i class="bi bi-tag me-2"></i>{{ curso.codigo }}
                  </p>
                  <p class="mb-3">{{ curso.descripcion }}</p>
                  <div class="d-flex align-items-center gap-2">
                    <span 
                      class="badge px-3 py-2"
                      :class="curso.activo ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                      <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>
                      {{ curso.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                      <i class="bi bi-person-badge me-1"></i>
                      {{ curso.creador.nombre }} {{ curso.creador.apellido }}
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <!-- Botones para estudiantes -->
                  <div v-if="authStore.isEstudiante" class="d-flex flex-column align-items-end">
                    <button 
                      v-if="!estoyMatriculado"
                      @click="matricularse"
                      class="btn btn-gradient mb-2"
                      :disabled="matriculando">
                      <span v-if="matriculando">
                        <div class="loading-spinner me-2" style="width: 16px; height: 16px;"></div>
                        Matriculando...
                      </span>
                      <span v-else>
                        <i class="bi bi-plus-circle me-2"></i>Matricularme
                      </span>
                    </button>
                    <button 
                      v-else
                      @click="desmatricularse"
                      class="btn btn-outline-danger mb-2"
                      :disabled="matriculando">
                      <i class="bi bi-dash-circle me-2"></i>Desmatricularse
                    </button>
                  </div>
                  
                  <!-- Botón para administradores -->
                  <button 
                    v-if="authStore.isAdmin"
                    @click="toggleActivoCurso"
                    :class="curso.activo ? 'btn btn-outline-danger mb-2' : 'btn btn-outline-success mb-2'">
                    <i :class="curso.activo ? 'bi bi-pause-circle' : 'bi bi-play-circle'" class="me-2"></i>
                    {{ curso.activo ? 'Desactivar Curso' : 'Activar Curso' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de estudiantes (solo para docentes creadores) -->
        <div v-if="soyDocenteYcreador" class="row mb-5">
          <div class="col">
            <div class="glass-effect p-4 animate-fade-in">
              <h3 class="h4 mb-4">
                <i class="bi bi-people me-2"></i>Gestión de Estudiantes
              </h3>
              
              <!-- Formulario para añadir estudiante -->
              <div class="card mb-4 border-0 bg-light">
                <div class="card-body">
                  <h5 class="card-title mb-3">
                    <i class="bi bi-person-plus me-2"></i>Añadir Estudiante
                  </h5>
                  <form @submit.prevent="añadirEstudiante" class="row g-3">
                    <div class="col-md-8">
                      <label for="estudianteId" class="form-label">ID del Estudiante</label>
                      <input
                        type="number"
                        id="estudianteId"
                        v-model.number="nuevoEstudianteId"
                        class="form-control"
                        placeholder="Ingresa el ID del estudiante"
                        required
                        min="1"
                        :disabled="añadiendoEstudiante"
                      />
                      <small class="text-muted">Ingresa el ID numérico del estudiante que deseas añadir</small>
                    </div>
                    <div class="col-md-4 d-flex align-items-end">
                      <button
                        type="submit"
                        class="btn btn-gradient w-100"
                        :disabled="añadiendoEstudiante || !nuevoEstudianteId"
                      >
                        <span v-if="añadiendoEstudiante">
                          <div class="loading-spinner me-2 d-inline-block" style="width: 16px; height: 16px;"></div>
                          Añadiendo...
                        </span>
                        <span v-else>
                          <i class="bi bi-plus-circle me-2"></i>Añadir
                        </span>
                      </button>
                    </div>
                  </form>
                  <div v-if="errorAñadirEstudiante" class="alert alert-danger mt-3 mb-0">
                    <i class="bi bi-exclamation-triangle me-2"></i>{{ errorAñadirEstudiante }}
                  </div>
                  <div v-if="exitoAñadirEstudiante" class="alert alert-success mt-3 mb-0">
                    <i class="bi bi-check-circle me-2"></i>{{ exitoAñadirEstudiante }}
                  </div>
                </div>
              </div>

              <!-- Lista de estudiantes matriculados -->
              <div class="card border-0 bg-light">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">
                      <i class="bi bi-list-ul me-2"></i>Estudiantes Matriculados
                      <span class="badge bg-primary ms-2">{{ estudiantes.length }}</span>
                    </h5>
                    <button
                      @click="cargarEstudiantes"
                      class="btn btn-sm btn-outline-primary"
                      :disabled="cargandoEstudiantes"
                    >
                      <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': cargandoEstudiantes }"></i>
                      Actualizar
                    </button>
                  </div>
                  
                  <div v-if="cargandoEstudiantes" class="text-center py-4">
                    <div class="loading-spinner mx-auto"></div>
                    <p class="text-muted mt-2">Cargando estudiantes...</p>
                  </div>
                  
                  <div v-else-if="estudiantes.length === 0" class="text-center py-4">
                    <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
                    <p class="text-muted mt-3">No hay estudiantes matriculados en este curso</p>
                  </div>
                  
                  <div v-else class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Fecha de Matrícula</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="estudiante in estudiantes" :key="estudiante.id">
                          <td><strong>{{ estudiante.id }}</strong></td>
                          <td>{{ estudiante.nombre }} {{ estudiante.apellido }}</td>
                          <td>{{ estudiante.email }}</td>
                          <td>{{ formatDate(estudiante.fechaMatricula) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Entregas de Tareas (solo para docentes) -->
        <div v-if="soyDocenteYcreador" class="row mb-5">
          <div class="col">
            <div class="glass-effect p-4 animate-fade-in">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="h4 mb-0">
                  <i class="bi bi-clipboard-check me-2"></i>Entregas de Tareas
                </h3>
                <button
                  @click="cargarEntregas"
                  class="btn btn-sm btn-outline-primary"
                  :disabled="cargandoEntregas"
                >
                  <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': cargandoEntregas }"></i>
                  Actualizar
                </button>
              </div>
              
              <div v-if="cargandoEntregas" class="text-center py-4">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-muted mt-2">Cargando entregas...</p>
              </div>
              
              <div v-else-if="entregasData.entregas.length === 0" class="text-center py-4">
                <i class="bi bi-clipboard-x text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3">No hay entregas de tareas en este curso aún</p>
              </div>
              
              <div v-else>
                <!-- Acordeón de entregas agrupadas por tarea -->
                <div class="accordion" id="entregasAccordion">
                  <div 
                    v-for="(grupo, index) in entregasData.entregas" 
                    :key="grupo.tarea.id"
                    class="accordion-item border-0 mb-3"
                  >
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button glass-effect"
                        type="button"
                        :class="{ collapsed: index !== 0 }"
                        :data-bs-target="`#collapse${grupo.tarea.id}`"
                        :aria-expanded="index === 0 ? 'true' : 'false'"
                        :aria-controls="`collapse${grupo.tarea.id}`"
                      >
                        <div class="d-flex justify-content-between align-items-center w-100 me-3">
                          <div class="text-start">
                            <strong>{{ grupo.tarea.titulo }}</strong>
                            <small class="text-muted d-block">
                              {{ grupo.totalEntregas }} entrega(s) | 
                              {{ grupo.entregasCalificadas }} calificada(s) | 
                              {{ grupo.entregasPendientes }} pendiente(s)
                            </small>
                          </div>
                          <div class="text-end">
                            <span class="badge bg-primary bg-opacity-10 text-primary">
                              {{ grupo.tarea.puntaje }} pts
                            </span>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div
                      :id="`collapse${grupo.tarea.id}`"
                      class="accordion-collapse collapse"
                      :class="{ show: index === 0 }"
                      :data-bs-parent="'#entregasAccordion'"
                    >
                      <div class="accordion-body p-4">
                        <div v-if="grupo.entregas.length === 0" class="text-center py-3">
                          <p class="text-muted mb-0">No hay entregas para esta tarea</p>
                        </div>
                        <div v-else class="table-responsive">
                          <table class="table table-hover">
                            <thead>
                              <tr>
                                <th>Estudiante</th>
                                <th>Email</th>
                                <th>Fecha de Entrega</th>
                                <th>Estado</th>
                                <th>Calificación</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="entrega in grupo.entregas" :key="entrega.id">
                                <td>
                                  <strong>{{ entrega.estudiante?.nombre }} {{ entrega.estudiante?.apellido }}</strong>
                                </td>
                                <td>{{ entrega.estudiante?.email }}</td>
                                <td>{{ formatDate(entrega.createdAt) }}</td>
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
                                      :max="grupo.tarea.puntaje"
                                      class="form-control form-control-sm"
                                      style="width: 80px;"
                                      :disabled="calificando[entrega.id]"
                                    />
                                    <span class="text-muted">/ {{ grupo.tarea.puntaje }}</span>
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
                                      @click="calificarEntrega(entrega, grupo.tarea.puntaje)"
                                      class="btn btn-sm btn-gradient"
                                      :disabled="calificando[entrega.id] || !calificaciones[entrega.id]"
                                      title="Calificar entrega"
                                    >
                                      <span v-if="calificando[entrega.id]">
                                        <div class="loading-spinner d-inline-block me-1" style="width: 12px; height: 12px;"></div>
                                      </span>
                                      <i v-else class="bi bi-check-lg"></i>
                                      Calificar
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
            </div>
          </div>
        </div>

      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from '../stores/auth'
import { api } from '../services/api'
import Layout from '../components/Layout.vue'

const route = useRoute()
const loading = ref(true)
const curso = ref(null)
const clases = ref([])
const mensajes = ref([])
const nuevoMensaje = ref('')
const enviandoMensaje = ref(false)
const matriculando = ref(false)
const estoyMatriculado = ref(false)

// Variables para gestión de estudiantes
const estudiantes = ref([])
const nuevoEstudianteId = ref(null)
const añadiendoEstudiante = ref(false)
const cargandoEstudiantes = ref(false)
const errorAñadirEstudiante = ref('')
const exitoAñadirEstudiante = ref('')

// Variables para gestión de entregas
const entregasData = ref({
  curso: null,
  entregas: [],
  total: 0
})
const cargandoEntregas = ref(false)
const calificaciones = ref({})
const calificando = ref({})

// Verificar si el usuario es docente y creador del curso
const soyDocenteYcreador = computed(() => {
  return authStore.isDocente && curso.value && curso.value.creadorId === authStore.user?.id
})

// ✅ FUNCIÓN MEJORADA: Verificar matrícula de forma consistente
const verificarMatricula = () => {
  if (!authStore.user || !curso.value) return false
  
  const key = `matricula_${authStore.user.id}_${curso.value.id}`
  const matriculaGuardada = localStorage.getItem(key)
  
  return matriculaGuardada === 'true'
}

// ✅ Formateadores
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
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

const cargarCurso = async () => {
  try {
    const cursoId = parseInt(route.params.id)
    
    // Intentar cargar desde la API real
    try {
      const response = await api.get(`/cursos/${cursoId}`)
      curso.value = response.data
    } catch (apiError) {
      // Si falla, usar datos demo
      console.warn('Error cargando curso desde API, usando datos demo:', apiError)
      
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // ✅ DATOS CONSISTENTES con IDs únicos
      const cursosDemo = [
        {
          id: 1,
          titulo: 'Introducción a la Programación',
          codigo: 'PROG-101',
          descripcion: 'Aprende los fundamentos de la programación con ejemplos prácticos',
          activo: true,
          creador: { nombre: 'Juan', apellido: 'Pérez' },
          creadorId: 2, // ID del docente Juan Pérez
          _count: { clases: 12, matriculas: 45, mensajes: 23 }
        },
        {
          id: 2,
          titulo: 'Base de Datos Avanzada',
          codigo: 'BD-301',
          descripcion: 'Diseño, implementación y optimización de bases de datos',
          activo: true,
          creador: { nombre: 'María', apellido: 'García' },
          creadorId: 2, // ID del docente
          _count: { clases: 10, matriculas: 32, mensajes: 18 }
        },
        {
          id: 3,
          titulo: 'Desarrollo Web Full Stack',
          codigo: 'WEB-401',
          descripcion: 'Domina el desarrollo web completo',
          activo: true,
          creador: { nombre: 'Carlos', apellido: 'López' },
          creadorId: 2, // ID del docente
          _count: { clases: 18, matriculas: 58, mensajes: 45 }
        }
      ]
      
      curso.value = cursosDemo.find(c => c.id === cursoId) || null
    }
  } catch (error) {
    console.error('Error cargando curso:', error)
  }
}

// Cargar estudiantes del curso
const cargarEstudiantes = async () => {
  if (!curso.value) return
  
  try {
    cargandoEstudiantes.value = true
    const response = await api.get(`/cursos/${curso.value.id}/estudiantes`)
    estudiantes.value = response.data.estudiantes || []
  } catch (error) {
    console.error('Error cargando estudiantes:', error)
    // Si falla, inicializar como array vacío
    estudiantes.value = []
  } finally {
    cargandoEstudiantes.value = false
  }
}

// Añadir estudiante al curso
const añadirEstudiante = async () => {
  if (!curso.value || !nuevoEstudianteId.value) return
  
  try {
    añadiendoEstudiante.value = true
    errorAñadirEstudiante.value = ''
    exitoAñadirEstudiante.value = ''
    
    const response = await api.post('/matriculas', {
      cursoId: curso.value.id,
      estudianteId: nuevoEstudianteId.value
    })
    
    // Éxito
    exitoAñadirEstudiante.value = `Estudiante ${response.data.estudiante?.nombre || nuevoEstudianteId.value} añadido exitosamente`
    nuevoEstudianteId.value = null
    
    // Recargar la lista de estudiantes
    await cargarEstudiantes()
    
    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      exitoAñadirEstudiante.value = ''
    }, 3000)
  } catch (error) {
    errorAñadirEstudiante.value = error.response?.data?.message || 'Error al añadir el estudiante'
    
    // Limpiar mensaje de error después de 5 segundos
    setTimeout(() => {
      errorAñadirEstudiante.value = ''
    }, 5000)
  } finally {
    añadiendoEstudiante.value = false
  }
}

const cargarClases = async () => {
  try {
    const cursoId = parseInt(route.params.id)
    
    const clasesDemo = {
      1: [
        {
          id: 1,
          titulo: 'Variables y Tipos de Datos',
          descripcion: 'Aprende sobre variables y tipos de datos básicos',
          fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 60,
          orden: 1,
          _count: { materiales: 3, tareas: 1 }
        },
        {
          id: 2,
          titulo: 'Estructuras de Control',
          descripcion: 'If, else, switch y bucles',
          fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 90,
          orden: 2,
          _count: { materiales: 4, tareas: 2 }
        }
      ],
      2: [
        {
          id: 4,
          titulo: 'Modelo Entidad-Relación',
          descripcion: 'Diseño conceptual de bases de datos',
          fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 90,
          orden: 1,
          _count: { materiales: 6, tareas: 1 }
        }
      ],
      3: [
        {
          id: 5,
          titulo: 'HTML5 y CSS3 Moderno',
          descripcion: 'Fundamentos del desarrollo web',
          fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 120,
          orden: 1,
          _count: { materiales: 8, tareas: 3 }
        }
      ]
    }
    
    clases.value = clasesDemo[cursoId] || []
  } catch (error) {
    console.error('Error cargando clases:', error)
  }
}

const cargarMensajes = async () => {
  try {
    const ahora = Date.now()
    mensajes.value = [
      {
        id: 1,
        contenido: '¿Cuándo es la próxima clase?',
        usuario: {
          nombre: 'María',
          apellido: 'González',
          rol: 'ESTUDIANTE'
        },
        createdAt: new Date(ahora - 3600000).toISOString()
      },
      {
        id: 2,
        contenido: 'La próxima clase es en 3 días a las 10:00 AM',
        usuario: {
          nombre: 'Juan',
          apellido: 'Pérez',
          rol: 'DOCENTE'
        },
        createdAt: new Date(ahora - 1800000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Error cargando mensajes:', error)
  }
}

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || enviandoMensaje.value) return

  try {
    enviandoMensaje.value = true
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mensaje = {
      id: Date.now(),
      contenido: nuevoMensaje.value,
      usuario: {
        nombre: authStore.user?.nombre || 'Usuario',
        apellido: authStore.user?.apellido || 'Demo',
        rol: authStore.user?.rol || 'ESTUDIANTE'
      },
      createdAt: new Date().toISOString()
    }
    
    mensajes.value.push(mensaje)
    nuevoMensaje.value = ''
    
    setTimeout(() => {
      const container = document.querySelector('.mensajes-container')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 100)
  } catch (error) {
    console.error('Error enviando mensaje:', error)
  } finally {
    enviandoMensaje.value = false
  }
}

// ✅ MATRÍCULA MEJORADA: Persistente y consistente
const matricularse = async () => {
  try {
    matriculando.value = true
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Guardar en localStorage
    const key = `matricula_${authStore.user.id}_${curso.value.id}`
    localStorage.setItem(key, 'true')
    
    estoyMatriculado.value = true
    
    // Crear notificación de éxito (sin alert)
    console.log('✅ Matriculado exitosamente en:', curso.value.titulo)
  } catch (error) {
    console.error('Error matriculándose:', error)
  } finally {
    matriculando.value = false
  }
}

const desmatricularse = async () => {
  if (!confirm('¿Estás seguro de que deseas desmatricularte de este curso?')) return
  
  try {
    matriculando.value = true
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Eliminar de localStorage
    const key = `matricula_${authStore.user.id}_${curso.value.id}`
    localStorage.removeItem(key)
    
    estoyMatriculado.value = false
    
    console.log('✅ Desmatriculado de:', curso.value.titulo)
  } catch (error) {
    console.error('Error desmatriculándose:', error)
  } finally {
    matriculando.value = false
  }
}

// Función para activar/desactivar curso (solo para administradores)
const toggleActivoCurso = async () => {
  if (!curso.value) return
  
  const confirmacion = curso.value.activo
    ? confirm('¿Estás seguro de que deseas desactivar este curso?')
    : confirm('¿Estás seguro de que deseas activar este curso?')
  
  if (!confirmacion) return
  
  try {
    const nuevoEstado = !curso.value.activo
    const estadoAnterior = curso.value.activo
    
    // Optimistic update
    curso.value.activo = nuevoEstado
    
    try {
      // Llamar a la API
      await api.patch(`/cursos/${curso.value.id}`, { activo: nuevoEstado })
    } catch (error) {
      // Revertir en caso de error
      curso.value.activo = estadoAnterior
      console.error('Error al actualizar el curso:', error)
      alert('Hubo un error al actualizar el estado del curso')
    }
  } catch (error) {
    console.error('Error al cambiar estado del curso:', error)
    alert('Hubo un error al cambiar el estado del curso')
  }
}

onMounted(async () => {
  await Promise.all([
    cargarCurso(),
    cargarClases(),
    cargarMensajes()
  ])
  loading.value = false
  
  // ✅ Verificar matrícula de forma consistente
  estoyMatriculado.value = verificarMatricula()
  
  // Si es docente y creador, cargar estudiantes y entregas
  if (soyDocenteYcreador.value) {
    await Promise.all([
      cargarEstudiantes(),
      cargarEntregas()
    ])
  }
})

// Cargar entregas del curso
const cargarEntregas = async () => {
  if (!curso.value) return
  
  try {
    cargandoEntregas.value = true
    
    try {
      const response = await api.get(`/cursos/${curso.value.id}/entregas`)
      entregasData.value = response.data
      
      // Inicializar calificaciones con los valores actuales
      entregasData.value.entregas.forEach(grupo => {
        grupo.entregas.forEach(entrega => {
          if (entrega.calificacion !== null && entrega.calificacion !== undefined) {
            calificaciones.value[entrega.id] = entrega.calificacion
          }
        })
      })
    } catch (error) {
      console.error('Error cargando entregas:', error)
      // Si falla, inicializar como vacío
      entregasData.value = {
        curso: { id: curso.value.id, titulo: curso.value.titulo, codigo: curso.value.codigo },
        entregas: [],
        total: 0
      }
    }
  } catch (error) {
    console.error('Error cargando entregas:', error)
  } finally {
    cargandoEntregas.value = false
  }
}

// Calificar una entrega
const calificarEntrega = async (entrega, puntajeMaximo) => {
  if (!calificaciones.value[entrega.id] && calificaciones.value[entrega.id] !== 0) {
    alert('Por favor ingresa una calificación')
    return
  }
  
  const calificacion = calificaciones.value[entrega.id]
  
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
    
    // Recargar entregas para actualizar estadísticas
    await cargarEntregas()
    
    alert('Entrega calificada exitosamente')
  } catch (error) {
    console.error('Error calificando entrega:', error)
    alert('Error al calificar la entrega. Por favor, intenta nuevamente.')
  } finally {
    calificando.value[entrega.id] = false
  }
}

// Descargar archivo de entrega
const descargarEntrega = async (entrega) => {
  try {
    // Si hay un archivo, intentar descargarlo
    if (entrega.archivoUrl) {
      // Por ahora solo mostrar un mensaje, ya que necesitarías una URL de descarga real
      alert('Funcionalidad de descarga pendiente de implementar con el sistema de almacenamiento')
    }
  } catch (error) {
    console.error('Error descargando entrega:', error)
    alert('Error al descargar el archivo')
  }
}
</script>

<style scoped>
.mensajes-container::-webkit-scrollbar {
  width: 6px;
}

.mensajes-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.mensajes-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

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