<script setup>
import { useCounterStore } from "@/stores/counter";
import ProjectListSearch from "@/components/ProjectListSearch.vue";
import SidebarTop from "@/components/SidebarTop.vue";
const counter = useCounterStore();
</script>

<template>
  <div>
    <header
      class="fixed top-0 z-50 flex flex-col justify-start h-screen border-r lg:sticky bg-background border-secondary"
      :class="counter.showProjects ? 'min-w-80' : ' '"
    >
      <SidebarTop />
      <ProjectListSearch v-show="counter.showProjects" />
    </header>
    <button
      @click="counter.showProjects = !counter.showProjects"
      v-show="counter.showProjects"
      class="fixed inset-0 z-40 bg-background/10 lg:hidden"
    />
  </div>
</template>