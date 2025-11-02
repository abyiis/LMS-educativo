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

      <!-- Pestañas de Navegación -->
      <ul class="nav nav-pills mb-4 glass-effect p-2 rounded-3">
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: tabActiva === 'resumen' }"
            @click="tabActiva = 'resumen'">
            <i class="bi bi-speedometer2 me-2"></i>Resumen
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: tabActiva === 'cursos' }"
            @click="tabActiva = 'cursos'">
            <i class="bi bi-book-fill me-2"></i>Gestión Cursos
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: tabActiva === 'informes' }"
            @click="tabActiva = 'informes'">
            <i class="bi bi-file-earmark-bar-graph me-2"></i>Informes
          </button>
        </li>
      </ul>

      <!-- TAB: Resumen (Vista Original) -->
      <div v-if="tabActiva === 'resumen'" class="animate-fade-in">
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

      <!-- TAB: Gestión de Cursos -->
      <div v-if="tabActiva === 'cursos'" class="animate-fade-in">
        <div class="card-hover">
          <div class="card-header border-0 bg-transparent p-4">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-book-fill me-2"></i>Gestión de Cursos
              </h5>
              <router-link to="/cursos/crear" class="btn btn-gradient">
                <i class="bi bi-plus-circle me-2"></i>Nuevo Curso
              </router-link>
            </div>
          </div>
          <div class="card-body p-4">
            <!-- Filtro -->
            <div class="row g-3 mb-4">
              <div class="col-md-8">
                <input 
                  v-model="filtroCursos" 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por título o código...">
              </div>
              <div class="col-md-4">
                <select v-model="filtroEstadoCurso" class="form-select">
                  <option value="">Todos los estados</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>

            <!-- Tabla de cursos -->
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Docente</th>
                    <th>Estudiantes</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="curso in cursosFiltradosComputed" :key="curso.id">
                    <td><strong>{{ curso.codigo }}</strong></td>
                    <td>{{ curso.titulo }}</td>
                    <td>{{ curso.creador.nombre }} {{ curso.creador.apellido }}</td>
                    <td>
                      <span class="badge bg-primary">
                        <i class="bi bi-people-fill me-1"></i>{{ curso._count.matriculas }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="curso.activo ? 'bg-success' : 'bg-danger'">
                        {{ curso.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <router-link 
                          :to="`/cursos/${curso.id}`" 
                          class="btn btn-outline-primary"
                          title="Ver detalles">
                          <i class="bi bi-eye"></i>
                        </router-link>
                        <button 
                          @click="toggleEstadoCurso(curso)" 
                          class="btn" 
                          :class="curso.activo ? 'btn-outline-danger' : 'btn-outline-success'"
                          :title="curso.activo ? 'Desactivar' : 'Activar'">
                          <i :class="curso.activo ? 'bi bi-pause-circle' : 'bi bi-play-circle'"></i>
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

      <!-- TAB: Informes -->
      <div v-if="tabActiva === 'informes'" class="animate-fade-in">
        <div class="row g-4">
          <!-- Generador de Informes -->
          <div class="col-lg-4">
            <div class="card-hover h-100">
              <div class="card-header border-0 bg-transparent p-4">
                <h5 class="mb-0">
                  <i class="bi bi-file-earmark-text me-2"></i>Generar Informe
                </h5>
              </div>
              <div class="card-body p-4">
                <form @submit.prevent="generarInforme">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Tipo de Informe</label>
                    <select v-model="informeForm.tipo" class="form-select" required>
                      <option value="">Seleccionar...</option>
                      <option value="usuarios">Usuarios del Sistema</option>
                      <option value="cursos">Cursos y Matrículas</option>
                      <option value="rendimiento">Rendimiento Académico</option>
                      <option value="docentes">Desempeño Docentes</option>
                      <option value="financiero">Reporte Financiero</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Período</label>
                    <select v-model="informeForm.periodo" class="form-select" required>
                      <option value="actual">Período Actual</option>
                      <option value="mes">Último Mes</option>
                      <option value="trimestre">Último Trimestre</option>
                      <option value="semestre">Último Semestre</option>
                      <option value="ano">Último Año</option>
                      <option value="personalizado">Personalizado</option>
                    </select>
                  </div>

                  <div v-if="informeForm.periodo === 'personalizado'" class="mb-3">
                    <label class="form-label fw-semibold">Fecha Inicio</label>
                    <input v-model="informeForm.fechaInicio" type="date" class="form-control mb-2" required>
                    <label class="form-label fw-semibold">Fecha Fin</label>
                    <input v-model="informeForm.fechaFin" type="date" class="form-control" required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Formato</label>
                    <select v-model="informeForm.formato" class="form-select" required>
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel (XLSX)</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <div class="form-check">
                      <input v-model="informeForm.incluirGraficos" class="form-check-input" type="checkbox" id="graficos">
                      <label class="form-check-label" for="graficos">
                        Incluir gráficos
                      </label>
                    </div>
                    <div class="form-check">
                      <input v-model="informeForm.datosDetallados" class="form-check-input" type="checkbox" id="detallado">
                      <label class="form-check-label" for="detallado">
                        Datos detallados
                      </label>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-gradient w-100" :disabled="generandoInforme">
                    <span v-if="generandoInforme">
                      <div class="spinner-border spinner-border-sm me-2"></div>
                      Generando...
                    </span>
                    <span v-else>
                      <i class="bi bi-download me-2"></i>Generar Informe
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Informes Generados -->
          <div class="col-lg-8">
            <div class="card-hover h-100">
              <div class="card-header border-0 bg-transparent p-4">
                <h5 class="mb-0">
                  <i class="bi bi-clock-history me-2"></i>Informes Generados
                </h5>
              </div>
              <div class="card-body p-4">
                <div v-if="informesGenerados.length === 0" class="text-center py-5">
                  <i class="bi bi-file-earmark-x fs-1 text-muted mb-3"></i>
                  <p class="text-muted">No hay informes generados</p>
                </div>
                <div v-else class="list-group list-group-flush">
                  <div 
                    v-for="informe in informesGenerados" 
                    :key="informe.id"
                    class="list-group-item border-0 glass-effect mb-2 rounded-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ informe.nombre }}</h6>
                        <div class="d-flex gap-3 small text-muted">
                          <span><i class="bi bi-calendar me-1"></i>{{ formatDateTime(informe.fecha) }}</span>
                          <span><i class="bi bi-file-earmark me-1"></i>{{ informe.formato.toUpperCase() }}</span>
                          <span><i class="bi bi-hdd me-1"></i>{{ informe.tamano }}</span>
                        </div>
                      </div>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="descargarInforme(informe)">
                          <i class="bi bi-download"></i>
                        </button>
                        <button class="btn btn-outline-danger" @click="eliminarInforme(informe.id)">
                          <i class="bi bi-trash"></i>
                        </button>
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
import { ref, computed, onMounted } from 'vue'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const loading = ref(true)
const tabActiva = ref('resumen')
const generandoInforme = ref(false)
const filtroCursos = ref('')
const filtroEstadoCurso = ref('')

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

const cursos = ref([
  {
    id: 1,
    titulo: 'Introducción a la Programación',
    codigo: 'PROG-101',
    activo: true,
    creador: { nombre: 'Juan', apellido: 'Pérez' },
    _count: { matriculas: 45, clases: 12 }
  },
  {
    id: 2,
    titulo: 'Base de Datos',
    codigo: 'BD-201',
    activo: true,
    creador: { nombre: 'Juan', apellido: 'Pérez' },
    _count: { matriculas: 32, clases: 10 }
  },
  {
    id: 3,
    titulo: 'Desarrollo Web',
    codigo: 'WEB-301',
    activo: false,
    creador: { nombre: 'Juan', apellido: 'Pérez' },
    _count: { matriculas: 28, clases: 15 }
  },
  {
    id: 4,
    titulo: 'Machine Learning',
    codigo: 'ML-501',
    activo: true,
    creador: { nombre: 'María', apellido: 'García' },
    _count: { matriculas: 22, clases: 8 }
  }
])

const informesGenerados = ref([])

const informeForm = ref({
  tipo: '',
  periodo: 'actual',
  fechaInicio: '',
  fechaFin: '',
  formato: 'pdf',
  incluirGraficos: true,
  datosDetallados: false
})

const cursosFiltradosComputed = computed(() => {
  let resultado = cursos.value

  if (filtroCursos.value) {
    const busqueda = filtroCursos.value.toLowerCase()
    resultado = resultado.filter(c => 
      c.titulo.toLowerCase().includes(busqueda) ||
      c.codigo.toLowerCase().includes(busqueda)
    )
  }

  if (filtroEstadoCurso.value !== '') {
    resultado = resultado.filter(c => c.activo === (filtroEstadoCurso.value === 'true'))
  }

  return resultado
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

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('es-ES')
}

const toggleEstadoCurso = (curso) => {
  curso.activo = !curso.activo
  alert(`✅ Curso ${curso.activo ? 'activado' : 'desactivado'} correctamente`)
}

const generarInforme = async () => {
  if (!informeForm.value.tipo) {
    alert('❌ Selecciona un tipo de informe')
    return
  }

  generandoInforme.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const tiposInforme = {
      usuarios: 'Usuarios del Sistema',
      cursos: 'Cursos y Matrículas',
      rendimiento: 'Rendimiento Académico',
      docentes: 'Desempeño Docentes',
      financiero: 'Reporte Financiero'
    }

    const nuevoInforme = {
      id: Date.now(),
      nombre: `${tiposInforme[informeForm.value.tipo]} - ${informeForm.value.periodo}`,
      fecha: new Date().toISOString(),
      formato: informeForm.value.formato,
      tamano: `${(Math.random() * 5 + 1).toFixed(1)} MB`
    }

    informesGenerados.value.unshift(nuevoInforme)
    alert('✅ Informe generado exitosamente')
    
    informeForm.value = {
      tipo: '',
      periodo: 'actual',
      fechaInicio: '',
      fechaFin: '',
      formato: 'pdf',
      incluirGraficos: true,
      datosDetallados: false
    }
  } catch (error) {
    alert('❌ Error al generar el informe')
  } finally {
    generandoInforme.value = false
  }
}

const descargarInforme = (informe) => {
  // Generar contenido según el tipo de informe
  const tipoInforme = informe.nombre.split(' - ')[0]
  
  if (informe.formato === 'pdf') {
    descargarPDF(informe, tipoInforme)
  } else if (informe.formato === 'excel') {
    descargarExcel(informe, tipoInforme)
  } else if (informe.formato === 'csv') {
    descargarCSV(informe, tipoInforme)
  }
}

const descargarPDF = (informe, tipoInforme) => {
  // Crear contenido HTML para el PDF
  const contenidoHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${informe.nombre}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #667eea;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          color: #667eea;
          margin: 0;
        }
        .info {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #667eea;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LMS Educativo</h1>
        <h2>${informe.nombre}</h2>
      </div>
      
      <div class="info">
        <p><strong>Fecha de generación:</strong> ${formatDateTime(informe.fecha)}</p>
        <p><strong>Generado por:</strong> ${authStore.user?.nombre} ${authStore.user?.apellido}</p>
      </div>

      ${generarContenidoInforme(tipoInforme)}

      <div class="footer">
        <p>© ${new Date().getFullYear()} LMS Educativo - Documento generado automáticamente</p>
      </div>
    </body>
    </html>
  `

  // Crear blob y descargar
  const blob = new Blob([contenidoHTML], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${informe.nombre.replace(/ /g, '_')}.html`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  
  alert('📥 Informe descargado en formato HTML (ábrelo con tu navegador)')
}

const descargarExcel = (informe, tipoInforme) => {
  const datos = obtenerDatosInforme(tipoInforme)
  
  // Crear contenido CSV compatible con Excel
  let csv = '\uFEFF' // BOM para UTF-8
  csv += `"${informe.nombre}"\n`
  csv += `"Fecha: ${formatDateTime(informe.fecha)}"\n`
  csv += `"Generado por: ${authStore.user?.nombre} ${authStore.user?.apellido}"\n\n`
  
  // Agregar encabezados
  csv += datos.headers.map(h => `"${h}"`).join(',') + '\n'
  
  // Agregar filas
  datos.rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n'
  })
  
  // Crear blob y descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${informe.nombre.replace(/ /g, '_')}.csv`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  
  alert('📥 Informe descargado en formato CSV (compatible con Excel)')
}

const descargarCSV = (informe, tipoInforme) => {
  const datos = obtenerDatosInforme(tipoInforme)
  
  let csv = `${informe.nombre}\n`
  csv += `Fecha: ${formatDateTime(informe.fecha)}\n`
  csv += `Generado por: ${authStore.user?.nombre} ${authStore.user?.apellido}\n\n`
  
  // Agregar encabezados
  csv += datos.headers.join(',') + '\n'
  
  // Agregar filas
  datos.rows.forEach(row => {
    csv += row.join(',') + '\n'
  })
  
  // Crear blob y descargar
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${informe.nombre.replace(/ /g, '_')}.csv`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
  
  alert('📥 Informe descargado en formato CSV')
}

const generarContenidoInforme = (tipoInforme) => {
  const datos = obtenerDatosInforme(tipoInforme)
  
  let html = '<table>'
  html += '<thead><tr>'
  datos.headers.forEach(h => {
    html += `<th>${h}</th>`
  })
  html += '</tr></thead>'
  html += '<tbody>'
  datos.rows.forEach(row => {
    html += '<tr>'
    row.forEach(cell => {
      html += `<td>${cell}</td>`
    })
    html += '</tr>'
  })
  html += '</tbody></table>'
  
  return html
}

const obtenerDatosInforme = (tipoInforme) => {
  // Datos de ejemplo según el tipo de informe
  const informes = {
    'Usuarios del Sistema': {
      headers: ['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Fecha Registro'],
      rows: [
        ['1', 'Admin Sistema', 'admin@lms.com', 'Administrador', 'Activo', '01/01/2024'],
        ['2', 'Juan Pérez', 'docente@lms.com', 'Docente', 'Activo', '05/01/2024'],
        ['3', 'María García', 'estudiante@lms.com', 'Estudiante', 'Activo', '10/01/2024'],
        ['4', 'Carlos López', 'carlos@lms.com', 'Estudiante', 'Inactivo', '15/01/2024']
      ]
    },
    'Cursos y Matrículas': {
      headers: ['Código', 'Curso', 'Docente', 'Estudiantes', 'Estado', 'Creación'],
      rows: [
        ['PROG-101', 'Introducción a la Programación', 'Juan Pérez', '45', 'Activo', '15/01/2024'],
        ['BD-201', 'Base de Datos', 'Juan Pérez', '32', 'Activo', '10/01/2024'],
        ['WEB-301', 'Desarrollo Web', 'Juan Pérez', '28', 'Inactivo', '20/01/2024'],
        ['ML-501', 'Machine Learning', 'María García', '22', 'Activo', '25/01/2024']
      ]
    },
    'Rendimiento Académico': {
      headers: ['Estudiante', 'Curso', 'Tareas Completadas', 'Promedio', 'Estado'],
      rows: [
        ['María García', 'Introducción a la Programación', '8/10', '88.5', 'Aprobado'],
        ['Carlos López', 'Base de Datos', '6/8', '75.2', 'Aprobado'],
        ['Ana Martínez', 'Desarrollo Web', '10/12', '92.3', 'Excelente'],
        ['Pedro Ramírez', 'Machine Learning', '5/6', '85.7', 'Aprobado']
      ]
    },
    'Desempeño Docentes': {
      headers: ['Docente', 'Cursos', 'Estudiantes', 'Tareas Creadas', 'Promedio Satisfacción'],
      rows: [
        ['Juan Pérez', '3', '105', '24', '4.5/5.0'],
        ['María García', '2', '58', '18', '4.8/5.0'],
        ['Carlos Rodríguez', '2', '47', '15', '4.3/5.0']
      ]
    },
    'Reporte Financiero': {
      headers: ['Concepto', 'Enero', 'Febrero', 'Marzo', 'Total Trimestre'],
      rows: [
        ['Matrículas', '$45,000', '$52,000', '$48,000', '$145,000'],
        ['Certificaciones', '$12,000', '$15,000', '$18,000', '$45,000'],
        ['Otros', '$5,000', '$6,500', '$7,200', '$18,700'],
        ['TOTAL', '$62,000', '$73,500', '$73,200', '$208,700']
      ]
    }
  }
  
  return informes[tipoInforme] || informes['Usuarios del Sistema']
}

const eliminarInforme = (id) => {
  if (confirm('¿Estás seguro de eliminar este informe?')) {
    informesGenerados.value = informesGenerados.value.filter(i => i.id !== id)
    alert('✅ Informe eliminado')
  }
}

const cargarStats = async () => {
  try {
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
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

<style scoped>
.nav-pills .nav-link {
  color: var(--bs-body-color);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-pills .nav-link:hover:not(.active) {
  background: rgba(102, 126, 234, 0.1);
}
</style>