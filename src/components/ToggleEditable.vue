<script setup>
import { useCounterStore } from "@/stores/counter";
import Tooltip from "./ui/Tooltip.vue";
import { Eye, Pencil } from "lucide-vue-next";
const counter = useCounterStore();
</script>

<template>
  <Tooltip
    :name="
      counter.content_editable
        ? 'Cambiar a previsualizar'
        : 'Cambiar a modo editable'
    "
    shortcut="Ctrl Shift E"
    side="bottom"
  >
    <button
      @click="counter.toggleEditable"
      class="flex items-center justify-center bg-background hover:bg-secondary/80 size-8"
      :class="counter.showProjects ? ' border border-secondary ' : '  '"
    >
      <Eye
        class="size-4"
        v-show="counter.content_editable"
      />
      <Pencil
        class="size-4"
        v-show="!counter.content_editable"
      />
    </button>
  </Tooltip>
</template>
