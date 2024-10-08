<script setup>
import { RouterView } from "vue-router";
import { useColorMode } from "@vueuse/core";
import { Toaster } from 'vue-sonner'
import ToastOffline from "@/components/ui/ToastOffline.vue";
const mode = useColorMode();

</script>

<template>
  <div>
    <main class="AppContainer">
      <RouterView />
    </main>
    <ToastOffline />
    <Toaster
      :theme="mode === 'light' ? 'light' : 'dark'"
      position="bottom-center"
    />
  </div>
</template>

<style scoped>

.AppContainer {
 @apply w-full min-h-screen font-mono bg-background text-foreground 
}

nav a.router-link-exact-active {
  @apply text-primary;
}
</style>


