<template>
  <Layout>
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <div class="glass-effect p-4 animate-fade-in">
            <div class="d-flex align-items-center gap-3">
              <RouterLink to="/cursos" class="btn btn-light btn-sm">
                <i class="bi bi-arrow-left me-2"></i>Volver
              </RouterLink>
              <div>
                <h1 class="h2 mb-2 text-gradient">
                  <i class="bi bi-plus-circle-fill me-2"></i>Crear Nuevo Curso
                </h1>
                <p class="text-muted mb-0">Crea un nuevo curso para el sistema educativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="glass-effect p-5 animate-slide-in">
            <form @submit.prevent="crearCurso">
              <!-- Título -->
              <div class="mb-4">
                <label for="titulo" class="form-label fw-semibold">
                  <i class="bi bi-book me-2"></i>Título del Curso <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  v-model="formulario.titulo"
                  class="form-control border-0 bg-transparent"
                  placeholder="Ej: Introducción a la Programación"
                  required
                />
              </div>

              <!-- Código -->
              <div class="mb-4">
                <label for="codigo" class="form-label fw-semibold">
                  <i class="bi bi-tag me-2"></i>Código del Curso <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="codigo"
                  v-model="formulario.codigo"
                  class="form-control border-0 bg-transparent"
                  placeholder="Ej: PROG-101"
                  required
                  pattern="[A-Z0-9-]+"
                  title="Solo letras mayúsculas, números y guiones"
                />
                <small class="text-muted">Formato: Letras mayúsculas, números y guiones (ej: PROG-101)</small>
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
                  placeholder="Describe el contenido y objetivos del curso..."
                ></textarea>
              </div>

              <!-- Estado -->
              <div class="mb-4">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="activo"
                    v-model="formulario.activo"
                    checked
                  />
                  <label class="form-check-label fw-semibold" for="activo">
                    <i class="bi bi-toggle-on me-2"></i>Curso Activo
                  </label>
                  <small class="d-block text-muted">Los cursos activos son visibles para los estudiantes</small>
                </div>
              </div>

              <!-- Botones -->
              <div class="d-flex gap-3 mt-5">
                <button
                  type="submit"
                  class="btn btn-gradient flex-grow-1"
                  :disabled="guardando"
                >
                  <i class="bi bi-check-circle me-2"></i>
                  {{ guardando ? 'Creando...' : 'Crear Curso' }}
                </button>
                <RouterLink to="/cursos" class="btn btn-light">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'
import { api } from '@/services/api'
import Layout from '../components/Layout.vue'

const router = useRouter()
const guardando = ref(false)
const error = ref(null)

const formulario = ref({
  titulo: '',
  codigo: '',
  descripcion: '',
  activo: true
})

const crearCurso = async () => {
  try {
    guardando.value = true
    error.value = null

    // Validar que el código esté en mayúsculas
    const codigoFormateado = formulario.value.codigo.toUpperCase().trim()

    const datosCurso = {
      titulo: formulario.value.titulo.trim(),
      codigo: codigoFormateado,
      descripcion: formulario.value.descripcion.trim() || null,
      activo: formulario.value.activo
    }

    // Verificar si estamos en modo demo
    const DEMO_MODE = true // Basado en authStore

    if (DEMO_MODE) {
      // Simular creación en modo demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Curso creado exitosamente (modo demo)')
      router.push('/cursos')
      return
    }

    // Crear curso en backend real
    const response = await api.post('/cursos', datosCurso)
    
    if (response.data) {
      alert('Curso creado exitosamente')
      router.push(`/cursos/${response.data.id}`)
    }
  } catch (err) {
    console.error('Error creando curso:', err)
    error.value = err.response?.data?.message || 'Error al crear el curso. Por favor, intenta nuevamente.'
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  // Verificar permisos
  if (!authStore.isAdmin) {
    router.push('/cursos')
  }
})
</script>

<style scoped>
.form-control:focus {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}
</style>

