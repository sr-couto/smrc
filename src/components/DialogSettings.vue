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
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "radix-vue";
import { Settings, X,  MousePointer, Pointer, RotateCcw,  PlaneTakeoff, PlaneLanding } from "lucide-vue-next";
import Tooltip from "./ui/Tooltip.vue";
import { useCounterStore } from "@/stores/counter";
import { useStorage } from "@vueuse/core";
import ToggleTheme from "./ui/ToggleTheme.vue";

const counter = useCounterStore();
const cursorPointer = useStorage("cursor", true);
const tour = useStorage("product_tour_seen", false);

const toggleCursor = () => {
  cursorPointer.value = !cursorPointer.value;
};

const toggleTour = () => {
  tour.value = !tour.value;
  
};

</script>

<template>
  <DialogRoot>
    <Tooltip
      name="Configuraciones"
      :side="counter.showProjects ? 'bottom' : 'right'"
    >
      <DialogTrigger
        class="flex items-center justify-center hover:bg-secondary/80 bg-background size-8"
        :class="counter.showProjects ? ' border border-secondary ' : '  '"
      >
        <Settings class="size-4" />
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay
        class="bg-background/95 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0 z-[60]"
      />
      <DialogContent
        class="md:data-[state=open]:animate-contentShow font-mono fixed top-6 md:top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[750px] translate-x-[-50%] md:translate-y-[-50%] bg-background rounded p-4 focus:outline-none z-[100] "
      >
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          Configuraciones
        </DialogTitle>
        <ScrollAreaRoot
          class="w-full border h-[78vh] mt-6 md:h-[70vh] border-secondary"
          style="--scrollbar-size: 10px"
        >
          <ScrollAreaViewport class="w-full h-full">
            <article class="max-w-full p-3 mx-auto prose dark:prose-invert">
              <DialogDescription class="text-sm">
                Administra tus perfil, y configura tus preferencias.
              </DialogDescription>
              <div class="grid gap-3">
                <div class="flex flex-row items-start justify-between p-2 space-y-2 border border-secondary">
                  <div class="space-y-0.5">
                    <label
                      class="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    > Puntero del mouse </label>
                    <p
                      class="text-xs text-muted-foreground"
                    >
                      Activa o desactiva la manito en el cursor del mouse
                    </p>
                  </div>
                  <button
                    @click="toggleCursor()"
                    class="flex items-center justify-center border border-primary bg-background hover:bg-secondary/80 size-8"
                  >
                    <Pointer
                      v-if="cursorPointer"
                      class="size-4"
                    />
                    <MousePointer
                      v-else
                      class="size-4"
                    />
                  </button>
                </div>
                <div class="flex flex-row items-start justify-between p-2 space-y-2 border border-secondary">
                  <div class="space-y-0.5">
                    <label
                      class="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    > Modo de color </label>
                    <p
                      class="text-xs text-muted-foreground"
                    >
                      Alterná entre modo oscuro/claro/sistema, tambien podes elegir un color primario.
                    </p>
                  </div>
                  <div class="!ring-1 !ring-primary w-8 overflow-hidden hover: h-8">
                    <ToggleTheme />
                  </div>
                </div>
                <div class="flex flex-row items-start justify-between p-2 space-y-2 border border-secondary">
                  <div
                    class="space-y-0.5"
                    v-auto-animate
                  >
                    <label
                      class="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    > Tour </label>
                    <p
                      class="text-xs text-muted-foreground"
                    >
                      Activar el tutorial al ingresar a la app. Verá el tour despues de reiniciar. 
                    </p>
                    <a
                      v-if="!tour"
                      href="/"
                      class="inline-flex items-center gap-2 p-2 text-xs border border-secondary"
                    >Reiniciar ahora <RotateCcw class="size-4" /> </a>
                  </div>
                  <button
                    @click="toggleTour()"
                    class="flex items-center justify-center border border-primary bg-background hover:bg-secondary/80 size-8"
                  >
                    <PlaneTakeoff
                      v-if="!tour"
                      class="size-5"
                    />
                    <PlaneLanding
                      v-else
                      class="size-5"
                    />
                  </button>
                </div>
              </div>
            </article>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar
            class="flex select-none touch-none p-0.5 bg-secondary transition-colors duration-[160ms] ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollAreaThumb
              class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
            />
          </ScrollAreaScrollbar>
        </ScrollAreaRoot>
        <div class="flex justify-end mt-2 md:mt-3">
          <DialogClose as-child>
            <button
              class="bg-secondary text-foreground hover:bg-background hover:ring-2 hover:ring-foreground text-sm focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              Cerrar ventana
            </button>
          </DialogClose>
        </div>
        <DialogClose
          class="absolute inline-flex items-center justify-center appearance-none top-4 text-foreground hover:bg-secondary/80 right-3 size-7 focus:shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:text-primary"
          aria-label="Close"
        >
          <X />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
