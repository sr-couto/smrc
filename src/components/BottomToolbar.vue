<script setup>
import { useCounterStore } from "@/stores/counter";
import { useFileDialog } from "@vueuse/core";
import { Upload } from "lucide-vue-next";
import DialogShareDB from "./DialogShareDB.vue";
import DialogImportDB from "./DialogImportDB.vue";

const counter = useCounterStore();

const { open, onChange } = useFileDialog({
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
      class="grid grid-cols-2 gap-[1px] bg-secondary min-w-32 sm:min-w-80 border-r border-secondary"
    >
      <DialogImportDB />
      <DialogShareDB />
    </div>
    <div class="flex justify-end w-full">
      <button
        v-show="counter.loaded_id !== null"
        @click="counter.delete_project()"
        class="h-12 px-5 hover:bg-red-600/5"
        :class="
          counter.loaded_id ? 'text-red-600' : 'opacity-50 pointer-events-none'
        "
        :disabled="counter.loaded_id === null"
      >
        Eliminar documento
      </button>
    </div>
  </div>
</template>
