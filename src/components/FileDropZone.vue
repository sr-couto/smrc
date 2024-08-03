<script setup>
import { HardDriveUpload } from "lucide-vue-next";
import { useFileDialog, useTimeoutFn, useDropZone } from "@vueuse/core";
import { ref } from "vue";
import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();

const dropZoneRef = ref();
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

const { open, onChange } = useFileDialog({
  accept: "application/json",
});
const filesData = ref([]);

onChange((files) => {
  counter.import_database(files[0]);
});

function onDrop(files) {
  if (files) {
    counter.import_database(files[0]);
    counter.showProjects = true;
    useTimeoutFn(() => {
      filesData.value = [];
    }, 3000);
  }
}
</script>

<template>
  <div
    ref="dropZoneRef"
    class="h-40 w-64"
  >
    <div
      :class="isOverDropZone ? ' border-animated ' : ''"
      class="dropZone bg-secondary/80 absolute left-0 bottom-12 w-64 z-[999] duration-100"
    >
      <div
        class="flex flex-col items-center justify-center w-full h-40 duration-100 min-w-64"
        :class="
          isOverDropZone
            ? '!border-primary bg-primary/10 hover:border-red-600'
            : ''
        "
        v-auto-animate
      >
        <div
          v-if="filesData.length === 0"
          class="flex flex-col w-full justify-center items-center gap-2 px-3 text-center text-pretty"
        >
          <HardDriveUpload />
          <h1>Importar proyectos</h1>
          <button
            type="button"
            @click="open()"
            class="text-xs underline text-primary underline-offset-2"
          >
            Seleccionar archivo JSON
          </button>
        </div>
        <div
          v-else
          class="flex flex-col w-full gap-2 px-3 text-center text-pretty"
        >
          <h2>Importado OK</h2>
          <template
            v-for="(file, index) in filesData"
            :key="index"
          >
            <p class="text-xs">
              desde {{ file.name }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.border-animated:before {
  @apply absolute inset-0;
  content: "";
  background: linear-gradient(90deg, #3b82f6 50%, transparent 50%),
    linear-gradient(90deg, #3b82f6 50%, transparent 50%),
    linear-gradient(0deg, #3b82f6 50%, transparent 50%),
    linear-gradient(0deg, #3b82f6 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size:
    15px 4px,
    15px 4px,
    4px 15px,
    4px 15px;
  background-position:
    0px 0px,
    200px 155px,
    0px 70px,
    15.75rem 0px;
  padding: 0;
  animation: border-dance 14s infinite linear;
}

@keyframes border-dance {
  0% {
    background-position:
      0px 0px,
      300px 155px,
      0px 150px,
      15.75rem 0px;
  }

  100% {
    background-position:
      300px 0px,
      0px 155px,
      0px 0px,
      15.75rem 150px;
  }
}
</style>
