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
                  <i class="bi bi-clipboard-check-fill me-2"></i>Tareas
                </h1>
                <p class="text-muted mb-0 fs-5">Gestiona tus tareas asignadas y entregas</p>
              </div>
              <RouterLink
                v-if="authStore.isAdmin || authStore.isDocente"
                to="/tareas/crear"
                class="btn btn-gradient hover-lift"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Crear Tarea
              </RouterLink>
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
              <option value="">Todas las tareas</option>
              <option value="pendiente">Pendientes</option>
              <option value="entregada">Entregadas</option>
              <option value="calificada">Calificadas</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.2s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-sort-down me-1"></i>Ordenar por
            </label>
            <select v-model="ordenamiento" class="form-select border-0 bg-transparent" @change="aplicarFiltros">
              <option value="fecha">Fecha límite</option>
              <option value="titulo">Título</option>
              <option value="puntaje">Puntaje</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de tareas -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando tareas...</p>
      </div>

      <div v-else-if="tareasFiltradas.length === 0" class="text-center py-5">
        <div class="glass-effect p-5 animate-bounce-in">
          <div class="mb-4">
            <i class="bi bi-clipboard-x text-muted" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-muted mb-3">No hay tareas disponibles</h4>
          <p class="text-muted mb-4">Las tareas aparecerán aquí cuando estén asignadas</p>
          <RouterLink
            v-if="authStore.isAdmin || authStore.isDocente"
            to="/tareas/crear"
            class="btn btn-gradient"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Crear Primera Tarea
          </RouterLink>
        </div>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="(tarea, index) in tareasFiltradas"
          :key="tarea.id"
          class="col-lg-6"
        >
          <div class="card-hover h-100 animate-bounce-in" :style="{ animationDelay: `${0.3 + index * 0.1}s` }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <h5 class="card-title mb-0 fw-bold">{{ tarea.titulo }}</h5>
                    <span
                      class="badge px-3 py-2"
                      :class="getEstadoBadgeClass(tarea.estado)"
                    >
                      <i class="bi" :class="getEstadoIcon(tarea.estado) + ' me-1'"></i>
                      {{ getEstadoText(tarea.estado) }}
                    </span>
                  </div>
                  <small class="text-muted fw-semibold">
                    <i class="bi bi-book me-1"></i>{{ tarea.curso.titulo }}
                  </small>
                </div>
                <div class="rounded-circle bg-primary bg-opacity-10 p-2">
                  <i class="bi bi-clipboard-check text-primary fs-5"></i>
                </div>
              </div>
              
              <p class="card-text text-muted mb-4">{{ tarea.descripcion }}</p>
              
              <div class="row g-3 mb-4">
                <div class="col-6">
                  <div class="glass-effect p-3 rounded-3 text-center">
                    <i class="bi bi-calendar-event text-primary mb-1 d-block"></i>
                    <small class="text-muted d-block">Fecha límite</small>
                    <strong class="small">{{ formatDate(tarea.fechaLimite) }}</strong>
                  </div>
                </div>
                <div class="col-6">
                  <div class="glass-effect p-3 rounded-3 text-center">
                    <i class="bi bi-star-fill text-warning mb-1 d-block"></i>
                    <small class="text-muted d-block">Puntaje</small>
                    <strong class="small">{{ tarea.puntaje }} pts</strong>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-wrap gap-3 mb-4 text-muted small">
                <span v-if="tarea._count?.entregas > 0">
                  <i class="bi bi-file-earmark-check me-1"></i>{{ tarea._count.entregas }} entregas
                </span>
                <span v-if="tarea.entrega?.calificacion">
                  <i class="bi bi-award me-1"></i>Calificación: {{ tarea.entrega.calificacion }}/{{ tarea.puntaje }}
                </span>
                <span :class="getDiasRestantesClass(tarea.fechaLimite)">
                  <i class="bi bi-clock me-1"></i>{{ getDiasRestantes(tarea.fechaLimite) }}
                </span>
              </div>
              
              <div class="d-flex gap-2">
                <RouterLink
                  :to="`/tareas/${tarea.id}`"
                  class="btn btn-gradient flex-grow-1"
                >
                  <i class="bi bi-eye me-2"></i>Ver Detalles
                </RouterLink>
                <button
                  v-if="authStore.isEstudiante && !tarea.entrega"
                  @click="entregarRapido(tarea.id)"
                  class="btn btn-success"
                  :disabled="yaVencio(tarea.fechaLimite)"
                >
                  <i class="bi bi-upload"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="meta.totalPages > 1" class="d-flex justify-content-center mt-5">
        <nav>
          <ul class="pagination glass-effect p-2 rounded-3">
            <li class="page-item" :class="{ disabled: meta.page === 1 }">
              <button @click="cambiarPagina(meta.page - 1)" class="page-link border-0 rounded-2 mx-1">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li
              v-for="page in meta.totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === meta.page }"
            >
              <button
                @click="cambiarPagina(page)"
                class="page-link border-0 rounded-2 mx-1"
                :class="{ 'btn-gradient text-white': page === meta.page }"
              >
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: meta.page === meta.totalPages }">
              <button @click="cambiarPagina(meta.page + 1)" class="page-link border-0 rounded-2 mx-1">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const router = useRouter()
const loading = ref(true)
const tareas = ref([])
const cursos = ref([])
const meta = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1
})
const filtroCurso = ref('')
const filtroEstado = ref('')
const ordenamiento = ref('fecha')

const tareasFiltradas = computed(() => {
  let resultado = [...tareas.value]
  
  // Filtrar por curso
  if (filtroCurso.value) {
    resultado = resultado.filter(t => t.curso.id === parseInt(filtroCurso.value))
  }
  
  // Filtrar por estado
  if (filtroEstado.value) {
    const estadoMap = {
      'pendiente': 'PENDIENTE',
      'entregada': 'ENTREGADA',
      'calificada': 'CALIFICADA'
    }
    resultado = resultado.filter(t => t.estado === estadoMap[filtroEstado.value])
  }
  
  // Ordenar
  resultado.sort((a, b) => {
    switch (ordenamiento.value) {
      case 'fecha':
        return new Date(a.fechaLimite) - new Date(b.fechaLimite)
      case 'titulo':
        return a.titulo.localeCompare(b.titulo)
      case 'puntaje':
        return b.puntaje - a.puntaje
      default:
        return 0
    }
  })
  
  return resultado
})

const getEstadoBadgeClass = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'bg-warning bg-opacity-10 text-warning'
    case 'ENTREGADA': return 'bg-info bg-opacity-10 text-info'
    case 'CALIFICADA': return 'bg-success bg-opacity-10 text-success'
    default: return 'bg-secondary bg-opacity-10 text-secondary'
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

const getEstadoText = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente'
    case 'ENTREGADA': return 'Entregada'
    case 'CALIFICADA': return 'Calificada'
    default: return 'Desconocido'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
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

const getDiasRestantesClass = (fechaLimite) => {
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diferencia = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
  
  if (diferencia < 0) return 'text-danger fw-bold'
  if (diferencia <= 2) return 'text-warning fw-bold'
  return 'text-muted'
}

const yaVencio = (fechaLimite) => {
  return new Date(fechaLimite) < new Date()
}

const cargarTareas = async () => {
  try {
    loading.value = true
    
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Datos demo con variedad
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
        entrega: null
      },
      {
        id: 2,
        titulo: 'Proyecto Final - Sistema de Gestión',
        descripcion: 'Diseñar e implementar una base de datos completa para un sistema de gestión de biblioteca',
        estado: 'ENTREGADA',
        fechaLimite: '2024-02-15',
        puntaje: 200,
        curso: { id: 2, titulo: 'Base de Datos' },
        _count: { entregas: 18 },
        entrega: { id: 1, calificacion: null }
      },
      {
        id: 3,
        titulo: 'Sitio Web Responsivo con Bootstrap',
        descripcion: 'Crear un sitio web profesional que se adapte a diferentes dispositivos usando Bootstrap 5',
        estado: 'CALIFICADA',
        fechaLimite: '2024-01-30',
        puntaje: 150,
        curso: { id: 3, titulo: 'Desarrollo Web' },
        _count: { entregas: 22 },
        entrega: { id: 2, calificacion: 142 }
      },
      {
        id: 4,
        titulo: 'Implementación de Algoritmos de Ordenamiento',
        descripcion: 'Implementar y comparar algoritmos: QuickSort, MergeSort y HeapSort',
        estado: 'PENDIENTE',
        fechaLimite: '2024-02-28',
        puntaje: 180,
        curso: { id: 4, titulo: 'Algoritmos y Estructuras de Datos' },
        _count: { entregas: 12 },
        entrega: null
      },
      {
        id: 5,
        titulo: 'API RESTful con Node.js',
        descripcion: 'Crear una API REST completa con autenticación JWT y operaciones CRUD',
        estado: 'ENTREGADA',
        fechaLimite: '2024-02-10',
        puntaje: 220,
        curso: { id: 1, titulo: 'Introducción a la Programación' },
        _count: { entregas: 20 },
        entrega: { id: 3, calificacion: null }
      },
      {
        id: 6,
        titulo: 'Modelo Entidad-Relación Avanzado',
        descripcion: 'Diseñar un diagrama ER completo para un sistema hospitalario',
        estado: 'CALIFICADA',
        fechaLimite: '2024-01-25',
        puntaje: 160,
        curso: { id: 2, titulo: 'Base de Datos' },
        _count: { entregas: 25 },
        entrega: { id: 4, calificacion: 148 }
      },
      {
        id: 7,
        titulo: 'Portfolio Personal Interactivo',
        descripcion: 'Desarrollar un portfolio personal con animaciones CSS y JavaScript',
        estado: 'PENDIENTE',
        fechaLimite: '2024-02-22',
        puntaje: 130,
        curso: { id: 3, titulo: 'Desarrollo Web' },
        _count: { entregas: 8 },
        entrega: null
      },
      {
        id: 8,
        titulo: 'Árbol Binario de Búsqueda',
        descripcion: 'Implementar un ABB con operaciones de inserción, búsqueda y eliminación',
        estado: 'PENDIENTE',
        fechaLimite: '2024-03-05',
        puntaje: 170,
        curso: { id: 4, titulo: 'Algoritmos y Estructuras de Datos' },
        _count: { entregas: 5 },
        entrega: null
      }
    ]
    
    tareas.value = tareasDemo
    
    meta.value = {
      total: tareasDemo.length,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  } catch (error) {
    console.error('Error cargando tareas:', error)
  } finally {
    loading.value = false
  }
}

const cargarCursos = async () => {
  try {
    cursos.value = [
      { id: 1, titulo: 'Introducción a la Programación' },
      { id: 2, titulo: 'Base de Datos' },
      { id: 3, titulo: 'Desarrollo Web' },
      { id: 4, titulo: 'Algoritmos y Estructuras de Datos' }
    ]
  } catch (error) {
    console.error('Error cargando cursos:', error)
  }
}

const aplicarFiltros = () => {
  // Los filtros se aplican automáticamente mediante computed
}

const cambiarPagina = (page) => {
  if (page >= 1 && page <= meta.value.totalPages) {
    meta.value.page = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const entregarRapido = (tareaId) => {
  router.push(`/tareas/${tareaId}`)
}

onMounted(() => {
  Promise.all([
    cargarTareas(),
    cargarCursos()
  ])
})
</script>