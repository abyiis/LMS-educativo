<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { authStore } from './stores/auth'

// Verificar autenticación al cargar la app
onMounted(() => {
  authStore.checkAuth()
})
</script>

<style>
/* Estilos globales si son necesarios */
#app {
  width: 100%;
  min-height: 100vh;
}
</style>