<script setup>
import { RouterView } from "vue-router";

import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <main class="w-full font-mono bg-background min-h-screen text-foreground">
    <RouterView />
    <div
      v-if="offlineReady || needRefresh"
      class="pwa-toast"
      role="alert"
    >
      <div class="message">
        <span v-if="offlineReady">
          Aplicación lista para trabajar sin conexión
        </span>
        <span v-else>
          Hay contenido nuevo disponible, haga clic en el botón de recarga para actualizar.
        </span>
      </div>
      <button
        v-if="needRefresh"
        @click="updateServiceWorker()"
      >
        Recargar
      </button>
      <button @click="close">
        Cerrar
      </button>
    </div>
  </main>
</template>

<style scoped>
nav a.router-link-exact-active {
  @apply text-primary;
}
</style>

<style>
.pwa-toast {
  @apply bg-background border-secondary text-foreground fixed right-0 bottom-12 m-3 p-3 z-[9999] text-left
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
