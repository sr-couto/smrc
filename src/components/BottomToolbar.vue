<script setup>
import DialogShareDB from "./DialogShareDB.vue";
import DialogImportDB from "./DialogImportDB.vue";
import { useCounterStore } from "@/stores/counter.js";
import { useFileDialog } from "@vueuse/core";
import { Delete } from "lucide-vue-next";

const counter = useCounterStore();

const { onChange } = useFileDialog({
  accept: "application/json",
});

onChange((files) => {
  counter.import_database(files[0]);
  counter.showProjects = true;
});
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-[60] text-xs flex items-center justify-between h-12 border-t bg-background border-secondary"
  >
    <div
      class="grid @container grid-cols-2 gap-[1px] bg-secondary min-w-32 sm:min-w-80 border-r border-secondary"
    >
      <DialogImportDB />
      <DialogShareDB />
    </div>
    <div class="flex items-center justify-end w-full">
      <!-- <button
        v-show="counter.project_name !== ''"
        @click="counter.clear_editor()"
        :class="counter.project_name
          ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground '
          : 'opacity-50 bg-secondary  pointer-events-none'
        "
        class="flex items-center h-12 gap-2 px-3 text-xs"
      >
        Limpiar editor 
      </button> -->
      <button
        v-show="counter.loaded_id !== null"
        @click="counter.delete_project()"
        class="h-12 px-5 ml-auto hover:bg-primary/5"
        :class="
          counter.loaded_id ? 'text-primary' : 'opacity-50 pointer-events-none'
        "
        :disabled="counter.loaded_id === null"
      >
        Eliminar documento
      </button>
    </div>
  </div>
</template>
