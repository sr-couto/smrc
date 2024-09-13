<script setup>
import { Upload, HardDriveUpload, X } from "lucide-vue-next";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "radix-vue";

import { ref } from "vue";

import { useCounterStore } from "@/stores/counter";
import { useFileDialog, useTimeoutFn, useDropZone } from "@vueuse/core";

const openDialog = ref(false);
const counter = useCounterStore();
const dropZoneRef = ref();
const filesData = ref([]);
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

const { open, onChange } = useFileDialog({
  accept: "application/json",
});

onChange((files) => {
  if (files) {
    if (files[0].type !== "application/json") {
      alert("El archivo seleccionado no es un archivo JSON");
      return;
    }
    counter.import_database(files[0]);
    filesData.value = files;
    useTimeoutFn(() => {
      filesData.value = [];
    }, 3000);
  }
});

function onDrop(files) {
  if (files) {
    if (files[0].type !== "application/json") {
      alert("El archivo seleccionado no es un archivo JSON");
      return;
    }
    counter.import_database(files[0]);
    counter.showProjects = true;
    filesData.value = files;
    useTimeoutFn(() => {
      filesData.value = [];
    }, 3000);
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="counter.showImportModal">
    <AlertDialogTrigger
      class="flex items-center justify-center h-12 gap-2 px-2 text-xs border outline-none border-secondary bg-background hover:bg-background/50 focus-visible:border-primary focus-visible:bg-primary/10"
    >
      <Upload class="size-4" />
      <span class="">ImportarDB</span>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-background/95 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0 z-[70]"
      />
      <AlertDialogContent>
        <div
          ref="dropZoneRef"
          :class="isOverDropZone ? ' border-animated ' : '   '"
          class="dropZone fixed flex-col font-mono inset-0 text-foreground z-[90] justify-center flex items-center"
        >
          <div
            class="flex flex-col items-center justify-center w-full h-16"
            v-auto-animate
          >
            <div class="flex flex-col items-center justify-center w-full gap-2 px-3 text-center text-pretty">
              <HardDriveUpload class="size-12" />
              <AlertDialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
                ImportarDB
              </AlertDialogTitle>
              <AlertDialogDescription
                class="text-foreground mt-4 text-pretty max-w-96 text-center mb-3 text-[15px] leading-normal"
              >
                Selecciona o arrastrar un archivo JSON exportado desde esta app.
              </AlertDialogDescription>
              <button
                type="button"
                @click="open()"
                class="mb-4 text-sm underline text-primary underline-offset-2"
              >
                Seleccionar archivo JSON
              </button>
              <AlertDialogCancel
                class="bg-secondary text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Cancelar
              </AlertDialogCancel>
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
  background: linear-gradient(90deg, hsl(var(--primary)) 50%, transparent 50%),
    linear-gradient(90deg, hsl(var(--primary)) 50%, transparent 50%),
    linear-gradient(0deg, hsl(var(--primary)) 50%, transparent 50%),
    linear-gradient(0deg, hsl(var(--primary)) 50%, transparent 50%);
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
