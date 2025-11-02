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
                    <input class="form-check-input" type="checkbox" checked>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Nuevas Tareas</h6>
                    <p class="text-muted small mb-0">Notificar cuando se asignen nuevas tareas</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" checked>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Calificaciones</h6>
                    <p class="text-muted small mb-0">Avisar cuando recibas una calificación</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" checked>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center glass-effect p-3 rounded-3">
                  <div>
                    <h6 class="mb-1">Mensajes de Curso</h6>
                    <p class="text-muted small mb-0">Notificar nuevos mensajes en tus cursos</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button class="btn btn-gradient">
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
                    <div class="glass-effect p-3 rounded-3 text-center hover-lift cursor-pointer">
                      <i class="bi bi-sun-fill text-warning fs-1 mb-2"></i>
                      <p class="mb-0 fw-semibold">Claro</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="glass-effect p-3 rounded-3 text-center hover-lift cursor-pointer border border-primary">
                      <i class="bi bi-moon-fill text-primary fs-1 mb-2"></i>
                      <p class="mb-0 fw-semibold">Oscuro</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="glass-effect p-3 rounded-3 text-center hover-lift cursor-pointer">
                      <i class="bi bi-circle-half text-info fs-1 mb-2"></i>
                      <p class="mb-0 fw-semibold">Automático</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold">Color de Acento</label>
                <div class="d-flex gap-2">
                  <div class="rounded-circle bg-primary hover-lift cursor-pointer" style="width: 50px; height: 50px;"></div>
                  <div class="rounded-circle bg-success hover-lift cursor-pointer" style="width: 50px; height: 50px;"></div>
                  <div class="rounded-circle bg-danger hover-lift cursor-pointer" style="width: 50px; height: 50px;"></div>
                  <div class="rounded-circle bg-warning hover-lift cursor-pointer" style="width: 50px; height: 50px;"></div>
                  <div class="rounded-circle bg-info hover-lift cursor-pointer" style="width: 50px; height: 50px;"></div>
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
                    <input class="form-check-input" type="checkbox" checked>
                    <label class="form-check-label">Perfil visible</label>
                  </div>
                </div>
                <div class="glass-effect p-3 rounded-3">
                  <h6 class="mb-2">Autenticación de Dos Factores</h6>
                  <p class="text-muted small mb-3">Añade una capa extra de seguridad</p>
                  <button class="btn btn-outline-primary">
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
import { ref } from 'vue'
import Layout from '../components/Layout.vue'

const seccionActiva = ref('notificaciones')

const menuItems = [
  { id: 'notificaciones', label: 'Notificaciones', icon: 'bi bi-bell-fill' },
  { id: 'apariencia', label: 'Apariencia', icon: 'bi bi-palette-fill' },
  { id: 'privacidad', label: 'Privacidad', icon: 'bi bi-shield-lock-fill' }
]
</script>

<style scoped>
.list-group-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.cursor-pointer {
  cursor: pointer;
}
</style>