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

        <!-- Resto del código permanece igual... -->
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from '../stores/auth'
import Layout from '../components/Layout.vue'

const route = useRoute()
const loading = ref(true)
const curso = ref(null)
const clases = ref([])
const mensajes = ref([])
const nuevoMensaje = ref('')
const enviandoMensaje = ref(false)
const matriculando = ref(false)
const estoyMatriculado = ref(false)

// ✅ FUNCIÓN MEJORADA: Verificar matrícula de forma consistente
const verificarMatricula = () => {
  if (!authStore.user || !curso.value) return false
  
  const key = `matricula_${authStore.user.id}_${curso.value.id}`
  const matriculaGuardada = localStorage.getItem(key)
  
  return matriculaGuardada === 'true'
}

// ✅ Formateadores
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarCurso = async () => {
  try {
    const cursoId = parseInt(route.params.id)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // ✅ DATOS CONSISTENTES con IDs únicos
    const cursosDemo = [
      {
        id: 1,
        titulo: 'Introducción a la Programación',
        codigo: 'PROG-101',
        descripcion: 'Aprende los fundamentos de la programación con ejemplos prácticos',
        activo: true,
        creador: { nombre: 'Juan', apellido: 'Pérez' },
        _count: { clases: 12, matriculas: 45, mensajes: 23 }
      },
      {
        id: 2,
        titulo: 'Base de Datos Avanzada',
        codigo: 'BD-301',
        descripcion: 'Diseño, implementación y optimización de bases de datos',
        activo: true,
        creador: { nombre: 'María', apellido: 'García' },
        _count: { clases: 10, matriculas: 32, mensajes: 18 }
      },
      {
        id: 3,
        titulo: 'Desarrollo Web Full Stack',
        codigo: 'WEB-401',
        descripcion: 'Domina el desarrollo web completo',
        activo: true,
        creador: { nombre: 'Carlos', apellido: 'López' },
        _count: { clases: 18, matriculas: 58, mensajes: 45 }
      }
    ]
    
    curso.value = cursosDemo.find(c => c.id === cursoId) || null
  } catch (error) {
    console.error('Error cargando curso:', error)
  }
}

const cargarClases = async () => {
  try {
    const cursoId = parseInt(route.params.id)
    
    const clasesDemo = {
      1: [
        {
          id: 1,
          titulo: 'Variables y Tipos de Datos',
          descripcion: 'Aprende sobre variables y tipos de datos básicos',
          fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 60,
          orden: 1,
          _count: { materiales: 3, tareas: 1 }
        },
        {
          id: 2,
          titulo: 'Estructuras de Control',
          descripcion: 'If, else, switch y bucles',
          fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 90,
          orden: 2,
          _count: { materiales: 4, tareas: 2 }
        }
      ],
      2: [
        {
          id: 4,
          titulo: 'Modelo Entidad-Relación',
          descripcion: 'Diseño conceptual de bases de datos',
          fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 90,
          orden: 1,
          _count: { materiales: 6, tareas: 1 }
        }
      ],
      3: [
        {
          id: 5,
          titulo: 'HTML5 y CSS3 Moderno',
          descripcion: 'Fundamentos del desarrollo web',
          fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: 120,
          orden: 1,
          _count: { materiales: 8, tareas: 3 }
        }
      ]
    }
    
    clases.value = clasesDemo[cursoId] || []
  } catch (error) {
    console.error('Error cargando clases:', error)
  }
}

const cargarMensajes = async () => {
  try {
    const ahora = Date.now()
    mensajes.value = [
      {
        id: 1,
        contenido: '¿Cuándo es la próxima clase?',
        usuario: {
          nombre: 'María',
          apellido: 'González',
          rol: 'ESTUDIANTE'
        },
        createdAt: new Date(ahora - 3600000).toISOString()
      },
      {
        id: 2,
        contenido: 'La próxima clase es en 3 días a las 10:00 AM',
        usuario: {
          nombre: 'Juan',
          apellido: 'Pérez',
          rol: 'DOCENTE'
        },
        createdAt: new Date(ahora - 1800000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Error cargando mensajes:', error)
  }
}

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || enviandoMensaje.value) return

  try {
    enviandoMensaje.value = true
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mensaje = {
      id: Date.now(),
      contenido: nuevoMensaje.value,
      usuario: {
        nombre: authStore.user?.nombre || 'Usuario',
        apellido: authStore.user?.apellido || 'Demo',
        rol: authStore.user?.rol || 'ESTUDIANTE'
      },
      createdAt: new Date().toISOString()
    }
    
    mensajes.value.push(mensaje)
    nuevoMensaje.value = ''
    
    setTimeout(() => {
      const container = document.querySelector('.mensajes-container')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 100)
  } catch (error) {
    console.error('Error enviando mensaje:', error)
  } finally {
    enviandoMensaje.value = false
  }
}

// ✅ MATRÍCULA MEJORADA: Persistente y consistente
const matricularse = async () => {
  try {
    matriculando.value = true
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Guardar en localStorage
    const key = `matricula_${authStore.user.id}_${curso.value.id}`
    localStorage.setItem(key, 'true')
    
    estoyMatriculado.value = true
    
    // Crear notificación de éxito (sin alert)
    console.log('✅ Matriculado exitosamente en:', curso.value.titulo)
  } catch (error) {
    console.error('Error matriculándose:', error)
  } finally {
    matriculando.value = false
  }
}

const desmatricularse = async () => {
  if (!confirm('¿Estás seguro de que deseas desmatricularte de este curso?')) return
  
  try {
    matriculando.value = true
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Eliminar de localStorage
    const key = `matricula_${authStore.user.id}_${curso.value.id}`
    localStorage.removeItem(key)
    
    estoyMatriculado.value = false
    
    console.log('✅ Desmatriculado de:', curso.value.titulo)
  } catch (error) {
    console.error('Error desmatriculándose:', error)
  } finally {
    matriculando.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    cargarCurso(),
    cargarClases(),
    cargarMensajes()
  ])
  loading.value = false
  
  // ✅ Verificar matrícula de forma consistente
  estoyMatriculado.value = verificarMatricula()
})
</script>

<style scoped>
.mensajes-container::-webkit-scrollbar {
  width: 6px;
}

.mensajes-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.mensajes-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}
</style>