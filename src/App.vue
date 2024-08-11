<script setup>
import { RouterView } from "vue-router";
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useStorage } from "@vueuse/core";
import { ToastAction, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'radix-vue'
const colorTheme = useStorage('theme');

import { useCounterStore } from "@/stores/counter";
import { X } from "lucide-vue-next";

const counter = useCounterStore();

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
  <main
    :class="colorTheme"
    class="w-full font-mono bg-background min-h-screen text-foreground"
  >
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
          Hay una nueva versión disponible, haga clic en el botón de recarga para actualizar o en cerrar para dejarla pendiente.
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
    <ToastProvider>
      <ToastRoot
        v-model:open="counter.openToast"
        class="bg-secondary text-foreground rounded-md shadow p-4 gap-2 text-xs grid data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] z-[1000] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
      >
        <ToastTitle class="mb-[5px] font-medium text-foreground">
          Notificación
        </ToastTitle>
        <ToastDescription>
          {{ counter.openToastDescription }}
        </ToastDescription>
      </ToastRoot>
      <ToastViewport class="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </ToastProvider>
  </main>
</template>

<style scoped>
nav a.router-link-exact-active {
  @apply text-primary;
}
</style>

<style>
.pwa-toast {
  @apply bg-secondary border border-background text-foreground fixed right-0 bottom-11 m-3 p-3 z-[9999] text-left
}
.pwa-toast .message {
  margin-bottom: 8px;
  @apply text-xs w-64 
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
  @apply text-xs
}


    
    
</style>
