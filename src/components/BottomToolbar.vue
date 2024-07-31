<script setup>
import ExportPopover from '@/components/ExportPopover.vue'
import { useCounterStore } from '@/stores/counter'
import { useFileDialog } from '@vueuse/core'
import { Upload, Download  } from 'lucide-vue-next';

const counter = useCounterStore()

const { open, onChange } = useFileDialog({
  accept: 'application/json'
})

onChange((files) => {
  counter.import_database(files[0])
  counter.showProjects = true
})
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between h-12  text-sm border-t bg-background border-secondary"
  >
    <div class="grid grid-cols-2 gap-0.5 px-0.5 bg-secondary min-w-56 md:min-w-64 border-r border-secondary">
      <button
        @click="open()"
        class="h-12 px-2 items-center justify-center gap-2 text-xs flex bg-background hover:bg-background/50 focus-visible:bg-background/50 outline-none"
      >
        <Upload class="size-4" />
        <span class="hidden sm:inline-flex">ImportarDB</span>
      </button>
      <ExportPopover />
    </div>
    <div class="flex justify-end w-full">
      <button
        v-if="counter.loaded_id === null"
        @click="counter.create_project()"
        :disabled="counter.project_name === ''"
        class="h-12 px-3"
        :class="counter.project_name ? 'bg-primary text-white ' : 'opacity-50  pointer-events-none'"
      >
        Crear Proyecto
      </button>
      <button
        variant="destructive"
        v-if="counter.loaded_id !== null"
        @click="counter.delete_project()"
        class="h-12 px-3"
        :class="counter.loaded_id ? 'text-red-600' : 'opacity-50 pointer-events-none'"
        :disabled="counter.loaded_id === null"
      >
        Eliminar documento
      </button>
    </div>
  </div>
</template>