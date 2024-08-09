<script setup>
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'radix-vue'
import { CircleHelp, Download, X } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();
import { storeToRefs } from 'pinia';
const source = ref('Hello')
import { useClipboard, refDebounced } from '@vueuse/core'
const { text, copy, copied, isSupported } = useClipboard({ source })

const { file_name } = storeToRefs(counter);

const input = ref(file_name);

const debounced = refDebounced(input, 100);

watch(input, (v) => {
  if (v) counter.update_database(input.value);
  counter.auto_save();
});

watch(debounced, (v) => {
  if (v) counter.share_database();
});

onMounted(() => {
  counter.share_database();
})
</script>

<template>
  <DialogRoot>
    <DialogTrigger
      class="px-2 h-12 items-center justify-center gap-2 text-xs flex bg-background hover:bg-background/50 focus-visible:bg-background/50 outline-none"
      aria-label="Update dimensions"
    >
      <Download class="size-4" />
      <span class="hidden sm:inline-flex">ExportarDB</span>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-secondary/90 data-[state=open]:animate-overlayShow fixed inset-0 z-[90]" />
      <DialogContent
        class="data-[state=open]:animate-contentShow font-mono fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-3 md:p-[25px] shadow focus:outline-none z-[9000]"
      >
        <DialogClose
          class="text-foreground hover:bg-secondary/80 hover:text-foreground focus:shadow absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center   focus:outline-none"
          aria-label="Close"
        >
          <X class="size-4" />
        </DialogClose>
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          ExportarDB
        </DialogTitle>
        <DialogDescription class="mt-3 text-foreground text-sm">
          Nombre del archivo
        </DialogDescription>
        <div class="flex gap-2 mb-2">
          <input
            type="text"
            class="h-8 border  w-full bg-background text-foreground border-border"
            v-model="input"
          >
          <button
            class="ml-auto px-5 bg-secondary/20 border border-secondary shrink-0 text-xs font-medium  text-foreground hover:bg-secondary/80 hover:text-foreground focus:shadow-[0_0_0_2px] focus:outline-none"
            @click="counter.export_database(input.value)"
          >
            Exportar DB
          </button>
        </div>
        <!-- <div
          class="overflow-y-auto overflow-x-hidden h-96"
          :class="copied ? 'ring-2 ring-primary' : ''"
        >
          <ScrollAreaRoot
            class="w-full h-96 rounded overflow-hidden"
            style="--scrollbar-size: 10px"
          >
            <ScrollAreaViewport class="w-full h-full rounded">
              <div class="">
                <pre
                  class="text-xs overflow-y-auto font-normal overflow-x-auto text-foreground/80 text-nowrap bg-secondary md:w-full  p-2"
                >{{ counter.shareOptions }}</pre>
              </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar
              class="flex select-none touch-none p-0.5 bg-secondary transition-colors duration-[160ms] ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="vertical"
            >
              <ScrollAreaThumb
                class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
              />
            </ScrollAreaScrollbar>
            <ScrollAreaScrollbar
              class="flex select-none touch-none p-0.5 bg-secondary transition-colors duration-[160ms] ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="horizontal"
            >
              <ScrollAreaThumb
                class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
              />
            </ScrollAreaScrollbar>
          </ScrollAreaRoot>
        </div> -->
        <div class="mt-3 text-xs text-foreground flex justify-between items-center">
          <DialogClose as-child>
            <button
              class="bg-secondary text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              Cerrar ventana
            </button>
          </DialogClose>
          <div class="flex gap-2 text-xs">
            <div
              v-if="isSupported"
              class="flex gap-2"
            >
              <button
                @click="copy(counter.shareOptions)"
                class="bg-secondary duration-300 text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                :class="copied ? '!bg-primary text-white' : 'text-foreground'"
              >
                <!-- by default, `copied` will be reset in 1.5s -->
                <span v-if="!copied">Copiar JSON</span>
                <span
                  
                  v-else
                >Json Copiado!</span>
              </button>
            </div>
            <p v-else>
              Your browser does not support Clipboard API
            </p>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>