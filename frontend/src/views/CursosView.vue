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
                  <i class="bi bi-book-fill me-2"></i>Catálogo de Cursos
                </h1>
                <p class="text-muted mb-0 fs-5">Explora todos los cursos disponibles y comienza tu aprendizaje</p>
              </div>
              <RouterLink
                v-if="authStore.isAdmin"
                to="/cursos/crear"
                class="btn btn-gradient hover-lift"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Crear Curso
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in">
            <i class="bi bi-book-fill text-primary fs-3 mb-2"></i>
            <h4 class="mb-0">{{ cursosStats.total }}</h4>
            <small class="text-muted">Total de Cursos</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in" style="animation-delay: 0.1s;">
            <i class="bi bi-check-circle-fill text-success fs-3 mb-2"></i>
            <h4 class="mb-0">{{ cursosStats.activos }}</h4>
            <small class="text-muted">Cursos Activos</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in" style="animation-delay: 0.2s;">
            <i class="bi bi-people-fill text-info fs-3 mb-2"></i>
            <h4 class="mb-0">{{ cursosStats.estudiantes }}</h4>
            <small class="text-muted">Estudiantes Activos</small>
          </div>
        </div>
        <div class="col-md-3">
          <div class="glass-effect p-3 text-center animate-bounce-in" style="animation-delay: 0.3s;">
            <i class="bi bi-star-fill text-warning fs-3 mb-2"></i>
            <h4 class="mb-0">4.8</h4>
            <small class="text-muted">Calificación Promedio</small>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-funnel me-1"></i>Filtrar cursos
            </label>
            <select v-model="filtroActivo" class="form-select border-0 bg-transparent" @change="aplicarFiltros">
              <option value="">Todos los cursos</option>
              <option value="true">Cursos activos</option>
              <option value="false">Cursos inactivos</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.1s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-search me-1"></i>Buscar
            </label>
            <input 
              type="text" 
              v-model="busqueda"
              class="form-control border-0 bg-transparent" 
              placeholder="Buscar por título o código..."
              @input="aplicarFiltros">
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.2s;">
            <label class="form-label fw-semibold mb-2">
              <i class="bi bi-sort-down me-1"></i>Ordenar por
            </label>
            <select v-model="ordenamiento" class="form-select border-0 bg-transparent" @change="aplicarFiltros">
              <option value="recientes">Más recientes</option>
              <option value="alfabetico">Alfabético</option>
              <option value="estudiantes">Más estudiantes</option>
              <option value="clases">Más clases</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de cursos -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando cursos...</p>
      </div>

      <div v-else-if="cursosFiltrados.length === 0" class="text-center py-5">
        <div class="glass-effect p-5 animate-bounce-in">
          <div class="mb-4">
            <i class="bi bi-book text-muted" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-muted mb-3">No hay cursos disponibles</h4>
          <p class="text-muted mb-4">
            {{ busqueda ? 'No se encontraron cursos con ese criterio de búsqueda' : 'Parece que no hay cursos para mostrar en este momento' }}
          </p>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/cursos/crear"
            class="btn btn-gradient"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Crear Primer Curso
          </RouterLink>
        </div>
      </div>

      <div v-else class="row g-4">
        <div
          v-for="(curso, index) in cursosFiltrados"
          :key="curso.id"
          class="col-md-6 col-lg-4"
        >
          <div class="card-hover h-100 animate-bounce-in" :style="{ animationDelay: `${0.4 + index * 0.05}s` }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="flex-grow-1">
                  <h5 class="card-title mb-1 fw-bold text-gradient">{{ curso.titulo }}</h5>
                  <small class="text-muted fw-semibold">
                    <i class="bi bi-tag me-1"></i>{{ curso.codigo }}
                  </small>
                </div>
                <span
                  class="badge rounded-pill px-3 py-2"
                  :class="curso.activo ? 'bg-success' : 'bg-danger'"
                >
                  <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>
                  {{ curso.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <p class="card-text text-muted mb-4" style="line-height: 1.6; min-height: 60px;">
                {{ curso.descripcion || 'Sin descripción disponible' }}
              </p>

              <div class="row g-3 mb-4">
                <div class="col-6">
                  <div class="glass-effect p-2 rounded-3 text-center">
                    <i class="bi bi-people-fill text-primary"></i>
                    <span class="ms-2 fw-semibold">{{ curso._count.matriculas }}</span>
                    <small class="d-block text-muted">estudiantes</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="glass-effect p-2 rounded-3 text-center">
                    <i class="bi bi-collection-play-fill text-info"></i>
                    <span class="ms-2 fw-semibold">{{ curso._count.clases }}</span>
                    <small class="d-block text-muted">clases</small>
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                  <i class="bi bi-person-badge text-primary"></i>
                </div>
                <div class="flex-grow-1">
                  <small class="text-muted d-block">Instructor</small>
                  <small class="fw-semibold">{{ curso.creador.nombre }} {{ curso.creador.apellido }}</small>
                </div>
              </div>

              <div class="d-grid gap-2">
                <RouterLink
                  :to="`/cursos/${curso.id}`"
                  class="btn btn-gradient hover-lift"
                >
                  <i class="bi bi-arrow-right me-2"></i>
                  Ver Curso
                </RouterLink>
                <button
                  v-if="authStore.isAdmin"
                  @click="toggleActivoCurso(curso.id, !curso.activo)"
                  :class="curso.activo ? 'btn btn-outline-danger hover-lift' : 'btn btn-outline-success hover-lift'"
                >
                  <i :class="curso.activo ? 'bi bi-pause-circle' : 'bi bi-play-circle'" class="me-2"></i>
                  {{ curso.activo ? 'Desactivar' : 'Activar' }}
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
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'
import { api } from '../services/api'

const loading = ref(true)
const cursos = ref([])
const meta = ref({
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1
})
const filtroActivo = ref('')
const busqueda = ref('')
const ordenamiento = ref('recientes')

const cursosStats = computed(() => {
  return {
    total: cursos.value.length,
    activos: cursos.value.filter(c => c.activo).length,
    estudiantes: cursos.value.reduce((sum, c) => sum + c._count.matriculas, 0)
  }
})

const cursosFiltrados = computed(() => {
  let resultado = [...cursos.value]
  
  // Filtrar por estado activo/inactivo
  if (filtroActivo.value !== '') {
    const activo = filtroActivo.value === 'true'
    resultado = resultado.filter(c => c.activo === activo)
  }
  
  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const searchTerm = busqueda.value.toLowerCase()
    resultado = resultado.filter(c => 
      c.titulo.toLowerCase().includes(searchTerm) ||
      c.codigo.toLowerCase().includes(searchTerm) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(searchTerm))
    )
  }
  
  // Ordenar
  resultado.sort((a, b) => {
    switch (ordenamiento.value) {
      case 'alfabetico':
        return a.titulo.localeCompare(b.titulo)
      case 'estudiantes':
        return b._count.matriculas - a._count.matriculas
      case 'clases':
        return b._count.clases - a._count.clases
      case 'recientes':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
  
  return resultado
})

const cargarCursos = async () => {
  try {
    loading.value = true
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Datos de ejemplo para demo con más variedad
    let cursosDemo = [
      {
        id: 1,
        titulo: 'Introducción a la Programación',
        codigo: 'PROG-101',
        descripcion: 'Aprende los fundamentos de la programación con ejemplos prácticos y ejercicios interactivos',
        activo: true,
        creador: { id: 2, nombre: 'Juan', apellido: 'Pérez' },
        _count: { clases: 12, matriculas: 45 },
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        titulo: 'Base de Datos Avanzada',
        codigo: 'BD-301',
        descripcion: 'Diseño, implementación y optimización de bases de datos relacionales y NoSQL',
        activo: true,
        creador: { id: 2, nombre: 'Juan', apellido: 'Pérez' },
        _count: { clases: 10, matriculas: 32 },
        createdAt: '2024-01-10'
      },
      {
        id: 3,
        titulo: 'Desarrollo Web Full Stack',
        codigo: 'WEB-401',
        descripcion: 'Domina el desarrollo web completo: frontend, backend, bases de datos y despliegue',
        activo: false,
        creador: { id: 2, nombre: 'Juan', apellido: 'Pérez' },
        _count: { clases: 18, matriculas: 28 },
        createdAt: '2024-01-20'
      },
      {
        id: 4,
        titulo: 'Algoritmos y Estructuras de Datos',
        codigo: 'ALG-201',
        descripcion: 'Estudio profundo de algoritmos eficientes y estructuras de datos fundamentales',
        activo: true,
        creador: { id: 4, nombre: 'Ana', apellido: 'Martínez' },
        _count: { clases: 14, matriculas: 38 },
        createdAt: '2024-01-08'
      },
      {
        id: 5,
        titulo: 'Machine Learning Fundamentals',
        codigo: 'ML-501',
        descripcion: 'Introducción al aprendizaje automático: teoría, práctica y casos de uso reales',
        activo: true,
        creador: { id: 5, nombre: 'Pedro', apellido: 'Ramírez' },
        _count: { clases: 16, matriculas: 28 },
        createdAt: '2024-01-25'
      },
      {
        id: 6,
        titulo: 'Desarrollo Móvil con React Native',
        codigo: 'MOV-301',
        descripcion: 'Crea aplicaciones móviles nativas para iOS y Android con React Native',
        activo: true,
        creador: { id: 6, nombre: 'Laura', apellido: 'Torres' },
        _count: { clases: 15, matriculas: 35 },
        createdAt: '2024-01-18'
      },
      {
        id: 7,
        titulo: 'Ciberseguridad y Ethical Hacking',
        codigo: 'SEC-401',
        descripcion: 'Aprende a proteger sistemas y aplicaciones contra amenazas cibernéticas',
        activo: true,
        creador: { id: 7, nombre: 'Miguel', apellido: 'Sánchez' },
        _count: { clases: 20, matriculas: 42 },
        createdAt: '2024-01-12'
      },
      {
        id: 8,
        titulo: 'Cloud Computing con AWS',
        codigo: 'CLOUD-501',
        descripcion: 'Domina los servicios en la nube de Amazon Web Services desde cero',
        activo: true,
        creador: { id: 8, nombre: 'Sofia', apellido: 'González' },
        _count: { clases: 12, matriculas: 30 },
        createdAt: '2024-01-22'
      },
      {
        id: 9,
        titulo: 'UI/UX Design Masterclass',
        codigo: 'DES-201',
        descripcion: 'Diseña interfaces intuitivas y experiencias de usuario memorables',
        activo: true,
        creador: { id: 9, nombre: 'Andrea', apellido: 'Ruiz' },
        _count: { clases: 14, matriculas: 40 },
        createdAt: '2024-01-16'
      },
      {
        id: 10,
        titulo: 'Python para Data Science',
        codigo: 'PY-301',
        descripcion: 'Análisis de datos, visualización y machine learning con Python',
        activo: false,
        creador: { id: 10, nombre: 'Roberto', apellido: 'Díaz' },
        _count: { clases: 18, matriculas: 25 },
        createdAt: '2023-12-20'
      },
      {
        id: 11,
        titulo: 'DevOps y CI/CD',
        codigo: 'OPS-401',
        descripcion: 'Automatización, integración y despliegue continuo de aplicaciones',
        activo: true,
        creador: { id: 11, nombre: 'Elena', apellido: 'Vargas' },
        _count: { clases: 16, matriculas: 33 },
        createdAt: '2024-01-14'
      },
      {
        id: 12,
        titulo: 'Blockchain y Criptomonedas',
        codigo: 'BC-501',
        descripcion: 'Fundamentos de blockchain, smart contracts y desarrollo de DApps',
        activo: true,
        creador: { id: 12, nombre: 'Diego', apellido: 'Morales' },
        _count: { clases: 12, matriculas: 22 },
        createdAt: '2024-01-19'
      }
    ]
    
    // ✅ Filtrar cursos si es docente
    if (authStore.isDocente) {
      cursosDemo = cursosDemo.filter(curso => curso.creador.id === authStore.user.id)
    }
    
    cursos.value = cursosDemo
    
    meta.value = {
      total: cursosDemo.length,
      page: 1,
      limit: 12,
      totalPages: Math.ceil(cursosDemo.length / 12)
    }
  } catch (error) {
    console.error('Error cargando cursos:', error)
  } finally {
    loading.value = false
  }
}

const aplicarFiltros = () => {
  // Los filtros se aplican automáticamente mediante computed
  meta.value.page = 1 // Resetear a primera página al filtrar
}

const cambiarPagina = (page) => {
  if (page >= 1 && page <= meta.value.totalPages) {
    meta.value.page = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const toggleActivoCurso = async (cursoId, nuevoEstado) => {
  try {
    const curso = cursos.value.find(c => c.id === cursoId)
    if (!curso) return
    
    const estadoAnterior = curso.activo
    
    // Optimistic update
    curso.activo = nuevoEstado
    
    try {
      // Llamar a la API
      await api.patch(`/cursos/${cursoId}`, { activo: nuevoEstado })
    } catch (error) {
      // Revertir en caso de error
      curso.activo = estadoAnterior
      console.error('Error al actualizar el curso:', error)
      alert('Hubo un error al actualizar el estado del curso')
    }
  } catch (error) {
    console.error('Error al cambiar estado del curso:', error)
    alert('Hubo un error al cambiar el estado del curso')
  }
}

onMounted(() => {
  cargarCursos()
})
</script>