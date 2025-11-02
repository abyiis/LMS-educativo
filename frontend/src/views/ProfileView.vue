<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header del Perfil -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-5 animate-fade-in">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="position-relative">
                  <div class="rounded-circle bg-gradient-primary text-white d-flex align-items-center justify-content-center pulse" 
                       style="width: 120px; height: 120px; font-size: 3rem; font-weight: 700;">
                    {{ userInitials }}
                  </div>
                  <button class="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 shadow-sm hover-lift"
                          style="width: 40px; height: 40px;">
                    <i class="bi bi-camera-fill"></i>
                  </button>
                </div>
              </div>
              <div class="col">
                <h1 class="h2 mb-2 text-gradient">{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</h1>
                <p class="text-muted mb-2 fs-5">
                  <i class="bi bi-envelope me-2"></i>{{ authStore.user?.email }}
                </p>
                <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <i class="bi bi-person-badge me-2"></i>{{ getRoleText(authStore.user?.rol) }}
                </span>
              </div>
              <div class="col-auto">
                <div class="text-end">
                  <p class="text-muted mb-1 small">Miembro desde</p>
                  <p class="fw-bold">Enero 2024</p>
                  <span class="badge bg-success">
                    <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards - Específicos por rol -->
      <div class="row g-4 mb-5">
        <!-- Stats para Estudiantes -->
        <template v-if="authStore.isEstudiante">
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-book-fill text-primary fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.cursosInscritos }}</h3>
                <p class="text-muted mb-0">Cursos Inscritos</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-check-circle-fill text-success fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.tareasEntregadas }}</h3>
                <p class="text-muted mb-0">Tareas Entregadas</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-star-fill text-warning fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.promedioGeneral }}</h3>
                <p class="text-muted mb-0">Promedio General</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.4s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-trophy-fill text-info fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.certificados }}</h3>
                <p class="text-muted mb-0">Certificados</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Stats para Docentes -->
        <template v-else-if="authStore.isDocente">
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-book-fill text-primary fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.cursosCreados }}</h3>
                <p class="text-muted mb-0">Cursos Creados</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-people-fill text-success fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.totalEstudiantes }}</h3>
                <p class="text-muted mb-0">Total Estudiantes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-clipboard-check text-warning fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.tareasCreadas }}</h3>
                <p class="text-muted mb-0">Tareas Creadas</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.4s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-file-earmark-check text-danger fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.entregasPendientes }}</h3>
                <p class="text-muted mb-0">Por Calificar</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Stats para Admin -->
        <template v-else-if="authStore.isAdmin">
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-people-fill text-primary fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.totalUsuarios }}</h3>
                <p class="text-muted mb-0">Usuarios Totales</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-book-fill text-success fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.totalCursos }}</h3>
                <p class="text-muted mb-0">Cursos Activos</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.3s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-person-badge text-warning fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.totalDocentes }}</h3>
                <p class="text-muted mb-0">Docentes</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.4s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-mortarboard-fill text-info fs-3"></i>
                </div>
                <h3 class="h4 mb-1">{{ stats.totalEstudiantes }}</h3>
                <p class="text-muted mb-0">Estudiantes</p>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Contenido Principal -->
      <div class="row g-4">
        <!-- Información Personal -->
        <div class="col-lg-8">
          <div class="card-hover animate-slide-in" style="animation-delay: 0.5s;">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-0 text-gradient">
                  <i class="bi bi-person-fill me-2"></i>Información Personal
                </h5>
                <button 
                  v-if="!editandoPerfil"
                  @click="editandoPerfil = true"
                  class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-pencil me-2"></i>Editar
                </button>
              </div>
            </div>
            <div class="card-body p-4">
              <form v-if="editandoPerfil" @submit.prevent="actualizarPerfil" class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person me-2 text-primary"></i>Nombre
                  </label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    class="form-control form-control-lg border-0 bg-light"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person me-2 text-primary"></i>Apellido
                  </label>
                  <input
                    v-model="form.apellido"
                    type="text"
                    class="form-control form-control-lg border-0 bg-light"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-envelope me-2 text-primary"></i>Correo electrónico
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control form-control-lg border-0 bg-light"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-telephone me-2 text-primary"></i>Teléfono
                  </label>
                  <input
                    v-model="form.telefono"
                    type="tel"
                    class="form-control form-control-lg border-0 bg-light"
                    placeholder="Opcional"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-chat-left-text me-2 text-primary"></i>Biografía
                  </label>
                  <textarea
                    v-model="form.biografia"
                    class="form-control border-0 bg-light"
                    rows="4"
                    placeholder="Cuéntanos un poco sobre ti..."
                  ></textarea>
                </div>
                <div class="col-12">
                  <div class="d-flex gap-2 justify-content-end">
                    <button 
                      type="button"
                      @click="cancelarEdicion"
                      class="btn btn-outline-secondary">
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      :disabled="loading"
                      class="btn btn-gradient">
                      <span v-if="loading">
                        <div class="loading-spinner me-2" style="width: 16px; height: 16px;"></div>
                        Guardando...
                      </span>
                      <span v-else">
                        <i class="bi bi-check-circle me-2"></i>Guardar Cambios
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              <div v-else class="row g-4">
                <div class="col-md-6">
                  <div class="glass-effect p-3 rounded-3">
                    <label class="text-muted small d-block mb-1">Nombre</label>
                    <p class="fw-semibold mb-0">{{ authStore.user?.nombre }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="glass-effect p-3 rounded-3">
                    <label class="text-muted small d-block mb-1">Apellido</label>
                    <p class="fw-semibold mb-0">{{ authStore.user?.apellido }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="glass-effect p-3 rounded-3">
                    <label class="text-muted small d-block mb-1">Correo electrónico</label>
                    <p class="fw-semibold mb-0">{{ authStore.user?.email }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="glass-effect p-3 rounded-3">
                    <label class="text-muted small d-block mb-1">Teléfono</label>
                    <p class="fw-semibold mb-0">{{ form.telefono || 'No especificado' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="glass-effect p-3 rounded-3">
                    <label class="text-muted small d-block mb-1">Rol</label>
                    <p class="fw-semibold mb-0">{{ getRoleText(authStore.user?.rol) }}</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="glass-effect p-3 rounded-3">
                    <label class="text-muted small d-block mb-1">Biografía</label>
                    <p class="mb-0">{{ form.biografia || 'Sin biografía' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cambiar Contraseña -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.6s;">
            <div class="card-header border-0 bg-transparent p-4">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-0 text-gradient">
                  <i class="bi bi-shield-lock me-2"></i>Seguridad
                </h5>
                <button 
                  v-if="!cambiandoPassword"
                  @click="cambiandoPassword = true"
                  class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-key me-2"></i>Cambiar Contraseña
                </button>
              </div>
            </div>
            <div class="card-body p-4">
              <form v-if="cambiandoPassword" @submit.prevent="cambiarContraseña" class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Contraseña Actual</label>
                  <input
                    v-model="passwordForm.password_actual"
                    type="password"
                    class="form-control border-0 bg-light"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Nueva Contraseña</label>
                  <input
                    v-model="passwordForm.password_nueva"
                    type="password"
                    class="form-control border-0 bg-light"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Confirmar Nueva Contraseña</label>
                  <input
                    v-model="passwordForm.password_confirmar"
                    type="password"
                    class="form-control border-0 bg-light"
                    required
                  />
                </div>
                <div class="col-12">
                  <div class="d-flex gap-2 justify-content-end">
                    <button 
                      type="button"
                      @click="cancelarCambioPassword"
                      class="btn btn-outline-secondary">
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      :disabled="passwordLoading"
                      class="btn btn-gradient">
                      <i class="bi bi-check-circle me-2"></i>Actualizar Contraseña
                    </button>
                  </div>
                </div>
              </form>
              <div v-else class="glass-effect p-3 rounded-3">
                <p class="mb-0 text-muted">
                  <i class="bi bi-info-circle me-2"></i>
                  Tu contraseña fue actualizada por última vez hace 30 días
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Actividad Reciente -->
          <div class="card-hover animate-slide-in" style="animation-delay: 0.7s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-clock-history me-2"></i>Actividad Reciente
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-start glass-effect p-3 rounded-3">
                  <div class="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                    <i class="bi bi-check-circle text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-semibold small">Perfil actualizado</p>
                    <p class="mb-0 text-muted small">Hace 1 hora</p>
                  </div>
                </div>
                <div class="d-flex align-items-start glass-effect p-3 rounded-3">
                  <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <i class="bi bi-book text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-semibold small">{{ authStore.isDocente ? 'Curso actualizado' : 'Clase completada' }}</p>
                    <p class="mb-0 text-muted small">Hace 2 días</p>
                  </div>
                </div>
                <div class="d-flex align-items-start glass-effect p-3 rounded-3">
                  <div class="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                    <i class="bi bi-star text-warning"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-semibold small">{{ authStore.isDocente ? 'Tarea calificada' : 'Calificación recibida' }}</p>
                    <p class="mb-0 text-muted small">Hace 3 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="card-hover mt-4 animate-slide-in" style="animation-delay: 0.8s;">
            <div class="card-body p-4">
              <h6 class="mb-3 text-gradient">
                <i class="bi bi-lightning-fill me-2"></i>Acciones Rápidas
              </h6>
              <div class="d-grid gap-2">
                <RouterLink v-if="authStore.isEstudiante" to="/cursos" class="btn btn-outline-primary">
                  <i class="bi bi-book me-2"></i>Explorar Cursos
                </RouterLink>
                <RouterLink v-if="authStore.isEstudiante" to="/calificaciones" class="btn btn-outline-success">
                  <i class="bi bi-star me-2"></i>Ver Calificaciones
                </RouterLink>
                <RouterLink v-if="authStore.isDocente" to="/tareas/crear" class="btn btn-outline-primary">
                  <i class="bi bi-plus-circle me-2"></i>Crear Tarea
                </RouterLink>
                <RouterLink v-if="authStore.isDocente" to="/entregas" class="btn btn-outline-warning">
                  <i class="bi bi-file-earmark-check me-2"></i>Ver Entregas
                </RouterLink>
                <RouterLink v-if="authStore.isAdmin" to="/admin" class="btn btn-outline-primary">
                  <i class="bi bi-gear me-2"></i>Panel Admin
                </RouterLink>
                <RouterLink to="/settings" class="btn btn-outline-info">
                  <i class="bi bi-gear-fill me-2"></i>Configuración
                </RouterLink>
                <button class="btn btn-outline-danger" @click="cerrarSesion">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
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
import { useRouter, RouterLink } from 'vue-router'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const router = useRouter()
const loading = ref(false)
const passwordLoading = ref(false)
const editandoPerfil = ref(false)
const cambiandoPassword = ref(false)

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  biografia: ''
})

const passwordForm = ref({
  password_actual: '',
  password_nueva: '',
  password_confirmar: ''
})

const stats = ref({
  // Estudiante
  cursosInscritos: 3,
  tareasEntregadas: 15,
  promedioGeneral: 88.5,
  certificados: 2,
  // Docente
  cursosCreados: 3,
  totalEstudiantes: 105,
  tareasCreadas: 24,
  entregasPendientes: 8,
  // Admin
  totalUsuarios: 156,
  totalCursos: 12,
  totalDocentes: 8,
  totalEstudiantes: 142
})

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.nombre[0]}${authStore.user.apellido[0]}`.toUpperCase()
})

const getRoleText = (rol) => {
  switch (rol) {
    case 'ADMIN': return 'Administrador'
    case 'DOCENTE': return 'Docente'
    case 'ESTUDIANTE': return 'Estudiante'
    default: return ''
  }
}

const cargarPerfil = async () => {
  try {
    const biografias = {
      ESTUDIANTE: 'Apasionado por la tecnología y el aprendizaje continuo. Me encanta resolver problemas complejos y aprender nuevas habilidades.',
      DOCENTE: 'Educador comprometido con la excelencia académica y el desarrollo integral de mis estudiantes. Especializado en metodologías innovadoras de enseñanza.',
      ADMIN: 'Administrador del sistema LMS. Enfocado en optimizar la experiencia educativa y garantizar el correcto funcionamiento de la plataforma.'
    }

    form.value = {
      nombre: authStore.user?.nombre || '',
      apellido: authStore.user?.apellido || '',
      email: authStore.user?.email || '',
      telefono: '+57 300 123 4567',
      biografia: biografias[authStore.user?.rol] || ''
    }
  } catch (error) {
    console.error('Error cargando perfil:', error)
  }
}

const actualizarPerfil = async () => {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    authStore.user = {
      ...authStore.user,
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email
    }
    
    editandoPerfil.value = false
    alert('✅ Perfil actualizado exitosamente')
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    alert('❌ Error al actualizar el perfil')
  } finally {
    loading.value = false
  }
}

const cancelarEdicion = () => {
  editandoPerfil.value = false
  cargarPerfil()
}

const cambiarContraseña = async () => {
  if (passwordForm.value.password_nueva !== passwordForm.value.password_confirmar) {
    alert('❌ Las contraseñas no coinciden')
    return
  }

  try {
    passwordLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordForm.value = {
      password_actual: '',
      password_nueva: '',
      password_confirmar: ''
    }
    
    cambiandoPassword.value = false
    alert('✅ Contraseña cambiada exitosamente')
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    alert('❌ Error al cambiar la contraseña')
  } finally {
    passwordLoading.value = false
  }
}

const cancelarCambioPassword = () => {
  cambiandoPassword.value = false
  passwordForm.value = {
    password_actual: '',
    password_nueva: '',
    password_confirmar: ''
  }
}

const cerrarSesion = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  cargarPerfil()
})
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>