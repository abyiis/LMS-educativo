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
                  <i class="bi bi-award-fill me-2"></i>Mis Certificados
                </h1>
                <p class="text-muted mb-0 fs-5">Tus logros y certificaciones obtenidas</p>
              </div>
              <div class="text-end">
                <div class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <i class="bi bi-trophy-fill me-2"></i>
                  <span class="fw-bold">{{ certificados.length }} Certificados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card-hover h-100 animate-bounce-in">
            <div class="card-body text-center p-4">
              <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 70px; height: 70px;">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
              </div>
              <h3 class="h2 mb-1">5</h3>
              <p class="text-muted mb-0">Cursos Completados</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.1s;">
            <div class="card-body text-center p-4">
              <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 70px; height: 70px;">
                <i class="bi bi-star-fill text-warning fs-1"></i>
              </div>
              <h3 class="h2 mb-1">4.8</h3>
              <p class="text-muted mb-0">Promedio de Certificación</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-hover h-100 animate-bounce-in" style="animation-delay: 0.2s;">
            <div class="card-body text-center p-4">
              <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                   style="width: 70px; height: 70px;">
                <i class="bi bi-clock-history text-info fs-1"></i>
              </div>
              <h3 class="h2 mb-1">120</h3>
              <p class="text-muted mb-0">Horas de Estudio</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in">
            <select v-model="filtroAnio" class="form-select border-0 bg-transparent">
              <option value="">Todos los años</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.1s;">
            <select v-model="filtroCategoria" class="form-select border-0 bg-transparent">
              <option value="">Todas las categorías</option>
              <option value="programacion">Programación</option>
              <option value="diseno">Diseño</option>
              <option value="negocios">Negocios</option>
            </select>
          </div>
        </div>
        <div class="col-md-4">
          <div class="glass-effect p-3 animate-slide-in" style="animation-delay: 0.2s;">
            <input 
              type="text" 
              v-model="busqueda"
              class="form-control border-0 bg-transparent" 
              placeholder="Buscar certificados...">
          </div>
        </div>
      </div>

      <!-- Grid de Certificados -->
      <div v-if="loading" class="text-center py-5">
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-3">Cargando certificados...</p>
      </div>

      <div v-else-if="certificados.length === 0" class="text-center py-5">
        <div class="glass-effect p-5 animate-bounce-in">
          <div class="mb-4">
            <i class="bi bi-award text-muted" style="font-size: 5rem;"></i>
          </div>
          <h4 class="text-muted mb-3">Aún no tienes certificados</h4>
          <p class="text-muted mb-4">Completa tus cursos para obtener certificaciones</p>
          <RouterLink to="/cursos" class="btn btn-gradient">
            <i class="bi bi-book me-2"></i>Explorar Cursos
          </RouterLink>
        </div>
      </div>

      <div v-else class="row g-4">
        <div 
          v-for="(cert, index) in certificados" 
          :key="cert.id"
          class="col-md-6 col-lg-4">
          <div class="card-hover h-100 animate-bounce-in" :style="{ animationDelay: `${0.3 + index * 0.1}s` }">
            <div class="position-relative overflow-hidden rounded-top" style="height: 200px;">
              <div class="w-100 h-100 d-flex align-items-center justify-content-center"
                   :style="{ background: cert.color }">
                <div class="text-center text-white p-4">
                  <i class="bi bi-award-fill" style="font-size: 4rem;"></i>
                  <h4 class="mt-3 fw-bold">CERTIFICADO</h4>
                </div>
              </div>
              <div class="position-absolute top-0 end-0 m-3">
                <span class="badge bg-white text-dark">
                  <i class="bi bi-calendar me-1"></i>{{ cert.anio }}
                </span>
              </div>
            </div>
            <div class="card-body p-4">
              <span class="badge bg-primary bg-opacity-10 text-primary mb-2">{{ cert.categoria }}</span>
              <h5 class="card-title fw-bold mb-2">{{ cert.titulo }}</h5>
              <p class="text-muted small mb-3">{{ cert.descripcion }}</p>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center text-muted small">
                  <i class="bi bi-star-fill text-warning me-1"></i>
                  <span>{{ cert.calificacion }}/5.0</span>
                </div>
                <div class="text-muted small">
                  <i class="bi bi-clock me-1"></i>{{ cert.horas }}h
                </div>
              </div>
              <div class="d-grid gap-2">
                <button @click="verCertificado(cert)" class="btn btn-gradient">
                  <i class="bi bi-eye me-2"></i>Ver Certificado
                </button>
                <button @click="descargarCertificado(cert)" class="btn btn-outline-primary">
                  <i class="bi bi-download me-2"></i>Descargar PDF
                </button>
                <button @click="compartirCertificado(cert)" class="btn btn-outline-success">
                  <i class="bi bi-share me-2"></i>Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos Certificados -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card-hover animate-fade-in" style="animation-delay: 0.8s;">
            <div class="card-header border-0 bg-transparent p-4">
              <h5 class="mb-0 text-gradient">
                <i class="bi bi-hourglass-split me-2"></i>Próximos a Obtener
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-6 col-lg-4">
                  <div class="glass-effect p-3 rounded-3 hover-lift">
                    <div class="d-flex align-items-center mb-3">
                      <i class="bi bi-trophy text-warning fs-3 me-3"></i>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">Desarrollo Web Avanzado</h6>
                        <small class="text-muted">Te falta: 15%</small>
                      </div>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar bg-gradient-primary" style="width: 85%"></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="glass-effect p-3 rounded-3 hover-lift">
                    <div class="d-flex align-items-center mb-3">
                      <i class="bi bi-trophy text-warning fs-3 me-3"></i>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">Python para Data Science</h6>
                        <small class="text-muted">Te falta: 40%</small>
                      </div>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar bg-gradient-primary" style="width: 60%"></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="glass-effect p-3 rounded-3 hover-lift">
                    <div class="d-flex align-items-center mb-3">
                      <i class="bi bi-trophy text-warning fs-3 me-3"></i>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">Machine Learning Básico</h6>
                        <small class="text-muted">Te falta: 70%</small>
                      </div>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar bg-gradient-primary" style="width: 30%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Vista Previa -->
    <div class="modal fade" id="certificadoModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content glass-effect border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title text-gradient">Vista Previa del Certificado</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-5">
            <div class="text-center p-5 border border-3 border-warning rounded-3" 
                 style="background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);">
              <i class="bi bi-award-fill text-warning" style="font-size: 5rem;"></i>
              <h2 class="mt-4 mb-3 text-gradient">CERTIFICADO DE FINALIZACIÓN</h2>
              <h4 class="mb-4">{{ certificadoSeleccionado?.titulo }}</h4>
              <p class="mb-4">Se certifica que</p>
              <h3 class="text-gradient mb-4">{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</h3>
              <p class="mb-4">Ha completado satisfactoriamente el curso con una calificación de</p>
              <h2 class="text-warning mb-4">{{ certificadoSeleccionado?.calificacion }}/5.0</h2>
              <div class="row mt-5">
                <div class="col-6">
                  <hr>
                  <p class="mb-0 small">Firma del Instructor</p>
                </div>
                <div class="col-6">
                  <hr>
                  <p class="mb-0 small">Fecha de Emisión</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-gradient">
              <i class="bi bi-download me-2"></i>Descargar
            </button>
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
import { Modal } from 'bootstrap'

const loading = ref(false)
const filtroAnio = ref('')
const filtroCategoria = ref('')
const busqueda = ref('')
const certificadoSeleccionado = ref(null)

const certificados = ref([
  {
    id: 1,
    titulo: 'Desarrollo Web Full Stack',
    descripcion: 'Certificación en desarrollo web completo con HTML, CSS, JavaScript y frameworks modernos',
    categoria: 'Programación',
    calificacion: 4.9,
    horas: 120,
    anio: 2024,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    titulo: 'Base de Datos Avanzada',
    descripcion: 'Certificación en diseño, optimización y administración de bases de datos',
    categoria: 'Programación',
    calificacion: 4.7,
    horas: 80,
    anio: 2024,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    titulo: 'UI/UX Design',
    descripcion: 'Certificación en diseño de interfaces y experiencia de usuario',
    categoria: 'Diseño',
    calificacion: 4.8,
    horas: 60,
    anio: 2023,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    titulo: 'Marketing Digital',
    descripcion: 'Certificación en estrategias de marketing digital y redes sociales',
    categoria: 'Negocios',
    calificacion: 4.6,
    horas: 50,
    anio: 2023,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 5,
    titulo: 'Cloud Computing AWS',
    descripcion: 'Certificación en servicios en la nube con Amazon Web Services',
    categoria: 'Programación',
    calificacion: 4.9,
    horas: 100,
    anio: 2024,
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
])

const verCertificado = (cert) => {
  certificadoSeleccionado.value = cert
  const modal = new Modal(document.getElementById('certificadoModal'))
  modal.show()
}

const descargarCertificado = (cert) => {
  alert(`📥 Descargando certificado: ${cert.titulo}`)
}

const compartirCertificado = (cert) => {
  if (navigator.share) {
    navigator.share({
      title: `Certificado: ${cert.titulo}`,
      text: `¡He obtenido mi certificado en ${cert.titulo}!`,
      url: window.location.href
    })
  } else {
    alert('🔗 Link copiado al portapapeles (función de compartir)')
  }
}

onMounted(() => {
  // Cargar certificados
})
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>