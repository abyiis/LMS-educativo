<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  <i class="bi bi-graph-up-arrow me-2"></i>Mi Progreso
                </h1>
                <p class="text-muted mb-0 fs-5">Sigue tu evolución académica y metas de aprendizaje</p>
              </div>
              <button class="btn btn-gradient">
                <i class="bi bi-download me-2"></i>Exportar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen General -->
      <div class="row g-4 mb-5">
        <div class="col-md-3">
          <div class="card-hover h-100 animate-bounce-in text-center">
            <div class="card-body p-4">
              <div class="position-relative d-inline-block mb-3">
                <svg width="120" height="120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e9ecef" stroke-width="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#gradient1)" stroke-width="10"
                          stroke-dasharray="314" stroke-dashoffset="94" 
                          stroke-linecap="round" transform="rotate(-90 60 60)"/>
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="position-absolute top-50 start-50 translate-middle">
                  <h2 class="mb-0 fw-bold">70%</h2>
                </div>
              </div>
              <p class="text-muted mb-0">Progreso Global</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
            <div class="card-body text-center p-4">
              <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 80px; height: 80px;">
                <i class="bi bi-book-fill text-success" style="font-size: 2.5rem;"></i>
              </div>
              <h3 class="h2 mb-1">8/12</h3>
              <p class="text-muted mb-0">Cursos Completados</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
            <div class="card-body text-center p-4">
              <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 80px; height: 80px;">
                <i class="bi bi-star-fill text-warning" style="font-size: 2.5rem;"></i>
              </div>
              <h3 class="h2 mb-1">4.7</h3>
              <p class="text-muted mb-0">Promedio General</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
            <div class="card-body text-center p-4">
              <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 80px; height: 80px;">
                <i class="bi bi-clock-history text-info" style="font-size: 2.5rem;"></i>
              </div>
              <h3 class="h2 mb-1">320h</h3>
              <p class="text-muted mb-0">Tiempo Total</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Progreso por Curso -->
        <div class="col-lg-8">
          <div class="card-hover animate-slide-in">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-bar-chart-fill me-2"></i>Progreso por Curso
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-column gap-4">
                <div v-for="curso in cursos" :key="curso.id">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 class="mb-1">{{ curso.nombre }}</h6>
                      <small class="text-muted">{{ curso.profesor }}</small>
                    </div>
                    <div class="text-end">
                      <span class="fw-bold text-gradient">{{ curso.progreso }}%</span>
                      <br>
                      <small class="text-muted">{{ curso.completadas }}/{{ curso.totalClases }} clases</small>
                    </div>
                  </div>
                  <div class="progress" style="height: 12px;">
                    <div 
                      class="progress-bar" 
                      :style="{ width: curso.progreso + '%', background: curso.color }"
                      role="progressbar">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de Evolución -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.2s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-graph-up me-2"></i>Evolución de Calificaciones
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="grafico-barras">
                <div class="d-flex align-items-end justify-content-between" style="height: 250px;">
                  <div v-for="(mes, index) in evolucion" :key="index" class="flex-grow-1 mx-2">
                    <div class="d-flex flex-column align-items-center h-100 justify-content-end">
                      <div 
                        class="barra-progreso hover-lift"
                        :style="{ 
                          height: mes.valor + '%',
                          background: 'linear-gradient(to top, #667eea, #764ba2)'
                        }">
                      </div>
                      <small class="text-muted mt-2">{{ mes.mes }}</small>
                      <small class="fw-bold">{{ mes.calificacion }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tareas Recientes -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.3s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-clipboard-check me-2"></i>Últimas Calificaciones
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Tarea</th>
                      <th>Curso</th>
                      <th>Fecha</th>
                      <th class="text-end">Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tarea in ultimasTareas" :key="tarea.id">
                      <td class="fw-semibold">{{ tarea.nombre }}</td>
                      <td class="text-muted">{{ tarea.curso }}</td>
                      <td class="text-muted">{{ tarea.fecha }}</td>
                      <td class="text-end">
                        <span class="badge" :class="getBadgeClass(tarea.nota)">
                          {{ tarea.nota }}/5.0
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Racha de Estudio -->
          <div class="card-hover animate-slide-in" style="animation-delay: 0.4s;">
            <div class="card-body p-4 text-center">
              <div class="mb-3">
                <i class="bi bi-fire text-danger pulse" style="font-size: 4rem;"></i>
              </div>
              <h3 class="mb-1">15 días</h3>
              <p class="text-muted mb-3">Racha actual de estudio</p>
              <div class="glass-effect p-3 rounded-3">
                <small class="text-muted d-block mb-2">Última actividad</small>
                <p class="mb-0 fw-semibold">Hoy, 10:30 AM</p>
              </div>
            </div>
          </div>

          <!-- Logros Recientes -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.5s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h6 class="mb-0 text-gradient">
                <i class="bi bi-trophy-fill me-2"></i>Logros Recientes
              </h6>
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-column gap-3">
                <div class="glass-effect p-3 rounded-3 hover-lift">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                      <i class="bi bi-award-fill text-warning fs-4"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 small">Estudiante Destacado</h6>
                      <small class="text-muted">Hace 2 días</small>
                    </div>
                  </div>
                </div>
                <div class="glass-effect p-3 rounded-3 hover-lift">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                      <i class="bi bi-check-circle-fill text-success fs-4"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 small">Curso Completado</h6>
                      <small class="text-muted">Hace 5 días</small>
                    </div>
                  </div>
                </div>
                <div class="glass-effect p-3 rounded-3 hover-lift">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-info bg-opacity-10 p-2 me-3">
                      <i class="bi bi-star-fill text-info fs-4"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 small">Calificación Perfecta</h6>
                      <small class="text-muted">Hace 1 semana</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Objetivos -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.6s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h6 class="mb-0 text-gradient">
                <i class="bi bi-bullseye me-2"></i>Objetivos del Mes
              </h6>
            </div>
            <div class="card-body p-4">
              <div class="mb-4">
                <div class="d-flex justify-content-between mb-2">
                  <small class="text-muted">Completar 5 cursos</small>
                  <small class="fw-bold">3/5</small>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-gradient-primary" style="width: 60%"></div>
                </div>
              </div>
              <div class="mb-4">
                <div class="d-flex justify-content-between mb-2">
                  <small class="text-muted">Mantener promedio 4.5+</small>
                  <small class="fw-bold text-success">✓</small>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-success" style="width: 100%"></div>
                </div>
              </div>
              <div>
                <div class="d-flex justify-content-between mb-2">
                  <small class="text-muted">50 horas de estudio</small>
                  <small class="fw-bold">38/50</small>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-warning" style="width: 76%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas Rápidas -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.7s;">
            <div class="card-body p-4">
              <h6 class="mb-3 text-gradient">
                <i class="bi bi-speedometer2 me-2"></i>Estadísticas
              </h6>
              <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span class="text-muted small">Mejor calificación</span>
                <span class="fw-bold">5.0</span>
              </div>
              <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span class="text-muted small">Tareas a tiempo</span>
                <span class="fw-bold text-success">95%</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted small">Participación</span>
                <span class="fw-bold text-info">Muy Alta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from '../components/Layout.vue'

const cursos = ref([
  {
    id: 1,
    nombre: 'Desarrollo Web Full Stack',
    profesor: 'Juan Pérez',
    progreso: 85,
    completadas: 17,
    totalClases: 20,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    nombre: 'Base de Datos Avanzada',
    profesor: 'María García',
    progreso: 60,
    completadas: 12,
    totalClases: 20,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    nombre: 'Machine Learning',
    profesor: 'Carlos López',
    progreso: 45,
    completadas: 9,
    totalClases: 20,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    nombre: 'Desarrollo Móvil',
    profesor: 'Ana Martínez',
    progreso: 30,
    completadas: 6,
    totalClases: 20,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

const evolucion = ref([
  { mes: 'Ene', valor: 70, calificacion: 3.5 },
  { mes: 'Feb', valor: 75, calificacion: 3.8 },
  { mes: 'Mar', valor: 82, calificacion: 4.1 },
  { mes: 'Abr', valor: 88, calificacion: 4.4 },
  { mes: 'May', valor: 85, calificacion: 4.3 },
  { mes: 'Jun', valor: 94, calificacion: 4.7 }
])

const ultimasTareas = ref([
  { id: 1, nombre: 'Proyecto Final API', curso: 'Desarrollo Web', fecha: '10 Jun', nota: 4.8 },
  { id: 2, nombre: 'Diseño BD Normalizado', curso: 'Base de Datos', fecha: '08 Jun', nota: 4.5 },
  { id: 3, nombre: 'Modelo Predictivo', curso: 'Machine Learning', fecha: '05 Jun', nota: 4.2 },
  { id: 4, nombre: 'App Android', curso: 'Desarrollo Móvil', fecha: '03 Jun', nota: 4.6 },
  { id: 5, nombre: 'Algoritmo Optimización', curso: 'Desarrollo Web', fecha: '01 Jun', nota: 4.9 }
])

const getBadgeClass = (nota) => {
  if (nota >= 4.5) return 'bg-success'
  if (nota >= 4.0) return 'bg-primary'
  if (nota >= 3.5) return 'bg-warning'
  return 'bg-danger'
}
</script>

<style scoped>
.barra-progreso {
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  min-height: 20px;
}

.barra-progreso:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-hover tbody tr:hover {
  background-color: rgba(102, 126, 234, 0.05);
}
</style>