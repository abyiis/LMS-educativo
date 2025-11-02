<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <h1 class="h2 mb-2 text-gradient">
              <i class="bi bi-speedometer2 me-2"></i>Panel de Administración
            </h1>
            <p class="text-muted mb-0 fs-5">Estadísticas y gestión del sistema</p>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando estadísticas...</p>
      </div>

      <div v-else class="row g-4 mb-5">
        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Total Usuarios</p>
                  <p class="h3 mb-0 text-primary fw-bold">{{ stats.resumen.totalUsuarios }}</p>
                  <small class="text-success">
                    <i class="bi bi-arrow-up me-1"></i>+5 este mes
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-3">
                    <i class="bi bi-people-fill text-primary fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Total Cursos</p>
                  <p class="h3 mb-0 text-success fw-bold">{{ stats.resumen.totalCursos }}</p>
                  <small class="text-success">
                    <i class="bi bi-arrow-up me-1"></i>+2 este mes
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-success bg-opacity-10 p-3">
                    <i class="bi bi-book-fill text-success fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Total Tareas</p>
                  <p class="h3 mb-0 text-warning fw-bold">{{ stats.resumen.totalTareas }}</p>
                  <small class="text-info">
                    <i class="bi bi-graph-up me-1"></i>Activas
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-3">
                    <i class="bi bi-clipboard-check-fill text-warning fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="text-muted mb-1 fw-semibold">Total Mensajes</p>
                  <p class="h3 mb-0 text-info fw-bold">{{ stats.resumen.totalMensajes }}</p>
                  <small class="text-muted">
                    <i class="bi bi-chat-dots me-1"></i>Conversaciones
                  </small>
                </div>
                <div class="flex-shrink-0">
                  <div class="rounded-circle bg-info bg-opacity-10 p-3">
                    <i class="bi bi-chat-dots-fill text-info fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Usuarios por rol -->
      <div class="card-hover mb-5 animate-slide-in" style="animation-delay: 0.4s;">
        <div class="card-header border-0 bg-transparent p-4">
          <h5 class="mb-0 text-gradient">
            <i class="bi bi-pie-chart-fill me-2"></i>Usuarios por Rol
          </h5>
        </div>
        <div class="card-body p-4">
          <div class="row g-4">
            <div
              v-for="rol in stats.usuariosPorRol"
              :key="rol.rol"
              class="col-md-4">
              <div class="glass-effect p-4 rounded-3 text-center hover-lift">
                <div class="rounded-circle mx-auto mb-3 d-inline-flex align-items-center justify-content-center"
                     :class="getRolBgClass(rol.rol)"
                     style="width: 60px; height: 60px;">
                  <i class="fs-3" :class="getRolIconClass(rol.rol)"></i>
                </div>
                <h3 class="h2 mb-1 fw-bold">{{ rol.cantidad }}</h3>
                <p class="text-muted mb-0">{{ getRolText(rol.rol) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="row g-4">
        <!-- Cursos recientes -->
        <div class="col-lg-6">
          <div class="card-hover animate-slide-in" style="animation-delay: 0.5s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-clock-history me-2"></i>Cursos Recientes
              </h5>
            </div>
            <div class="card-body p-4">
              <div v-if="stats.cursosRecientes.length === 0" class="text-center py-4 text-muted">
                No hay cursos
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="curso in stats.cursosRecientes"
                  :key="curso.id"
                  class="d-flex align-items-center justify-content-between p-3 glass-effect rounded-3 hover-lift">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-book text-primary"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 fw-semibold">{{ curso.titulo }}</h6>
                      <small class="text-muted">{{ curso.codigo }}</small>
                    </div>
                  </div>
                  <div class="text-end text-muted small">
                    <div><i class="bi bi-people me-1"></i>{{ curso._count.matriculas }}</div>
                    <div><i class="bi bi-collection me-1"></i>{{ curso._count.clases }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Usuarios recientes -->
        <div class="col-lg-6">
          <div class="card-hover animate-slide-in" style="animation-delay: 0.6s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-person-plus me-2"></i>Usuarios Recientes
              </h5>
            </div>
            <div class="card-body p-4">
              <div v-if="stats.usuariosRecientes.length === 0" class="text-center py-4 text-muted">
                No hay usuarios
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="usuario in stats.usuariosRecientes"
                  :key="usuario.id"
                  class="d-flex align-items-center justify-content-between p-3 glass-effect rounded-3 hover-lift">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary text-white me-3 d-flex align-items-center justify-content-center"
                         style="width: 40px; height: 40px; font-size: 0.9rem; font-weight: 600;">
                      {{ usuario.nombre[0] }}{{ usuario.apellido[0] }}
                    </div>
                    <div>
                      <h6 class="mb-1 fw-semibold">
                        {{ usuario.nombre }} {{ usuario.apellido }}
                      </h6>
                      <small class="text-muted">{{ usuario.email }}</small>
                    </div>
                  </div>
                  <span
                    class="badge px-3 py-2"
                    :class="getRolBadgeClass(usuario.rol)">
                    {{ getRolText(usuario.rol) }}
                  </span>
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
import { ref, onMounted } from 'vue'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(true)
const stats = ref({
  resumen: {
    totalUsuarios: 0,
    totalCursos: 0,
    totalTareas: 0,
    totalMensajes: 0
  },
  usuariosPorRol: [],
  cursosRecientes: [],
  usuariosRecientes: []
})

const getRolText = (rol) => {
  switch (rol) {
    case 'ADMIN': return 'Administrador'
    case 'DOCENTE': return 'Docente'
    case 'ESTUDIANTE': return 'Estudiante'
    default: return rol
  }
}

const getRolBadgeClass = (rol) => {
  switch (rol) {
    case 'ADMIN': return 'bg-danger bg-opacity-10 text-danger'
    case 'DOCENTE': return 'bg-primary bg-opacity-10 text-primary'
    case 'ESTUDIANTE': return 'bg-success bg-opacity-10 text-success'
    default: return 'bg-secondary bg-opacity-10 text-secondary'
  }
}

const getRolBgClass = (rol) => {
  switch (rol) {
    case 'ADMIN': return 'bg-danger bg-opacity-10'
    case 'DOCENTE': return 'bg-primary bg-opacity-10'
    case 'ESTUDIANTE': return 'bg-success bg-opacity-10'
    default: return 'bg-secondary bg-opacity-10'
  }
}

const getRolIconClass = (rol) => {
  switch (rol) {
    case 'ADMIN': return 'bi bi-shield-fill-check text-danger'
    case 'DOCENTE': return 'bi bi-person-badge-fill text-primary'
    case 'ESTUDIANTE': return 'bi bi-person-fill text-success'
    default: return 'bi bi-person text-secondary'
  }
}

const cargarStats = async () => {
  try {
    loading.value = true
    
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Datos demo
    stats.value = {
      resumen: {
        totalUsuarios: 150,
        totalCursos: 24,
        totalTareas: 86,
        totalMensajes: 432
      },
      usuariosPorRol: [
        { rol: 'ADMIN', cantidad: 3 },
        { rol: 'DOCENTE', cantidad: 15 },
        { rol: 'ESTUDIANTE', cantidad: 132 }
      ],
      cursosRecientes: [
        {
          id: 1,
          titulo: 'Introducción a la Programación',
          codigo: 'PROG-101',
          _count: { matriculas: 45, clases: 12 }
        },
        {
          id: 2,
          titulo: 'Base de Datos Avanzada',
          codigo: 'BD-301',
          _count: { matriculas: 32, clases: 10 }
        },
        {
          id: 3,
          titulo: 'Desarrollo Web Full Stack',
          codigo: 'WEB-401',
          _count: { matriculas: 28, clases: 15 }
        },
        {
          id: 4,
          titulo: 'Machine Learning',
          codigo: 'ML-501',
          _count: { matriculas: 22, clases: 8 }
        }
      ],
      usuariosRecientes: [
        {
          id: 101,
          nombre: 'Carlos',
          apellido: 'Ramírez',
          email: 'carlos.r@mail.com',
          rol: 'ESTUDIANTE'
        },
        {
          id: 102,
          nombre: 'Laura',
          apellido: 'Martínez',
          email: 'laura.m@mail.com',
          rol: 'DOCENTE'
        },
        {
          id: 103,
          nombre: 'Pedro',
          apellido: 'González',
          email: 'pedro.g@mail.com',
          rol: 'ESTUDIANTE'
        },
        {
          id: 104,
          nombre: 'Ana',
          apellido: 'López',
          email: 'ana.l@mail.com',
          rol: 'ESTUDIANTE'
        },
        {
          id: 105,
          nombre: 'Miguel',
          apellido: 'Torres',
          email: 'miguel.t@mail.com',
          rol: 'ESTUDIANTE'
        }
      ]
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarStats()
})
</script>