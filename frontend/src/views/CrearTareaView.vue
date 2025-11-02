<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex align-items-center gap-3">
              <RouterLink to="/tareas" class="btn btn-light btn-sm">
                <i class="bi bi-arrow-left me-2"></i>Volver
              </RouterLink>
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  <i class="bi bi-plus-circle-fill me-2"></i>Crear Nueva Tarea
                </h1>
                <p class="text-muted mb-0">Asigna una nueva tarea para tus estudiantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="glass-effect p-5 animate-slide-in">
            <form @submit.prevent="crearTarea">
              <!-- Título -->
              <div class="mb-4">
                <label for="titulo" class="form-label fw-semibold">
                  <i class="bi bi-clipboard-check me-2"></i>Título de la Tarea <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  v-model="formulario.titulo"
                  class="form-control border-0 bg-transparent"
                  placeholder="Ej: Ejercicio de Variables y Tipos de Datos"
                  required
                />
              </div>

              <!-- Curso -->
              <div class="mb-4">
                <label for="cursoId" class="form-label fw-semibold">
                  <i class="bi bi-book me-2"></i>Curso <span class="text-danger">*</span>
                </label>
                <select
                  id="cursoId"
                  v-model="formulario.cursoId"
                  class="form-select border-0 bg-transparent"
                  required
                >
                  <option value="">Selecciona un curso</option>
                  <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                    {{ curso.codigo }} - {{ curso.titulo }}
                  </option>
                </select>
              </div>

              <!-- Descripción -->
              <div class="mb-4">
                <label for="descripcion" class="form-label fw-semibold">
                  <i class="bi bi-file-text me-2"></i>Descripción
                </label>
                <textarea
                  id="descripcion"
                  v-model="formulario.descripcion"
                  class="form-control border-0 bg-transparent"
                  rows="5"
                  placeholder="Describe la tarea y los requisitos que deben cumplir los estudiantes..."
                ></textarea>
              </div>

              <!-- Fecha Límite -->
              <div class="mb-4">
                <label for="fechaLimite" class="form-label fw-semibold">
                  <i class="bi bi-calendar-event me-2"></i>Fecha Límite <span class="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="fechaLimite"
                  v-model="formulario.fechaLimite"
                  class="form-control border-0 bg-transparent"
                  required
                  :min="fechaMinima"
                />
                <small class="text-muted">La fecha debe ser futura</small>
              </div>

              <!-- Puntaje -->
              <div class="mb-4">
                <label for="puntaje" class="form-label fw-semibold">
                  <i class="bi bi-star-fill me-2"></i>Puntaje Máximo <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="puntaje"
                  v-model.number="formulario.puntaje"
                  class="form-control border-0 bg-transparent"
                  placeholder="100"
                  required
                  min="1"
                  step="1"
                />
                <small class="text-muted">Puntos que valdrá esta tarea</small>
              </div>

              <!-- Clase (opcional) -->
              <div class="mb-4">
                <label for="claseId" class="form-label fw-semibold">
                  <i class="bi bi-collection-play me-2"></i>Clase (Opcional)
                </label>
                <select
                  id="claseId"
                  v-model="formulario.claseId"
                  class="form-select border-0 bg-transparent"
                  :disabled="!formulario.cursoId"
                >
                  <option value="">No asociar a ninguna clase</option>
                  <option v-for="clase in clasesFiltradas" :key="clase.id" :value="clase.id">
                    {{ clase.titulo }}
                  </option>
                </select>
                <small class="text-muted">Opcional: Asocia esta tarea a una clase específica</small>
              </div>

              <!-- Botones -->
              <div class="d-flex gap-3 mt-5">
                <button
                  type="submit"
                  class="btn btn-gradient flex-grow-1"
                  :disabled="guardando"
                >
                  <i class="bi bi-check-circle me-2"></i>
                  {{ guardando ? 'Creando...' : 'Crear Tarea' }}
                </button>
                <RouterLink to="/tareas" class="btn btn-light">
                  <i class="bi bi-x-circle me-2"></i>Cancelar
                </RouterLink>
              </div>

              <!-- Mensajes de error -->
              <div v-if="error" class="alert alert-danger mt-4">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import { api } from '@/services/api'
import Layout from '../components/Layout.vue'

const router = useRouter()
const guardando = ref(false)
const error = ref(null)
const cursos = ref([])
const clases = ref([])

const formulario = ref({
  titulo: '',
  descripcion: '',
  fechaLimite: '',
  puntaje: 100,
  cursoId: '',
  claseId: ''
})

const fechaMinima = computed(() => {
  const ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset())
  return ahora.toISOString().slice(0, 16)
})

const clasesFiltradas = computed(() => {
  if (!formulario.value.cursoId) return []
  return clases.value.filter(c => c.cursoId === parseInt(formulario.value.cursoId))
})

const cargarCursos = async () => {
  try {
    const DEMO_MODE = true // Basado en authStore
    
    if (DEMO_MODE) {
      // Datos demo
      cursos.value = [
        { id: 1, codigo: 'PROG-101', titulo: 'Introducción a la Programación' },
        { id: 2, codigo: 'BD-201', titulo: 'Base de Datos' },
        { id: 3, codigo: 'WEB-301', titulo: 'Desarrollo Web' }
      ]
      clases.value = [
        { id: 1, titulo: 'Variables y Tipos de Datos', cursoId: 1 },
        { id: 2, titulo: 'Estructuras de Control', cursoId: 1 },
        { id: 3, titulo: 'Modelo Entidad-Relación', cursoId: 2 }
      ]
      return
    }

    const response = await api.get('/cursos?activo=true')
    cursos.value = response.data.data || response.data
    
    // Cargar clases si hay cursos
    if (cursos.value.length > 0 && formulario.value.cursoId) {
      await cargarClases(formulario.value.cursoId)
    }
  } catch (err) {
    console.error('Error cargando cursos:', err)
    error.value = 'Error al cargar los cursos'
  }
}

const cargarClases = async (cursoId) => {
  try {
    const DEMO_MODE = true
    
    if (DEMO_MODE) {
      clases.value = [
        { id: 1, titulo: 'Variables y Tipos de Datos', cursoId: 1 },
        { id: 2, titulo: 'Estructuras de Control', cursoId: 1 },
        { id: 3, titulo: 'Modelo Entidad-Relación', cursoId: 2 }
      ].filter(c => c.cursoId === parseInt(cursoId))
      return
    }

    const response = await api.get(`/cursos/${cursoId}/clases`)
    clases.value = response.data
  } catch (err) {
    console.error('Error cargando clases:', err)
    clases.value = []
  }
}

// Observar cambios en cursoId para cargar clases
watch(() => formulario.value.cursoId, (nuevoCursoId) => {
  if (nuevoCursoId) {
    cargarClases(nuevoCursoId)
    // Resetear claseId si cambia el curso
    formulario.value.claseId = ''
  } else {
    clases.value = []
  }
})

const crearTarea = async () => {
  try {
    guardando.value = true
    error.value = null

    // Validar que la fecha sea futura
    const fechaLimite = new Date(formulario.value.fechaLimite)
    const ahora = new Date()
    if (fechaLimite <= ahora) {
      error.value = 'La fecha límite debe ser una fecha futura'
      guardando.value = false
      return
    }

    const datosTarea = {
      titulo: formulario.value.titulo.trim(),
      descripcion: formulario.value.descripcion.trim() || null,
      fechaLimite: fechaLimite.toISOString(),
      puntaje: formulario.value.puntaje,
      cursoId: parseInt(formulario.value.cursoId),
      claseId: formulario.value.claseId ? parseInt(formulario.value.claseId) : null
    }

    const DEMO_MODE = true // Basado en authStore

    if (DEMO_MODE) {
      // Simular creación en modo demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Tarea creada exitosamente (modo demo)')
      router.push('/tareas')
      return
    }

    // Crear tarea en backend real
    const response = await api.post('/tareas', datosTarea)
    
    if (response.data) {
      alert('Tarea creada exitosamente')
      router.push(`/tareas/${response.data.id}`)
    }
  } catch (err) {
    console.error('Error creando tarea:', err)
    error.value = err.response?.data?.message || 'Error al crear la tarea. Por favor, intenta nuevamente.'
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  // Verificar permisos (solo DOCENTE puede crear tareas)
  if (!authStore.isDocente) {
    router.push('/tareas')
  }
  cargarCursos()
})
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}
</style>

