<template>
  <div
    v-if="editor"
    v-auto-animate
    class="px-1 pt-1 @container grid md:pr-2"
  >
    <div
      v-if="toolbar"
      class="sticky z-20 top-0 bg-background py-1"
    >
      <div
        class="control-group max-w-full mx-auto w-full flex md:flex-row flex-col flex-wrap @lg:flex-nowrap items-center gap-1 relative"
      >
        <slot />
        <div class="flex w-full md:w-auto justify-start gap-1">
          <Tooltip
            name="Deshacer"
            side="bottom"
          >
            <button
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
              @click="editor.chain().focus().undo().run()"
              :disabled="!editor.can().chain().focus().undo().run()"
            >
              <Undo2 class="size-5" />
            </button>
          </Tooltip>
          <Tooltip
            name="rehacer"
            side="bottom"
          >
            <button
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
              @click="editor.chain().focus().redo().run()"
              :disabled="!editor.can().chain().focus().redo().run()"
            >
              <Redo2 class="size-5" />
            </button>
          </Tooltip>
          <Tooltip
            name="Formato texto"
            side="bottom"
          >
            <button
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
              @click="editorToolbar = !editorToolbar"
            >
              <SquarePilcrow class="size-5" />
            </button>
          </Tooltip>
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <Tooltip
                name="Agregar imagen"
                side="bottom"
              >
                <button
                  class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
                >
                  <ImagePlus class="size-5" />
                </button>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              class="bg-secondary w-44 grid text-xs z-10"
            >
              <DropdownMenuItem
                as-child
                class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex gap-2 justify-between pr-3"
              >
                <input
                  id="img-uploader"
                  type="file"
                  accept="image/jpeg"
                  style="display: none"
                  @change="addImageBase64"
                >
                <label
                  class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex gap-2 justify-between pr-3"
                  for="img-uploader"
                  id="uploader"
                >
                  Base64
                </label>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                @click="addImage"
                class="hover:bg-secondary-foreground/10 p-2 cursor-pointer justify-between pr-3"
              >
                Url
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>

          <Tooltip
            name="Iframe"
            side="bottom"
          >
            <button
              @click="addIframe"
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            >
              <Wifi class="size-5" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        class="button-group max-w-3xl bg-background justify-between m-0 mr-auto pr-[1px] pt-1 w-full flex gap-1 flex-wrap"
        v-if="editorToolbar"
      >
        <Tooltip
          name="Negrita"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            <Bold />
          </button>
        </Tooltip>
        <Tooltip
          name="Cursiva"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            <Italic />
          </button>
        </Tooltip>
        <Tooltip
          name="Linea de tachado"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            <Strikethrough />
          </button>
        </Tooltip>
        <Tooltip
          name="Código en linea"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }"
          >
            <Code />
          </button>
        </Tooltip>
        <Tooltip
          name="Párrafo"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }"
          >
            P
          </button>
        </Tooltip>
        <Tooltip
          name="Titulo 1"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          >
            H1
          </button>
        </Tooltip>
        <Tooltip
          name="Titulo 2"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          >
            H2
          </button>
        </Tooltip>
        <Tooltip
          name="Titulo 3"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          >
            H3
          </button>
        </Tooltip>
        <Tooltip
          name="Titulo 4"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          >
            H4
          </button>
        </Tooltip>
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <Tooltip
              name="Alineación de texto"
              side="bottom"
            >
              <button class="bg-secondary size-8 justify-center items-center flex">
                <template v-if="editor.isActive({ textAlign: 'center' })">
                  <AlignCenter class="size-6" />
                </template>
                <template v-else-if="editor.isActive({ textAlign: 'right' })">
                  <AlignRight class="size-6" />
                </template>
                <template v-else-if="editor.isActive({ textAlign: 'justify' })">
                  <AlignJustify class="size-6" />
                </template>
                <template v-else>
                  <AlignLeft class="size-6" />
                </template>
                <span class="sr-only">Alineación de texto</span>
              </button>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            class="bg-secondary w-44 grid text-xs z-10"
          >
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('left').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
            >
              <span>Izquierda</span>
              <AlignLeft class="size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('center').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
            >
              <span>Centro</span>
              <AlignCenter class="size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('right').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
            >
              <span>Derecha</span>
              <AlignRight class="size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('justify').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
            >
              <span>Justificado</span>
              <AlignJustify class="size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().unsetTextAlign().run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer justify-between pr-3"
            >
              <span>Sin alineación</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
        <!-- <button
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          H5
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        >
          H6
        </button> -->
        <Tooltip
          name="Lista desordenada"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
          >
            <List />
          </button>
        </Tooltip>
        <Tooltip
          name="Lista ordenada"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
          >
            <ListOrdered />
          </button>
        </Tooltip>
        <Tooltip
          name="Código"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
          >
            <SquareTerminal />
          </button>
        </Tooltip>
        <Tooltip
          name="Cita"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }"
          >
            <Quote />
          </button>
        </Tooltip>
        <Tooltip
          name="Separador"
          side="bottom"
        >
          <button @click="editor.chain().focus().setHorizontalRule().run()">
            <Minus />
          </button>
        </Tooltip>
        <Tooltip
          name="Quitar marcas"
          side="bottom"
        >
          <button @click="editor.chain().focus().unsetAllMarks().run()">
            <RemoveFormatting />
          </button>
        </Tooltip>
        <Tooltip
          name="Limpiar nodos"
          side="bottom"
        >
          <button @click="editor.chain().focus().clearNodes().run()">
            <Eraser />
          </button>
        </Tooltip>
      </div>
    </div>
    <div>
      <ScrollAreaRoot
        class="w-full border border-secondary"
        :class="editorToolbar ? 'h-[calc(100vh-9.25rem)]' : 'h-[calc(100vh-6.75rem)]'"
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full">
          <div class="prose prose-purple dark:prose-invert max-w-full mx-auto">
            <editor-content :editor="editor" />
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
        <!-- <ScrollAreaScrollbar
          class="flex select-none touch-none p-0.5 bg-secondary transition-colors duration-[160ms] ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="horizontal"
        >
          <ScrollAreaThumb
            class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
          />
        </ScrollAreaScrollbar> -->
      </ScrollAreaRoot>
    </div>
  </div>
</template>

<script setup>
import {
  Italic,
  ImagePlus,
  SquarePilcrow,
  Bold,
  Strikethrough,
  Code,
  RemoveFormatting,
  Eraser,
  List,
  ListOrdered,
  SquareTerminal,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Wifi,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageDownIcon,
} from "lucide-vue-next";
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "radix-vue";

import { useCounterStore } from "@/stores/counter";



import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "radix-vue";

import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent, VueNodeViewRenderer } from "@tiptap/vue-3";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import TextAlign from '@tiptap/extension-text-align'
import { lowlight } from "lowlight/lib/common.js";
import CodeBlockComponent from "./CodeBlockComponent.vue";
import Iframe from "./iframe.ts";
import Tooltip from "./ui/Tooltip.vue";
import { useBase64, useStorage } from '@vueuse/core'



const counter = useCounterStore();
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

const editor = ref(null);
const editorToolbar = useStorage('editorToolbar', true);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

function addImage() {
  const url = window.prompt("Ingresar URL de la imagen");
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run();
  }
}

function addImageBase64(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataURL = e.target.result;
      console.log(dataURL);
      editor.value.chain().focus().setImage({ src: dataURL }).run();
    };

    reader.readAsDataURL(file);
  }
}

function addIframe() {
  const url = window.prompt("Ingresar URL del iframe");
  if (url) {
    editor.value.chain().focus().setIframe({ src: url }).run();
  }
}

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value.getHTML() === value;
    if (isSame) {
      return;
    }
    editor.value.commands.setContent(value, false);
  }
);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Iframe,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: "Escribir algo …",
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return VueNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content: props.modelValue,
    onUpdate: () => {
      emit("update:modelValue", editor.value.getHTML());
    },
  });
});

onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>

<style>
.button-group button {
  @apply border border-secondary focus-within:border-primary min-w-9 flex-1 outline-none h-9 text-sm focus-visible:border-primary flex justify-center items-center duration-100;
}

.control-group button {
  @apply disabled:opacity-50;
}

.button-group button.is-active {
  @apply bg-primary text-primary-foreground;
}

.button-group button svg {
  @apply size-4;
}

/* Basic editor styles */
.tiptap {
  @apply p-4 outline-none placeholder:text-primary min-h-96 font-serif;
}

.tiptap pre {
  @apply bg-gray-900 text-white
}



.tiptap .iframe-wrapper {
  @apply w-full h-[calc(100vh-9rem)] overflow-hidden m-0 border-2 bg-white border-primary/50 relative;
}

/* :class="editorToolbar ? 'h-[calc(100vh-9.25rem)]': 'h-[calc(100vh-6.75rem)]'" */
.tiptap .iframe-wrapper iframe {
  @apply w-full h-[calc(100vh-9rem)] bg-white;
}

.tiptap iframe:before {
  content: "Cargando iframe"
}

.tiptap img {
  @apply mx-auto
}

.tiptap code::after,
.tiptap code::before {
  display: none;
}

.tiptap:first-child * {
  margin-top: 0;
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  @apply text-foreground/30;
}


/* Code styling */
.hljs-comment,
.hljs-quote {
  color: #616161;
}

.hljs-variable,
.hljs-template-variable,
.hljs-attribute,
.hljs-tag,
.hljs-name,
.hljs-regexp,
.hljs-link,
.hljs-name,
.hljs-selector-id,
.hljs-selector-class {
  color: #f98181;
}

.hljs-number,
.hljs-meta,
.hljs-built_in,
.hljs-builtin-name,
.hljs-literal,
.hljs-type,
.hljs-params {
  color: #fbbc88;
}

.hljs-string,
.hljs-symbol,
.hljs-bullet {
  color: #b9f18d;
}

.hljs-title,
.hljs-section {
  color: #faf594;
}

.hljs-keyword,
.hljs-selector-tag {
  color: #70cff8;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: 700;
}
</style>
