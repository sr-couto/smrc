<script setup>
import { PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { useCounterStore } from '@/stores/counter'
import { X, Download } from 'lucide-vue-next';

import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
const counter = useCounterStore()
const { file_name } = storeToRefs(counter)

const input = ref(file_name)

watch(input, (v) => {
  if (v)
    counter.update_database(input.value)
    counter.auto_save()
})
</script>
<template>
  <PopoverRoot>
    <PopoverTrigger
      class="px-2 h-12 items-center justify-center gap-2 text-xs flex bg-background hover:bg-background/50 focus-visible:bg-background/50 outline-none"
      aria-label="Update dimensions"
    >
      <Download class="size-4" />
      <span class="hidden sm:inline-flex">ExportarDB</span>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="top"
        :align="'end'"
        :side-offset="5"
        class="rounded translate-x-1 font-mono p-5 w-[296px] text-foreground border border-secondary bg-background shadow-lg focus:shadow will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade z-10"
      >
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Nombre del archivo
          </p>
          <input
            type="text"
            class="h-8 border bg-background border-secondary"
            v-model="input"
          >
          <button
            class="ml-auto text-sm font-medium underline text-primary underline-offset-2"
            @click="counter.export_database(input.value)"
          >
            Crear JSON
          </button>
        </div>
        <PopoverClose
          class="size-6 inline-flex items-center justify-center absolute top-[5px] right-[5px] outline-none cursor-default"
          aria-label="Close"
        >
          <X class="size-4" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>