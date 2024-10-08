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
} from "radix-vue";
import { Download, X } from "lucide-vue-next";
import { onMounted, shallowRef, watch } from "vue";
import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();
import { storeToRefs } from "pinia";
import {  refDebounced } from "@vueuse/core";

const { file_name } = storeToRefs(counter);

const input = shallowRef(file_name);

const debounced = refDebounced(input, 100);

watch(debounced, (v) => {
  if (v) counter.share_database();
});

onMounted(() => {
  counter.share_database();
});
</script>

<template>
  <DialogRoot>
    <DialogTrigger
      class="flex items-center justify-center h-12 gap-2 px-2 text-xs border outline-none border-secondary bg-background hover:bg-background/50 focus-visible:border-primary focus-visible:bg-primary/10"
      aria-label="Update dimensions"
    >
      <Download class="size-4" />
      <span class="">ExportarDB</span>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="bg-secondary/90 data-[state=open]:animate-overlayShow fixed inset-0 z-[90]"
      />
      <DialogContent
        class="data-[state=open]:animate-contentShow font-mono fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-3 md:p-[25px] shadow focus:outline-none z-[9000]"
      >
        <DialogClose
          class="text-foreground hover:bg-secondary/80 hover:text-foreground  absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center focus:outline-none"
          aria-label="Close"
        >
          <X class="size-4" />
        </DialogClose>
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          ExportarDB
        </DialogTitle>
        <DialogDescription class="mt-3 text-sm text-foreground">
          Nombre del archivo
        </DialogDescription>
        <div class="flex gap-2 mb-2">
          <input
            type="text"
            class="w-full h-8 px-2 border bg-background text-foreground border-border"
            v-model="input"
          >
          <button
            class="px-5 ml-auto text-xs font-medium border bg-primary border-secondary shrink-0 text-primary-foreground hover:bg-primary/80 focus:outline-none"
            @click="counter.export_database(input.value)"
          >
            Exportar DB
          </button>
        </div>
        <!-- <div
          class="overflow-x-hidden overflow-y-auto h-96"
          :class="copied ? 'ring-2 ring-primary' : ''"
        >
          <ScrollAreaRoot
            class="w-full overflow-hidden rounded h-96"
            style="--scrollbar-size: 10px"
          >
            <ScrollAreaViewport class="w-full h-full rounded">
              <div class="">
                <pre
                  class="p-2 overflow-x-auto overflow-y-auto text-xs font-normal text-foreground/80 text-nowrap bg-secondary md:w-full"
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
        <div
          class="flex items-center justify-end mt-6"
        >
          <DialogClose as-child>
            <button
              class="bg-secondary text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              Cerrar ventana
            </button>
          </DialogClose>
          <!-- <div class="flex gap-2 text-xs">
            <div
              v-if="isSupported"
              class="flex gap-2"
            >
              <button
                @click="copy(counter.shareOptions)"
                class="bg-secondary duration-300 text-foreground hover:bg-backgorund/80 text-xs inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                :class="copied ? '!bg-primary text-white' : 'text-foreground'"
              >
                <span v-if="!copied">Copiar JSON</span>
                <span v-else>Json Copiado!</span>
              </button>
            </div>
            <p v-else>
              Your browser does not support Clipboard API
            </p>
          </div> -->
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
