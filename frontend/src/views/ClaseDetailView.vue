<template>
  <Layout>
    <div class="container-fluid">
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando curso...</p>
      </div>

      <div v-else-if="!curso" class="text-center py-5">
        <div class="glass-effect p-5">
          <i class="bi bi-exclamation-circle text-muted" style="font-size: 4rem;"></i>
          <h4 class="text-muted mt-3">Curso no encontrado</h4>
          <RouterLink to="/cursos" class="btn btn-gradient mt-3">
            Volver a Cursos
          </RouterLink>
        </div>
      </div>

      <div v-else>
        <!-- Header del curso -->
        <div class="row mb-5">
          <div class="col">
            <div class="glass-effect p-4 animate-fade-in">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h1 class="h2 mb-2 text-gradient">{{ curso.titulo }}</h1>
                  <p class="text-muted mb-2 fs-5">
                    <i class="bi bi-tag me-2"></i>{{ curso.codigo }}
                  </p>
                  <p class="mb-3">{{ curso.descripcion }}</p>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-success bg-opacity-10 text-success px-3 py-2">
                      <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>
                      {{ curso.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                      <i class="bi bi-person-badge me-1"></i>
                      {{ curso.creador.nombre }} {{ curso.creador.apellido }}
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <button 
                    v-if="!estoyMatriculado"
                    @click="matricularse"
                    class="btn btn-gradient mb-2"
                    :disabled="matriculando">
                    <span v-if="matriculando">
                      <div class="loading-spinner me-2" style="width: 16px; height: 16px;"></div>
                      Matriculando...
                    </span>
                    <span v-else>
                      <i class="bi bi-plus-circle me-2"></i>Matricularme
                    </span>
                  </button>
                  <button 
                    v-else
                    @click="desmatricularse"
                    class="btn btn-outline-danger mb-2"
                    :disabled="matriculando">
                    <i class="bi bi-dash-circle me-2"></i>Desmatricularse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4 mb-5">
          <div class="col-md-4">
            <div class="card-hover h-100 animate-bounce-in">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 70px; height: 70px;">
                  <i class="bi bi-collection-play-fill text-primary fs-2"></i>
                </div>
                <h3 class="h2 mb-1">{{ curso._count.clases }}</h3>
                <p class="text-muted mb-0">Clases</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 70px; height: 70px;">
                  <i class="bi bi-people-fill text-success fs-2"></i>
                </div>
                <h3 class="h2 mb-1">{{ curso._count.matriculas }}</h3>
                <p class="text-muted mb-0">Estudiantes</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
              <div class="card-body text-center p-4">
                <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                     style="width: 70px; height: 70px;">
                  <i class="bi bi-chat-dots-fill text-info fs-2"></i>
                </div>
                <h3 class="h2 mb-1">{{ curso._count.mensajes }}</h3>
                <p class="text-muted mb-0">Mensajes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="row g-4">
          <!-- Clases -->
          <div class="col-lg-8">
            <div class="card-hover animate-slide-in">
              <div class="card-header border-0 bg-transparent p-4">
                <h5 class="mb-0 text-gradient">
                  <i class="bi bi-collection-play me-2"></i>Clases del Curso
                </h5>
              </div>
              <div class="card-body p-4">
                <div v-if="clases.length === 0" class="text-center py-5 text-muted">
                  No hay clases disponibles
                </div>
                <div v-else class="d-flex flex-column gap-3">
                  <div
                    v-for="clase in clases"
                    :key="clase.id"
                    class="glass-effect p-4 rounded-3 hover-lift">
                    <div class="d-flex justify-content-between align-items-start">
                      <div class="flex-grow-1">
                        <h6 class="mb-2 fw-bold">{{ clase.titulo }}</h6>
                        <p class="text-muted small mb-3">{{ clase.descripcion }}</p>
                        <div class="d-flex gap-3 text-muted small">
                          <span>
                            <i class="bi bi-calendar me-1"></i>{{ formatDate(clase.fecha) }}
                          </span>
                          <span v-if="clase.duracion">
                            <i class="bi bi-clock me-1"></i>{{ clase.duracion }} min
                          </span>
                          <span>
                            <i class="bi bi-file-earmark me-1"></i>{{ clase._count.materiales }} materiales
                          </span>
                          <span>
                            <i class="bi bi-clipboard-check me-1"></i>{{ clase._count.tareas }} tareas
                          </span>
                        </div>
                      </div>
                      <RouterLink
                        :to="`/cursos/${curso.id}/clases/${clase.id}`"
                        class="btn btn-gradient btn-sm ms-3">
                        <i class="bi bi-arrow-right"></i>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Foro de Discusión -->
            <div class="card-hover animate-slide-in">
              <div class="card-header border-0 bg-transparent p-4">
                <h6 class="mb-0 text-gradient">
                  <i class="bi bi-chat-dots-fill me-2"></i>Foro de Discusión
                </h6>
              </div>
              <div class="card-body p-4">
                <div class="mensajes-container" style="max-height: 400px; overflow-y: auto;">
                  <div v-if="mensajes.length === 0" class="text-center py-4 text-muted small">
                    No hay mensajes aún
                  </div>
                  <div v-else class="d-flex flex-column gap-3 mb-3">
                    <div
                      v-for="mensaje in mensajes"
                      :key="mensaje.id"
                      class="glass-effect p-3 rounded-3">
                      <div class="d-flex align-items-start gap-2 mb-2">
                        <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                             style="width: 32px; height: 32px; font-size: 0.75rem;">
                          {{ mensaje.usuario.nombre[0] }}{{ mensaje.usuario.apellido[0] }}
                        </div>
                        <div class="flex-grow-1">
                          <div class="d-flex justify-content-between align-items-start">
                            <span class="fw-semibold small">
                              {{ mensaje.usuario.nombre }} {{ mensaje.usuario.apellido }}
                            </span>
                            <span class="badge bg-secondary bg-opacity-10 text-secondary small">
                              {{ mensaje.usuario.rol }}
                            </span>
                          </div>
                          <p class="mb-1 small">{{ mensaje.contenido }}</p>
                          <small class="text-muted">{{ formatTime(mensaje.createdAt) }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <form @submit.prevent="enviarMensaje" class="mt-3">
                  <div class="input-group">
                    <input
                      v-model="nuevoMensaje"
                      type="text"
                      class="form-control border-0 bg-light"
                      placeholder="Escribe un mensaje..."
                      :disabled="enviandoMensaje"
                    />
                    <button
                      type="submit"
                      class="btn btn-gradient"
                      :disabled="enviandoMensaje || !nuevoMensaje.trim()">
                      <i class="bi bi-send-fill"></i>
                    </button>
                  </div>
                </form>
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
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import Layout from '@/components/Layout.vue'
import { DocumentIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const loading = ref(true)
const clase = ref(null)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const cargarClase = async () => {
  try {
    const cursoId = route.params.id
    const claseId = route.params.claseId
    const response = await api.get(`/clases/${claseId}`)
    clase.value = response.data
  } catch (error) {
    console.error('Error cargando clase:', error)
  } finally {
    loading.value = false
  }
}

const descargarMaterial = async (material) => {
  try {
    const response = await api.get(`/materiales/download-url/${material.archivoUrl}`)
    window.open(response.data, '_blank')
  } catch (error) {
    console.error('Error descargando material:', error)
  }
}

onMounted(() => {
  cargarClase()
})
</script>
