<template>
  <div class="min-vh-100">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
      <div class="container-fluid">
        <!-- Brand -->
        <router-link :to="homeRoute" class="navbar-brand fw-bold text-gradient animate-bounce-in">
          <i class="bi bi-mortarboard-fill me-2 pulse"></i>
          LMS Educativo
        </router-link>

        <!-- Mobile toggle -->
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nav items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li v-if="!authStore.isAdmin && !authStore.isDocente" class="nav-item animate-slide-in" style="animation-delay: 0.1s;">
              <router-link to="/dashboard" class="nav-link" active-class="active">
                <i class="bi bi-house-fill me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item animate-slide-in" style="animation-delay: 0.2s;">
              <router-link to="/cursos" class="nav-link" active-class="active">
                <i class="bi bi-book-fill me-1"></i> Cursos
              </router-link>
            </li>
            <li v-if="!authStore.isAdmin" class="nav-item animate-slide-in" style="animation-delay: 0.3s;">
              <router-link to="/tareas" class="nav-link" active-class="active">
                <i class="bi bi-clipboard-check-fill me-1"></i> Tareas
              </router-link>
            </li>
            <li v-if="authStore.isDocente || authStore.isAdmin" class="nav-item animate-slide-in" style="animation-delay: 0.35s;">
              <router-link to="/entregas" class="nav-link" active-class="active">
                <i class="bi bi-file-earmark-check-fill me-1"></i> Entregas
              </router-link>
            </li>
            <li v-if="!authStore.isDocente && !authStore.isAdmin" class="nav-item animate-slide-in" style="animation-delay: 0.4s;">
              <router-link to="/calificaciones" class="nav-link" active-class="active">
                <i class="bi bi-star-fill me-1"></i> Calificaciones
              </router-link>
            </li>
            <li v-if="!authStore.isDocente && !authStore.isAdmin" class="nav-item animate-slide-in" style="animation-delay: 0.5s;">
              <router-link to="/certificados" class="nav-link" active-class="active">
                <i class="bi bi-award-fill me-1"></i> Certificados
              </router-link>
            </li>
            <li v-if="!authStore.isDocente && !authStore.isAdmin" class="nav-item dropdown animate-slide-in" style="animation-delay: 0.6s;">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-grid-fill me-1"></i> Más
              </a>
              <ul class="dropdown-menu glass-effect border-0 shadow-lg">
                <li>
                  <router-link to="/calendario" class="dropdown-item hover-lift">
                    <i class="bi bi-calendar-event me-2 text-primary"></i> Calendario
                  </router-link>
                </li>
                <li>
                  <router-link to="/progreso" class="dropdown-item hover-lift">
                    <i class="bi bi-graph-up-arrow me-2 text-success"></i> Mi Progreso
                  </router-link>
                </li>
              </ul>
            </li>
            <li v-if="authStore.isAdmin" class="nav-item animate-slide-in" style="animation-delay: 0.7s;">
              <router-link to="/admin" class="nav-link" active-class="active">
                <i class="bi bi-gear-fill me-1"></i> Admin
              </router-link>
            </li>
          </ul>

          <!-- User menu -->
          <div class="dropdown animate-slide-in" style="animation-delay: 0.7s;">
            <button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center hover-lift" 
                    data-bs-toggle="dropdown">
              <div class="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center position-relative" 
                   style="width: 36px; height: 36px; font-size: 14px; font-weight: 600;">
                {{ userInitials }}
                <div class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle" 
                     style="width: 12px; height: 12px;">
                  <span class="visually-hidden">Usuario activo</span>
                </div>
              </div>
              <div class="d-flex flex-column align-items-start">
                <span class="fw-semibold">{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</span>
                <small class="text-muted">{{ getRoleText(authStore.user?.rol) }}</small>
              </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end glass-effect border-0 shadow-lg">
              <li><span class="dropdown-header text-gradient fw-bold">{{ getRoleText(authStore.user?.rol) }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item hover-lift" to="/profile">
                  <i class="bi bi-person-fill me-2 text-primary"></i> Mi Perfil
                </router-link>
              </li>
              <li v-if="!authStore.isDocente && !authStore.isAdmin">
                <router-link class="dropdown-item hover-lift" to="/certificados">
                  <i class="bi bi-award-fill me-2 text-warning"></i> Mis Certificados
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item hover-lift" to="/settings">
                  <i class="bi bi-gear-fill me-2 text-secondary"></i> Configuración
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item hover-lift text-danger" href="#" @click.prevent="logout">
                  <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="container-fluid" style="padding-top: 100px; padding-bottom: 20px;">
      <div class="animate-fade-in">
        <slot />
      </div>
    </main>

    <!-- Floating Action Button para móviles -->
    <div class="d-lg-none position-fixed bottom-0 end-0 p-3" style="z-index: 1000;">
      <button class="btn btn-gradient rounded-circle shadow-lg pulse" 
              style="width: 60px; height: 60px;"
              data-bs-toggle="offcanvas" 
              data-bs-target="#mobileMenu">
        <i class="bi bi-list fs-4"></i>
      </button>
    </div>

    <!-- Mobile Menu Offcanvas -->
    <div class="offcanvas offcanvas-end glass-effect" tabindex="-1" id="mobileMenu">
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title text-gradient">Menú</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
        <div class="offcanvas-body">
        <div class="d-flex flex-column gap-3">
          <router-link v-if="!authStore.isAdmin && !authStore.isDocente" to="/dashboard" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-house-fill me-2"></i> Dashboard
          </router-link>
          <router-link to="/cursos" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-book-fill me-2"></i> Cursos
          </router-link>
          <router-link v-if="!authStore.isAdmin" to="/tareas" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-clipboard-check-fill me-2"></i> Tareas
          </router-link>
          <router-link v-if="authStore.isDocente || authStore.isAdmin" to="/entregas" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-file-earmark-check-fill me-2"></i> Entregas
          </router-link>
          <router-link v-if="!authStore.isDocente && !authStore.isAdmin" to="/calificaciones" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-star-fill me-2"></i> Calificaciones
          </router-link>
          <router-link v-if="!authStore.isDocente && !authStore.isAdmin" to="/certificados" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-award-fill me-2"></i> Certificados
          </router-link>
          <router-link v-if="!authStore.isDocente && !authStore.isAdmin" to="/calendario" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-calendar-event me-2"></i> Calendario
          </router-link>
          <router-link v-if="!authStore.isDocente && !authStore.isAdmin" to="/progreso" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-graph-up-arrow me-2"></i> Mi Progreso
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="btn btn-outline-primary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-gear-fill me-2"></i> Admin
          </router-link>
          
          <hr class="my-2">
          
          <router-link to="/profile" class="btn btn-outline-secondary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-person-fill me-2"></i> Mi Perfil
          </router-link>
          <router-link to="/settings" class="btn btn-outline-secondary text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-gear-fill me-2"></i> Configuración
          </router-link>
          
          <button @click="logout" class="btn btn-outline-danger text-start" data-bs-dismiss="offcanvas">
            <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-3 glass-effect">
  <div class="container-fluid py-4">
    <div class="row g-4 align-items-start">
      <!-- Logo y Descripción -->
      <div class="col-lg-3 col-md-6">
        <div class="animate-fade-in">
          <h4 class="text-gradient fw-bold mb-3">
            <i class="bi bi-mortarboard-fill me-2"></i>LMS Educativo
          </h4>
          <p class="text-muted mb-3 small">
            Plataforma de gestión de aprendizaje diseñada para potenciar tu educación y alcanzar tus metas académicas.
          </p>
          <div class="d-flex gap-2">
            <a href="#" class="btn btn-sm btn-outline-primary rounded-circle hover-lift" style="width: 40px; height: 40px;">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="btn btn-sm btn-outline-primary rounded-circle hover-lift" style="width: 40px; height: 40px;">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="btn btn-sm btn-outline-primary rounded-circle hover-lift" style="width: 40px; height: 40px;">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="btn btn-sm btn-outline-primary rounded-circle hover-lift" style="width: 40px; height: 40px;">
              <i class="bi bi-linkedin"></i>
            </a>
            <a href="#" class="btn btn-sm btn-outline-primary rounded-circle hover-lift" style="width: 40px; height: 40px;">
              <i class="bi bi-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div class="col-lg-3 col-md-6">
        <div class="animate-fade-in" style="animation-delay: 0.2s;">
          <h6 class="text-gradient fw-bold mb-3">Contacto</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <div class="d-flex align-items-start">
                <i class="bi bi-geo-alt-fill text-primary me-2 mt-1"></i>
                <small class="text-muted">Medellín, Colombia</small>
              </div>
            </li>
            <li class="mb-2">
              <div class="d-flex align-items-start">
                <i class="bi bi-envelope-fill text-primary me-2 mt-1"></i>
                <small class="text-muted">info@lmseducativo.com</small>
              </div>
            </li>
            <li class="mb-2">
              <div class="d-flex align-items-start">
                <i class="bi bi-phone-fill text-primary me-2 mt-1"></i>
                <small class="text-muted">+57 300 123 4567</small>
              </div>
            </li>
            <li>
              <div class="d-flex align-items-start">
                <i class="bi bi-clock-fill text-primary me-2 mt-1"></i>
                <small class="text-muted">Lun - Vie: 8AM - 6PM</small>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="col-lg-6 col-md-12">
        <div class="animate-fade-in" style="animation-delay: 0.4s;">
          <h6 class="text-gradient fw-bold mb-3">
            <i class="bi bi-envelope-heart me-2"></i>Suscríbete a nuestro boletín
          </h6>
          <p class="text-muted mb-3 small">Recibe las últimas novedades, cursos y recursos educativos directamente en tu correo</p>
          <div class="row g-2">
            <div class="col-md-8">
              <input type="email" class="form-control glass-effect border-0" placeholder="Tu email">
            </div>
            <div class="col-md-4">
              <button class="btn btn-gradient w-100" type="button">
                <i class="bi bi-send-fill me-2"></i>Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="row mt-4 pt-3 border-top">
      <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
        <p class="text-muted mb-0 small animate-fade-in" style="animation-delay: 0.6s;">
          <i class="bi bi-mortarboard-fill me-1"></i>
          © 2024 LMS Educativo. Todos los derechos reservados.
        </p>
      </div>
      <div class="col-md-6 text-center text-md-end">
        <p class="text-muted mb-0 small animate-fade-in" style="animation-delay: 0.7s;">
          Hecho con <i class="bi bi-heart-fill text-danger"></i> en Colombia
          <span class="mx-2">|</span>
          <a href="#" class="text-muted text-decoration-none hover-lift">
            <i class="bi bi-arrow-up-circle me-1"></i>Volver arriba
          </a>
        </p>
      </div>
    </div>
  </div>
</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const router = useRouter()

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.nombre[0]}${authStore.user.apellido[0]}`.toUpperCase()
})

const homeRoute = computed(() => {
  return authStore.isAdmin ? '/admin' : (authStore.isDocente ? '/tareas' : '/dashboard')
})

const getRoleText = (rol) => {
  const roles = {
    'ADMIN': 'Administrador',
    'DOCENTE': 'Docente',
    'ESTUDIANTE': 'Estudiante'
  }
  return roles[rol] || rol
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar-custom {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
</style>