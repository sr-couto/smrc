<script setup>
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { ref } from 'vue';
import { useCounterStore } from '@/stores/counter'
import { X } from 'lucide-vue-next';
const counter = useCounterStore()
const fileName = ref('')
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      class="px-5 h-12"
      aria-label="Update dimensions"
    >
      Exportar
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="top"
        :align="'start'"
        :side-offset="5"
        class="rounded font-mono p-5 w-[260px] text-foreground border border-secondary bg-background shadow-lg focus:shadow will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade z-10"
      >
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Nombre del archivo
          </p>
          <input
            type="text"
            class="h-8 bg-background border border-secondary"
            v-model="fileName"
          >
          <button
            class="text-primary ml-auto text-sm underline underline-offset-2 font-medium"
            @click="counter.exportDatabase(fileName)"
          >
            Exportar
          </button>
        </div>
        <PopoverClose
          class="size-6 inline-flex items-center justify-center absolute top-[5px] right-[5px] outline-none cursor-default"
          aria-label="Close"
        >
          <X class="size-4" />
        </PopoverClose>
        <PopoverArrow class="fill-background" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>