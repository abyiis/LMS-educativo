<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <h1 class="h2 mb-1 text-gradient">
              <i class="bi bi-gear-fill me-2"></i>Configuración
            </h1>
            <p class="text-muted mb-0">Personaliza tu experiencia en el LMS</p>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Menú lateral -->
        <div class="col-lg-3">
          <div class="card-hover animate-slide-in">
            <div class="list-group list-group-flush">
              <button 
                v-for="item in menuItems" 
                :key="item.id"
                @click="seccionActiva = item.id"
                class="list-group-item list-group-item-action border-0 py-3"
                :class="{ 'active': seccionActiva === item.id }">
                <i :class="item.icon + ' me-2'"></i>{{ item.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Contenido -->
        <div class="col-lg-9">
          <!-- Preferencias de Notificación -->
          <div v-if="seccionActiva === 'notificaciones'" class="card-hover animate-fade-in">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-bell-fill me-2"></i>Notificaciones
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-column gap-4">
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Notificaciones por Email</h6>
                    <p class="text-muted small mb-0">Recibe actualizaciones importantes por correo</p>
                  </div>
                  <div class="form-check form-switch">
                    <input v-model="notificaciones.email" class="form-check-input" type="checkbox">
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Nuevas Tareas</h6>
                    <p class="text-muted small mb-0">Notificar cuando se asignen nuevas tareas</p>
                  </div>
                  <div class="form-check form-switch">
                    <input v-model="notificaciones.tareas" class="form-check-input" type="checkbox">
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Calificaciones</h6>
                    <p class="text-muted small mb-0">Avisar cuando recibas una calificación</p>
                  </div>
                  <div class="form-check form-switch">
                    <input v-model="notificaciones.calificaciones" class="form-check-input" type="checkbox">
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Mensajes de Curso</h6>
                    <p class="text-muted small mb-0">Notificar nuevos mensajes en tus cursos</p>
                  </div>
                  <div class="form-check form-switch">
                    <input v-model="notificaciones.mensajes" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button @click="guardarNotificaciones" class="btn btn-gradient">
                  <i class="bi bi-check-circle me-2"></i>Guardar Preferencias
                </button>
              </div>
            </div>
          </div>

          <!-- Apariencia -->
          <div v-if="seccionActiva === 'apariencia'" class="card-hover animate-fade-in">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-palette-fill me-2"></i>Apariencia
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="mb-4">
                <label class="form-label fw-semibold">Tema</label>
                <div class="row g-3">
                  <div class="col-md-4">
                    <div 
                      @click="cambiarTema('light')"
                      class="glass-effect p-3 rounded-3 text-center hover-lift cursor-pointer"
                      :class="{ 'border border-primary border-3': tema === 'light' }">
                      <i class="bi bi-sun-fill text-warning fs-1 mb-2"></i>
                      <p class="mb-0 fw-semibold">Claro</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div 
                      @click="cambiarTema('dark')"
                      class="glass-effect p-3 rounded-3 text-center hover-lift cursor-pointer"
                      :class="{ 'border border-primary border-3': tema === 'dark' }">
                      <i class="bi bi-moon-fill text-primary fs-1 mb-2"></i>
                      <p class="mb-0 fw-semibold">Oscuro</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div 
                      @click="cambiarTema('auto')"
                      class="glass-effect p-3 rounded-3 text-center hover-lift cursor-pointer"
                      :class="{ 'border border-primary border-3': tema === 'auto' }">
                      <i class="bi bi-circle-half text-info fs-1 mb-2"></i>
                      <p class="mb-0 fw-semibold">Automático</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold">Color de Acento</label>
                <p class="text-muted small mb-3">Selecciona el color principal de la interfaz</p>
                <div class="d-flex gap-3 flex-wrap">
                  <div 
                    v-for="color in colores" 
                    :key="color.name"
                    @click="cambiarColorAcento(color)"
                    class="color-option rounded-circle hover-lift cursor-pointer position-relative d-flex align-items-center justify-content-center"
                    :style="{ 
                      width: '60px', 
                      height: '60px',
                      background: color.gradient,
                      border: colorAcento === color.name ? '3px solid currentColor' : '3px solid transparent',
                      boxShadow: colorAcento === color.name ? `0 0 20px ${color.value}` : 'none'
                    }">
                    <i v-if="colorAcento === color.name" class="bi bi-check-lg text-white fs-3"></i>
                  </div>
                </div>
                <div class="mt-3 glass-effect p-3 rounded-3">
                  <small class="text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    Color actual: <strong>{{ obtenerNombreColor(colorAcento) }}</strong>
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacidad -->
          <div v-if="seccionActiva === 'privacidad'" class="card-hover animate-fade-in">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-shield-lock-fill me-2"></i>Privacidad y Seguridad
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-column gap-4">
                <div class="glass-effect p-3 rounded-3">
                  <h6 class="mb-2">Perfil Público</h6>
                  <p class="text-muted small mb-3">Permite que otros estudiantes vean tu perfil</p>
                  <div class="form-check form-switch">
                    <input v-model="privacidad.perfilPublico" class="form-check-input" type="checkbox">
                    <label class="form-check-label">Perfil visible</label>
                  </div>
                </div>
                <div class="glass-effect p-3 rounded-3">
                  <h6 class="mb-2">Autenticación de Dos Factores</h6>
                  <p class="text-muted small mb-3">Añade una capa extra de seguridad</p>
                  <button class="btn btn-outline-primary" @click="activar2FA">
                    <i class="bi bi-shield-check me-2"></i>Activar 2FA
                  </button>
                </div>
                <div class="glass-effect p-3 rounded-3">
                  <h6 class="mb-2">Sesiones Activas</h6>
                  <p class="text-muted small mb-3">Gestiona tus dispositivos conectados</p>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <p class="mb-0 fw-semibold">Windows - Chrome</p>
                      <small class="text-muted">Última actividad: Ahora</small>
                    </div>
                    <span class="badge bg-success">Actual</span>
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
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'

const seccionActiva = ref('notificaciones')
const tema = ref('light')
const colorAcento = ref('purple')

const notificaciones = ref({
  email: true,
  tareas: true,
  calificaciones: true,
  mensajes: false
})

const privacidad = ref({
  perfilPublico: true
})

const menuItems = [
  { id: 'notificaciones', label: 'Notificaciones', icon: 'bi bi-bell-fill' },
  { id: 'apariencia', label: 'Apariencia', icon: 'bi bi-palette-fill' },
  { id: 'privacidad', label: 'Privacidad', icon: 'bi bi-shield-lock-fill' }
]

const colores = [
  { 
    name: 'purple', 
    displayName: 'Púrpura',
    value: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    btnClass: 'btn-gradient'
  },
  { 
    name: 'blue', 
    displayName: 'Azul',
    value: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    btnClass: 'btn-blue'
  },
  { 
    name: 'green', 
    displayName: 'Verde',
    value: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    btnClass: 'btn-green'
  },
  { 
    name: 'red', 
    displayName: 'Rojo',
    value: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    btnClass: 'btn-red'
  },
  { 
    name: 'orange', 
    displayName: 'Naranja',
    value: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    btnClass: 'btn-orange'
  },
  { 
    name: 'pink', 
    displayName: 'Rosa',
    value: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    btnClass: 'btn-pink'
  },
  { 
    name: 'teal', 
    displayName: 'Turquesa',
    value: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    btnClass: 'btn-teal'
  },
  { 
    name: 'indigo', 
    displayName: 'Índigo',
    value: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    btnClass: 'btn-indigo'
  }
]

// Obtener nombre del color
const obtenerNombreColor = (colorName) => {
  const color = colores.find(c => c.name === colorName)
  return color ? color.displayName : 'Desconocido'
}

// Cargar preferencias guardadas
onMounted(() => {
  const temaGuardado = localStorage.getItem('lms_tema') || 'light'
  const colorGuardado = localStorage.getItem('lms_color') || 'purple'
  const notifGuardadas = localStorage.getItem('lms_notificaciones')
  const privGuardada = localStorage.getItem('lms_privacidad')
  
  tema.value = temaGuardado
  colorAcento.value = colorGuardado
  
  if (notifGuardadas) {
    notificaciones.value = JSON.parse(notifGuardadas)
  }
  
  if (privGuardada) {
    privacidad.value = JSON.parse(privGuardada)
  }
  
  aplicarTema(temaGuardado)
  aplicarColorAcento(colorGuardado)
})

// Cambiar tema
const cambiarTema = (nuevoTema) => {
  tema.value = nuevoTema
  localStorage.setItem('lms_tema', nuevoTema)
  aplicarTema(nuevoTema)
}

// Aplicar tema al documento
const aplicarTema = (temaActual) => {
  if (temaActual === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    temaActual = prefersDark ? 'dark' : 'light'
  }
  
  if (temaActual === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
    document.body.classList.add('dark-mode')
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light')
    document.body.classList.remove('dark-mode')
  }
}

// Cambiar color de acento
const cambiarColorAcento = (color) => {
  colorAcento.value = color.name
  localStorage.setItem('lms_color', color.name)
  aplicarColorAcento(color.name)
  
  // Feedback visual
  const notification = document.createElement('div')
  notification.className = 'position-fixed top-0 end-0 m-3 alert alert-success animate-fade-in'
  notification.style.zIndex = '9999'
  notification.innerHTML = `
    <i class="bi bi-check-circle me-2"></i>
    Color de acento cambiado a ${color.displayName}
  `
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 2000)
}

// Aplicar color de acento
const aplicarColorAcento = (colorName) => {
  const colorObj = colores.find(c => c.name === colorName)
  if (!colorObj) return
  
  const root = document.documentElement
  
  // Aplicar color principal
  root.style.setProperty('--color-primary', colorObj.value)
  root.style.setProperty('--color-gradient', colorObj.gradient)
  
  // Actualizar todos los elementos con gradiente
  const style = document.createElement('style')
  style.id = 'dynamic-accent-colors'
  
  // Remover estilo anterior si existe
  const oldStyle = document.getElementById('dynamic-accent-colors')
  if (oldStyle) oldStyle.remove()
  
  style.textContent = `
    .btn-gradient, .list-group-item.active {
      background: ${colorObj.gradient} !important;
    }
    
    .btn-gradient {
      border: none;
      color: white;
    }
    
    .text-gradient {
      background: ${colorObj.gradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
    }
    
    /* Asegurar que los títulos sean visibles en modo oscuro */
    body.dark-mode h1:not(.text-gradient),
    body.dark-mode h2:not(.text-gradient),
    body.dark-mode h3:not(.text-gradient),
    body.dark-mode h4:not(.text-gradient),
    body.dark-mode h5:not(.text-gradient),
    body.dark-mode h6:not(.text-gradient) {
      color: #e0e0e0 !important;
    }
    
    .nav-link.active, .nav-link:hover {
      color: ${colorObj.value} !important;
    }
    
    .btn-outline-primary {
      color: ${colorObj.value};
      border-color: ${colorObj.value};
    }
    
    .btn-outline-primary:hover {
      background: ${colorObj.value};
      border-color: ${colorObj.value};
      color: white;
    }
    
    .badge.bg-primary {
      background: ${colorObj.value} !important;
    }
    
    .border-primary {
      border-color: ${colorObj.value} !important;
    }
    
    .text-primary {
      color: ${colorObj.value} !important;
    }
    
    .bg-primary {
      background: ${colorObj.value} !important;
    }
    
    .progress-bar {
      background: ${colorObj.gradient} !important;
    }
    
    a {
      color: ${colorObj.value};
    }
    
    .form-check-input:checked {
      background-color: ${colorObj.value};
      border-color: ${colorObj.value};
    }
    
    .pagination .page-item.active .page-link {
      background: ${colorObj.gradient} !important;
      border-color: ${colorObj.value} !important;
    }
    
    /* Efectos hover */
    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px ${colorObj.value}33;
    }
    
    .card-hover:hover {
      border-color: ${colorObj.value}66;
      box-shadow: 0 8px 25px ${colorObj.value}22;
    }
  `
  
  document.head.appendChild(style)
}

// Guardar notificaciones
const guardarNotificaciones = () => {
  localStorage.setItem('lms_notificaciones', JSON.stringify(notificaciones.value))
  
  // Feedback visual
  const notification = document.createElement('div')
  notification.className = 'position-fixed top-0 end-0 m-3 alert alert-success animate-fade-in'
  notification.style.zIndex = '9999'
  notification.innerHTML = '<i class="bi bi-check-circle me-2"></i>Preferencias guardadas correctamente'
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 2000)
}

// Activar 2FA
const activar2FA = () => {
  alert('La autenticación de dos factores estará disponible próximamente')
}

// Escuchar cambios en preferencia del sistema
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (tema.value === 'auto') {
      aplicarTema('auto')
    }
  })
}
</script>

<style scoped>
.list-group-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option {
  transition: all 0.3s ease;
}

.color-option:hover {
  transform: scale(1.1);
  filter: brightness(1.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease;
}
</style>