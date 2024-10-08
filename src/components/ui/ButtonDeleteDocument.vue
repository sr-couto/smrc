<script setup>
import { Trash2 } from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();
</script>

<template>
  <button
    @click="counter.delete_project()"
    class="fixed bottom-0 right-0 flex items-center justify-center ml-auto text-xs size-8 hover:bg-primary/30 bg-primary/10"
    :class="counter.loaded_id ? 'text-primary' : 'hidden'"
  >
    <Trash2 class="size-4" />
  </button>
</template>