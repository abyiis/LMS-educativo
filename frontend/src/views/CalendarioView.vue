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
                  <i class="bi bi-calendar-event me-2"></i>Calendario Académico
                </h1>
                <p class="text-muted mb-0 fs-5">Organiza tu tiempo y no pierdas ninguna fecha importante</p>
              </div>
              <div class="d-flex gap-2">
                <button @click="vistaActual = 'mes'" class="btn" :class="vistaActual === 'mes' ? 'btn-gradient' : 'btn-outline-primary'">
                  <i class="bi bi-calendar3 me-1"></i>Mes
                </button>
                <button @click="vistaActual = 'semana'" class="btn" :class="vistaActual === 'semana' ? 'btn-gradient' : 'btn-outline-primary'">
                  <i class="bi bi-calendar-week me-1"></i>Semana
                </button>
                <button @click="vistaActual = 'agenda'" class="btn" :class="vistaActual === 'agenda' ? 'btn-gradient' : 'btn-outline-primary'">
                  <i class="bi bi-list-ul me-1"></i>Agenda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Calendario Principal -->
        <div class="col-lg-8">
          <div class="card-hover animate-slide-in">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <button @click="cambiarMes(-1)" class="btn btn-sm btn-outline-primary rounded-circle" style="width: 40px; height: 40px;">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <h5 class="mb-0 text-gradient fw-bold">{{ mesActual }}</h5>
                  <button @click="cambiarMes(1)" class="btn btn-sm btn-outline-primary rounded-circle" style="width: 40px; height: 40px;">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
                <button @click="irHoy" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-calendar-check me-1"></i>Hoy
                </button>
              </div>
            </div>
            <div class="card-body p-4">
              <!-- Vista de Mes -->
              <div v-if="vistaActual === 'mes'" class="calendario-grid">
                <div class="d-grid" style="grid-template-columns: repeat(7, 1fr); gap: 10px;">
                  <!-- Headers de días -->
                  <div v-for="dia in diasSemana" :key="dia" class="text-center fw-bold text-muted small py-2">
                    {{ dia }}
                  </div>
                  <!-- Días del mes -->
                  <div 
                    v-for="(dia, index) in diasDelMes" 
                    :key="index"
                    class="dia-calendario glass-effect rounded-3 p-2 hover-lift"
                    :class="{
                      'dia-otro-mes': !dia.delMesActual,
                      'dia-hoy': dia.esHoy,
                      'dia-con-eventos': dia.eventos.length > 0
                    }"
                    @click="seleccionarDia(dia)">
                    <div class="d-flex flex-column h-100">
                      <span class="fw-semibold small" :class="{ 'text-primary': dia.esHoy }">{{ dia.numero }}</span>
                      <div class="eventos-dia mt-1">
                        <div 
                          v-for="(evento, idx) in dia.eventos.slice(0, 2)" 
                          :key="idx"
                          class="evento-badge mb-1"
                          :class="`bg-${evento.tipo}`">
                          <small>{{ evento.titulo }}</small>
                        </div>
                        <small v-if="dia.eventos.length > 2" class="text-muted">
                          +{{ dia.eventos.length - 2 }} más
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vista de Semana -->
              <div v-if="vistaActual === 'semana'" class="vista-semana">
                <div v-for="dia in semanaActual" :key="dia.fecha" class="glass-effect p-3 rounded-3 mb-3 hover-lift">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0" :class="{ 'text-primary fw-bold': dia.esHoy }">
                      {{ dia.nombreDia }} {{ dia.numero }}
                    </h6>
                    <span v-if="dia.esHoy" class="badge bg-primary">Hoy</span>
                  </div>
                  <div v-if="dia.eventos.length === 0" class="text-muted small">
                    Sin eventos
                  </div>
                  <div v-else class="d-flex flex-column gap-2">
                    <div 
                      v-for="evento in dia.eventos" 
                      :key="evento.id"
                      class="evento-card p-2 rounded-2"
                      :class="`bg-${evento.tipo}`">
                      <div class="d-flex justify-content-between">
                        <span class="fw-semibold small">{{ evento.titulo }}</span>
                        <span class="small">{{ evento.hora }}</span>
                      </div>
                      <small class="text-muted">{{ evento.curso }}</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vista de Agenda -->
              <div v-if="vistaActual === 'agenda'" class="vista-agenda">
                <div v-for="(grupo, fecha) in eventosPorFecha" :key="fecha" class="mb-4">
                  <h6 class="text-gradient mb-3">{{ fecha }}</h6>
                  <div class="d-flex flex-column gap-2">
                    <div 
                      v-for="evento in grupo" 
                      :key="evento.id"
                      class="glass-effect p-3 rounded-3 hover-lift">
                      <div class="d-flex align-items-start">
                        <div class="rounded-circle me-3 p-2"
                             :class="`bg-${evento.tipo}`"
                             style="width: 40px; height: 40px;">
                          <i :class="getIconoEvento(evento.tipo)" class="text-white"></i>
                        </div>
                        <div class="flex-grow-1">
                          <h6 class="mb-1">{{ evento.titulo }}</h6>
                          <p class="text-muted small mb-2">{{ evento.curso }}</p>
                          <div class="d-flex gap-3 text-muted small">
                            <span><i class="bi bi-clock me-1"></i>{{ evento.hora }}</span>
                            <span><i class="bi bi-tag me-1"></i>{{ evento.tipoTexto }}</span>
                          </div>
                        </div>
                        <button class="btn btn-sm btn-outline-primary">
                          <i class="bi bi-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Filtros -->
          <div class="card-hover mb-4 animate-slide-in" style="animation-delay: 0.2s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h6 class="mb-0 text-gradient">
                <i class="bi bi-funnel-fill me-2"></i>Filtros
              </h6>
            </div>
            <div class="card-body p-4">
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="filterClases" checked>
                <label class="form-check-label d-flex align-items-center" for="filterClases">
                  <span class="badge bg-primary me-2" style="width: 12px; height: 12px;"></span>
                  Clases
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="filterTareas" checked>
                <label class="form-check-label d-flex align-items-center" for="filterTareas">
                  <span class="badge bg-warning me-2" style="width: 12px; height: 12px;"></span>
                  Tareas
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="filterExamenes" checked>
                <label class="form-check-label d-flex align-items-center" for="filterExamenes">
                  <span class="badge bg-danger me-2" style="width: 12px; height: 12px;"></span>
                  Exámenes
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="filterEventos" checked>
                <label class="form-check-label d-flex align-items-center" for="filterEventos">
                  <span class="badge bg-success me-2" style="width: 12px; height: 12px;"></span>
                  Eventos
                </label>
              </div>
            </div>
          </div>

          <!-- Próximos Eventos -->
          <div class="card-hover animate-slide-in" style="animation-delay: 0.3s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h6 class="mb-0 text-gradient">
                <i class="bi bi-clock-history me-2"></i>Próximos Eventos
              </h6>
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-column gap-3">
                <div class="glass-effect p-3 rounded-3 hover-lift">
                  <div class="d-flex align-items-start">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                      <i class="bi bi-clipboard-check text-warning"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 small">Tarea de Base de Datos</h6>
                      <small class="text-muted">Mañana, 10:00 AM</small>
                    </div>
                  </div>
                </div>
                <div class="glass-effect p-3 rounded-3 hover-lift">
                  <div class="d-flex align-items-start">
                    <div class="rounded-circle bg-danger bg-opacity-10 p-2 me-3">
                      <i class="bi bi-file-earmark-text text-danger"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 small">Examen Final - Matemáticas</h6>
                      <small class="text-muted">En 3 días, 2:00 PM</small>
                    </div>
                  </div>
                </div>
                <div class="glass-effect p-3 rounded-3 hover-lift">
                  <div class="d-flex align-items-start">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                      <i class="bi bi-book text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 small">Clase de Desarrollo Web</h6>
                      <small class="text-muted">Lunes, 9:00 AM</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.4s;">
            <div class="card-body p-4">
              <h6 class="mb-3 text-gradient">
                <i class="bi bi-graph-up me-2"></i>Este Mes
              </h6>
              <div class="d-flex justify-content-between mb-3">
                <span class="text-muted small">Clases</span>
                <span class="fw-bold">12</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span class="text-muted small">Tareas Entregadas</span>
                <span class="fw-bold text-success">8</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted small">Tareas Pendientes</span>
                <span class="fw-bold text-warning">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import Layout from '../components/Layout.vue'

const vistaActual = ref('mes')
const fechaActual = ref(new Date())

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const mesActual = computed(() => {
  return fechaActual.value.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
})

const diasDelMes = computed(() => {
  const año = fechaActual.value.getFullYear()
  const mes = fechaActual.value.getMonth()
  const primerDia = new Date(año, mes, 1)
  const ultimoDia = new Date(año, mes + 1, 0)
  const diasAnteriores = primerDia.getDay()
  
  const dias = []
  
  // Días del mes anterior
  const ultimoDiaMesAnterior = new Date(año, mes, 0).getDate()
  for (let i = diasAnteriores - 1; i >= 0; i--) {
    dias.push({
      numero: ultimoDiaMesAnterior - i,
      delMesActual: false,
      esHoy: false,
      eventos: []
    })
  }
  
  // Días del mes actual
  const hoy = new Date()
  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    const esHoy = i === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()
    dias.push({
      numero: i,
      delMesActual: true,
      esHoy,
      eventos: obtenerEventosDia(new Date(año, mes, i))
    })
  }
  
  // Días del mes siguiente
  const diasRestantes = 42 - dias.length
  for (let i = 1; i <= diasRestantes; i++) {
    dias.push({
      numero: i,
      delMesActual: false,
      esHoy: false,
      eventos: []
    })
  }
  
  return dias
})

const semanaActual = computed(() => {
  const hoy = new Date()
  const diasSemana = []
  const diaActual = hoy.getDay()
  
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(fecha.getDate() - diaActual + i)
    const esHoy = fecha.toDateString() === hoy.toDateString()
    
    diasSemana.push({
      fecha: fecha.toISOString(),
      nombreDia: fecha.toLocaleDateString('es-ES', { weekday: 'long' }),
      numero: fecha.getDate(),
      esHoy,
      eventos: obtenerEventosDia(fecha)
    })
  }
  
  return diasSemana
})

const eventosPorFecha = computed(() => {
  const eventos = {}
  const hoy = new Date()
  
  // Generar eventos para los próximos 30 días
  for (let i = 0; i < 30; i++) {
    const fecha = new Date(hoy)
    fecha.setDate(fecha.getDate() + i)
    const fechaKey = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    
    const eventosDelDia = obtenerEventosDia(fecha)
    if (eventosDelDia.length > 0) {
      eventos[fechaKey] = eventosDelDia
    }
  }
  
  return eventos
})

const obtenerEventosDia = (fecha) => {
  // Simular eventos para demostración
  const dia = fecha.getDate()
  const eventos = []
  
  if (dia % 3 === 0) {
    eventos.push({
      id: `clase-${dia}`,
      titulo: 'Clase de Programación',
      curso: 'Desarrollo Web',
      hora: '09:00 AM',
      tipo: 'primary',
      tipoTexto: 'Clase'
    })
  }
  
  if (dia % 5 === 0) {
    eventos.push({
      id: `tarea-${dia}`,
      titulo: 'Entrega de Tarea',
      curso: 'Base de Datos',
      hora: '11:59 PM',
      tipo: 'warning',
      tipoTexto: 'Tarea'
    })
  }
  
  if (dia % 7 === 0) {
    eventos.push({
      id: `examen-${dia}`,
      titulo: 'Examen Final',
      curso: 'Matemáticas',
      hora: '02:00 PM',
      tipo: 'danger',
      tipoTexto: 'Examen'
    })
  }
  
  return eventos
}

const cambiarMes = (direccion) => {
  const nuevaFecha = new Date(fechaActual.value)
  nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion)
  fechaActual.value = nuevaFecha
}

const irHoy = () => {
  fechaActual.value = new Date()
}

const seleccionarDia = (dia) => {
  if (dia.eventos.length > 0) {
    alert(`Eventos del día ${dia.numero}:\n${dia.eventos.map(e => `- ${e.titulo}`).join('\n')}`)
  }
}

const getIconoEvento = (tipo) => {
  const iconos = {
    'primary': 'bi bi-book-fill',
    'warning': 'bi bi-clipboard-check-fill',
    'danger': 'bi bi-file-earmark-text-fill',
    'success': 'bi bi-calendar-event-fill'
  }
  return iconos[tipo] || 'bi bi-calendar'
}
</script>

<style scoped>
.dia-calendario {
  min-height: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dia-calendario:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.dia-otro-mes {
  opacity: 0.4;
}

.dia-hoy {
  border: 2px solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.dia-con-eventos {
  border-left: 3px solid #667eea;
}

.evento-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bg-primary {
  background-color: rgba(102, 126, 234, 0.2) !important;
  color: #667eea;
}

.bg-warning {
  background-color: rgba(255, 193, 7, 0.2) !important;
  color: #ffc107;
}

.bg-danger {
  background-color: rgba(220, 53, 69, 0.2) !important;
  color: #dc3545;
}

.bg-success {
  background-color: rgba(25, 135, 84, 0.2) !important;
  color: #198754;
}

.evento-card {
  border-left: 3px solid currentColor;
}
</style>