<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <main class="w-full font-mono bg-background min-h-screen text-foreground">
    <RouterView />
  </main>
</template>

<style scoped>
nav a.router-link-exact-active {
  @apply text-primary;
}
</style>
