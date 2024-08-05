<script setup>
import { Upload, HardDriveUpload, X } from 'lucide-vue-next';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'radix-vue'

import { computed, ref } from "vue";
import { useCounterStore } from "@/stores/counter";
import { useFileDialog, useTimeoutFn, useDropZone, useMouse, useWindowSize } from "@vueuse/core";

const openDialog = ref(false)
const counter = useCounterStore();
const dropZoneRef = ref();

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

const { open, onChange } = useFileDialog({
  accept: "application/json",
});
const filesData = ref([]);

onChange((files) => {
  if (files[0].type !== "application/json") {
    alert("El archivo seleccionado no es un archivo JSON");
    return;
  }
  counter.import_database(files[0]);
  filesData.value = files
  useTimeoutFn(() => {
    filesData.value = [];
    
  }, 3000);
});

function onDrop(files) {
  if (files[0].type !== "application/json") {
    alert("El archivo seleccionado no es un archivo JSON");
    return;
  }
  if (files) {
    counter.import_database(files[0]);
    counter.showProjects = true;
    filesData.value = files
    useTimeoutFn(() => {
      filesData.value = [];
      
    }, 3000);
  }
}

function handleAction() {
  alert('clicked action button!')
}
</script>

<template>
  <AlertDialogRoot v-model:open="openDialog">
    <AlertDialogTrigger
      class="px-2 h-12 items-center justify-center gap-2 text-xs flex bg-background hover:bg-background/50 focus-visible:bg-background/50 outline-none"
    >
      <Upload class="size-4" />
      <span class="hidden sm:inline-flex">ImportarDB</span>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="bg-background/90 data-[state=open]:animate-overlayShow fixed inset-0 z-[70]" />
      <AlertDialogContent>
        <div
          ref="dropZoneRef"
          :class="isOverDropZone ? ' border-animated ' : '   '"
          class="dropZone fixed flex-col font-mono inset-0 text-foreground z-[999] justify-center flex items-center"
        >
          <HardDriveUpload />
          <AlertDialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
            ImportarDB
          </AlertDialogTitle>
          <AlertDialogDescription
            class="text-foreground mt-4 text-pretty max-w-96 text-center mb-5 text-[15px] leading-normal"
          >
            Selecciona o arrastrar un archivo JSON exportado desde esta app.
          </AlertDialogDescription>
          <div
            class="flex flex-col items-center justify-center w-full duration-100 h-16"
            v-auto-animate
          >
            <div
              v-if="filesData.length === 0"
              class="flex flex-col w-full justify-center items-center gap-6 px-3 text-center text-pretty"
            >
              <button
                type="button"
                @click="open()"
                class="text-sm underline text-primary underline-offset-2"
              >
                Seleccionar archivo JSON
              </button>
              <AlertDialogCancel class="">
                Cancelar
              </AlertDialogCancel>
            </div>
            <div
              v-else
              class="flex justify-center flex-col items-center w-full gap-2 px-3 text-center text-pretty"
            >
              <div class="flex gap-1 items-center">
                <h2>Importado OK</h2>
                <template
                  v-for="(file, index) in filesData"
                  :key="index"
                >
                  <p>
                    desde {{ file.name }}
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogCancel class="fixed top-0 m-3 right-0 z-[999] text-foreground">
          <X />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style>

.border-animated:before {
  @apply absolute inset-2;
  content: "";
  background: linear-gradient(90deg, #3b82f6 50%, transparent 50%),
    linear-gradient(90deg, #3b82f6 50%, transparent 50%),
    linear-gradient(0deg, #3b82f6 50%, transparent 50%),
    linear-gradient(0deg, #3b82f6 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size:
    20px 2px,
    20px 2px,
    2px 20px,
    2px 20px;
  background-position:
    0px 0px,
    400px 100%,
    0px 70px,
    100% 0px;
  padding: 0;
  animation: border-dance 30s infinite linear;
}

@keyframes border-dance {
  0% {
    background-position:
      /* 0px 0px,
      300px 155px,
      0px 150px,
      445px 0px; */
      0px 0px,
      0 100%,
      0px 0px,
      100% 0px;
  }

  100% {
    background-position:
      /* 300px 0px,
      0px 155px,
      0px 0px,
      445px 150px; */
      -50% 0px,
      50% 100%,
      0px 50%,
      100% -50%;
  }
}
</style>