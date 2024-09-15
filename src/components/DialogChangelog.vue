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
import { X } from "lucide-vue-next";

const lastVersion = "0.0.15"

const props = defineProps({
  button: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <DialogRoot>
    <DialogTrigger
      v-show="props.button"
      class="flex items-center justify-center bg-secondary hover:bg-secondary/80"
    >
      Ver registro cambios
    </DialogTrigger>
    <DialogTrigger
      v-show="!props.button"
      class="flex hover:underline decoration-wavy hover:decoration-primary"
    >
      <span class="hidden md:inline-flex "> Ver registro de cambios </span> 
      &nbsp;{{ lastVersion }} - Beta
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="bg-background/95 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0 z-[9998]"
      />
      <DialogContent
        class="md:data-[state=open]:animate-contentShow font-mono fixed top-6 md:top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[750px] translate-x-[-50%] md:translate-y-[-50%] bg-background rounded p-4 focus:outline-none z-[9999]"
      >
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          Registro de cambios
        </DialogTitle>
        <ScrollAreaRoot
          class="w-full border h-[78vh] mt-6 md:h-[70vh] border-secondary"
          style="--scrollbar-size: 10px"
        >
          <ScrollAreaViewport class="w-full h-full">
            <article
              class="max-w-full p-3 mx-auto prose dark:prose-invert"
            >
              <DialogDescription
                as="h4"
                class="mt-3 mb-5 leading-normal text-foreground"
              >
                {{ lastVersion }} - Última version
              </DialogDescription>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Add: Se agrega iframe al editor.</li>
                <li>Refactor: Cleanup code DialogProjectListSearch.</li>
                <li>Refactor: ShikiCodeBlock posicion del autocompletable y scroll arriba del sombreado</li>
                <li>Fix: forzar por defecto focus visible a botones</li>
                <li>Fix: Hover al tachito de eliminar</li>
                <li>Fix: Max width al tooltip</li>
                <li>Fix: Max width al sidebar</li>
                <li>Fix: Shortcut menu a <code>ctrl + m</code></li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.14
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Se revierte async editor.</li>
                <li>Mejor dialog para buscar con ctrl shift f.</li>
                <li>Editor por defecto en editable.</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.13
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Se agrega modo para previsualizar y que no sea editable (excepto la seleccion de lenguaje de la terminal).</li>
                <li>Reordenado visual. Importar y exportar solo se muestran con el menú abierto.</li>
                <li>Busqueda de comando con <code>ctrl shift f</code> en modo previsualizar por ahora.</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.12
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Se agrega dependencia medium-zoom.</li>
                <li>Se actualizan dependencias de Vue, Vite.</li>
                <li>Fix Dropdown quedaba por debajo de selector de lenguaje en el editor.</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.11
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li><span class="bg-primary py-0.5 px-1 rounded-full text-xs ">Break</span> Se elimina null por defecto en loaded_id y reemplaza por "".</li>
                <li>Estilo por defecto del theme ahora es <code>theme-blue</code>.</li>
                <li>Se agrega Radix Select para ordenar items.</li>
                <li>Boton crear con mayor jerarquía.</li>
                <li>Mejores textos de placeholder.</li>
                <li>Pequeños ajustes visuales imperceptibles.</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.10
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Se accede al changelog desde el dialog de más información.</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.9
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Ahora los Check y Uncheck son dos arrays distintos</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.8
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Fix poder marcar Check/Uncheck al item cuando hay scroll</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                0.0.7
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Se agrega la posibilidad de marcar un items como check.</li>
                <li>Se agrega ordenado de items por nombre o fecha</li>
              </ul>
              <h4 class="mt-3 mb-5 leading-normal text-foreground">
                Menor a 0.0.6
              </h4>
              <ul class="mt-2 mb-5 text-sm leading-normal text-foreground">
                <li>Initial commits.</li>
              </ul>
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
