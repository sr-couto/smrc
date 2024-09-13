<script setup>
import DialogShareDB from "./DialogShareDB.vue";
import DialogImportDB from "./DialogImportDB.vue";
import { useCounterStore } from "@/stores/counter.js";
import { useFileDialog } from "@vueuse/core";

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
    class="fixed bottom-0 left-0 z-[60] text-xs flex items-center justify-between h-12 border-t bg-background border-secondary"
  >
    <div
      class="grid @container grid-cols-2 gap-[1px] bg-secondary min-w-80 border-r border-secondary"
    >
      <DialogImportDB />
      <DialogShareDB />
    </div>
  </div>
</template>
