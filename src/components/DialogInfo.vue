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
import { CircleHelp, X } from 'lucide-vue-next';
import Tooltip from './ui/Tooltip.vue';
</script>

<template>
  <DialogRoot>
    <Tooltip
      name="Acerca de"
      side="left"
    >
      <DialogTrigger class="bg-secondary size-8 justify-center items-center flex">
        <CircleHelp class="size-4" />
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay class="bg-secondary/90 data-[state=open]:animate-overlayShow fixed inset-0 z-[60]" />
      <DialogContent
        class="data-[state=open]:animate-contentShow font-mono fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
      >
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          Acerca de esta app
        </DialogTitle>
        <DialogDescription class="mb-5 text-foreground text-sm">
          Información general y guardado de los datos.
        </DialogDescription>
        <p class="text-foreground mt-3 mb-5 text-sm leading-normal">
          Esta aplicación usa <a
            href="https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API/Using_IndexedDB"
            class="underline underline-offset-2"
          >IndexedDB</a> para almacenar datos dentro del navegador del usuario. Los mismos quedan almacenados en la
          sesión de ese navegador (Al limpiar los datos del navegador estos se perderán).
        </p>
        <p class="text-foreground mt-2 mb-5 text-sm leading-normal">
          Para solucionar eso existe la
          posibilidad de exportar e importar la IndexedDB en formato JSON.
        </p>
        <p class="text-foreground mt-2 mb-5 text-sm leading-normal">
          Tambien se guardaran en el <a
            href="https://developer.mozilla.org/es/docs/Web/API/Window/localStorage"
            class="underline underline-offset-2"
          >localStorage</a> preferencias del layout y el editor de texto.
        </p>
        <fieldset class="mb-2 hidden gap-5">
          <label
            class="text-foreground font-mono font-semibold"
            for="name"
          > Editor </label>
        </fieldset>
        <fieldset class="mb-2 hidden gap-5">
          <label
            class="text-foreground font-mono font-semibold"
            for="name"
          > Modo de color </label>
        </fieldset>
        <fieldset class="mb-2 hidden gap-5">
          <label
            class="text-foreground font-mono font-semibold"
            for="name"
          > ImportarDB </label>
        </fieldset>
        <fieldset class="mb-2 hidden gap-5">
          <label
            class="text-foreground font-mono font-semibold"
            for="username"
          > ExportarDB </label>
        </fieldset>
        <div class="mt-[25px] flex justify-end">
          <DialogClose as-child>
            <button
              class="bg-secondary text-foreground hover:bg-primary text-sm focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              Cerrar ventana
            </button>
          </DialogClose>
        </div>
        <DialogClose
          class="text-foreground hover:bg-secondary/80  absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center  focus:shadow focus:outline-none"
          aria-label="Close"
        >
          <X />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>