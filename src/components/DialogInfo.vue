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
import { CircleHelp, TentTree, X } from "lucide-vue-next";
import Tooltip from "./ui/Tooltip.vue";
</script>

<template>
  <DialogRoot>
    <Tooltip
      name="Acerca de"
      side="left"
    >
      <DialogTrigger
        class="flex items-center justify-center bg-secondary size-8"
      >
        <CircleHelp class="size-4" />
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay
        class="bg-secondary/90 data-[state=open]:animate-overlayShow fixed inset-0 z-[60]"
      />
      <DialogContent
        class="data-[state=open]:animate-contentShow  font-mono fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
      >
        <DialogTitle class="text-foreground m-0 text-[17px] font-semibold">
          Acerca de esta app
        </DialogTitle>
        <DialogDescription class="mb-5 text-base text-foreground">
          Base de datos local
        </DialogDescription>
        <article class="h-64 px-6 -mx-6 overflow-y-auto prose dark:prose-invert sm:h-auto">
          <p class="mt-3 mb-5 text-sm leading-normal text-foreground">
            Esta aplicación usa
            <a
              href="https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API/Using_IndexedDB"
              class="underline underline-offset-2"
            >IndexedDB</a>
            para almacenar datos dentro del navegador del usuario. Los mismos
            quedan almacenados en la sesión de ese navegador (Al limpiar los datos
            del navegador estos se perderán).
          </p>
          <p class="mt-2 mb-5 text-sm leading-normal text-foreground">
            Por eso existe la posibilidad de exportar e importar la
            IndexedDB en formato JSON.
          </p>
          <p class="mt-2 mb-5 text-sm leading-normal text-foreground">
            Asignale un nombre a la base de datos y comenza a crear elementos con texto enriquecido.
            Agrega bloques de código con resaltado de sintaxis, pega directamente videos de youtube o imágenes via URL o guardadas en la DB como Base64.
          </p>
          <h4>Tecnologias utilizadas</h4>
          <p class="mt-2 mb-5 text-sm leading-normal text-foreground">
            Tambien se guardaran en el
            preferencias del layout y el editor de texto.
          </p>
        </article>
        <div class="mt-[25px] flex justify-between">
          <div
            class="flex items-center justify-start gap-2 font-mono text-xs font-semibold opacity-50 text-foreground"
          >
            <TentTree class="size-5 text-primary" />
            <span>0.0.3</span>
          </div>
          <DialogClose as-child>
            <button
              class="bg-secondary text-foreground hover:bg-background hover:ring-2 hover:ring-foreground text-sm focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              Cerrar ventana
            </button>
          </DialogClose>
        </div>
        <DialogClose
          class="text-foreground hover:bg-secondary/80 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center focus:shadow focus:outline-none"
          aria-label="Close"
        >
          <X />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
