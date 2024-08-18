<script setup>
import { RouterView } from "vue-router";
import { useColorMode } from "@vueuse/core";
import { Toaster } from 'vue-sonner'
import ToastOffline from "./components/ToastOffline.vue";

const mode = useColorMode();
</script>

<template>
  <main
    class="w-full min-h-screen font-mono bg-background text-foreground"
  >
    <RouterView />
  </main>
  <ToastOffline />
  <Toaster :theme="mode === 'light' ? 'light' : 'dark'" />
</template>

<style scoped>
nav a.router-link-exact-active {
  @apply text-primary;
}
</style>


