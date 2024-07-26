<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="w-full flex font-mono">
    <main class="w-full bg-background min-h-screen text-foreground ">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
nav a.router-link-exact-active {
  @apply text-primary
}
/* 
nav a.router-link-exact-active:hover {
  background-color: transparent;
} */
</style>
