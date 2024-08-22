<script setup>
import { useRegisterSW } from "virtual:pwa-register/vue";
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

async function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}

</script>

<template>
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
        Hay una nueva versión disponible, haga clic en el botón de recarga
        para actualizar o en cerrar para dejarla pendiente.
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
</template>

<style>
.pwa-toast {
  @apply bg-secondary font-mono border border-background text-foreground fixed right-0 bottom-11 m-3 p-3 z-[9999] text-left;
}
.pwa-toast .message {
  margin-bottom: 8px;
  @apply text-xs w-64;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
  @apply text-xs font-mono;
}

</style>