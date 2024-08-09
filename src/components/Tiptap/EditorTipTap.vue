<template>
  <div
    v-if="editor"
    v-auto-animate
    class="px-1 @container grid md:pr-2"
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
            name="Video"
            side="bottom"
          >
            <button
              @click="addVideo"
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            >
              <Youtube class="size-5" />
            </button>
          </Tooltip>
          <Tooltip
            name="Iframe"
            side="bottom"
          >
            <button
              @click="addIframe"
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            >
              <Globe class="size-5" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        class="button-group bg-background justify-start m-0 mr-auto pr-[1px] pt-1 w-full flex gap-1 flex-wrap"
        v-if="editorToolbar"
      >
        <Tooltip
          name="Negrita"
          shortcut="Ctrl B"
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
          shortcut="Ctrl I"
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
          shortcut="Ctrl U"
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
          shortcut="Ctrl Shift S"
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
          shortcut="Ctrl Alt 0"
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
          shortcut="Ctrl Alt 1"
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
          shortcut="Ctrl Alt 2"
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
          shortcut="Ctrl Alt 3"
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
          shortcut="Ctrl Alt 4"
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
            class="bg-secondary w-64 grid text-xs z-10"
          >
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('left').run()"
              class="hover:bg-secondary-foreground/10 p-2 items-center cursor-pointer flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
            >
              <div class="flex justify-start p-1 items-center gap-3">
                <AlignLeft class="size-4" />
                <span>Izquierda</span>
              </div>
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[8px] font-medium text-muted-foreground opacity-100"
              >
                Ctrl Shift L
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('center').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer items-center flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
            >
              <div class="flex justify-start p-1 items-center gap-3">
                <AlignCenter class="size-4" />
                <span>Centro</span>
              </div>
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[8px] font-medium text-muted-foreground opacity-100"
              >
                Ctrl Shift E
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('right').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer items-center flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
            >
              <div class="flex justify-start p-1 items-center gap-3">
                <AlignRight class="size-4" />
                <span>Derecha</span>
              </div>
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[8px] font-medium text-muted-foreground opacity-100"
              >
                Ctrl Shift R
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('justify').run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer items-center flex gap-2 justify-between pr-3"
              :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
            >
              <div class="flex justify-start p-1 items-center gap-3">
                <AlignJustify class="size-4" />
                <span>Justificado</span>
              </div>
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[8px] font-medium text-muted-foreground opacity-100"
              >
                Ctrl Shift J
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().unsetTextAlign().run()"
              class="hover:bg-secondary-foreground/10 p-2 cursor-pointer flex items-center justify-between pr-3"
            >
              <span>Sin alineación</span>
              <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[8px] font-medium ml-auto text-muted-foreground opacity-100"
              >
                Ctrl Shift L
              </kbd>
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
          shortcut="Ctrl Shift 8"
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
          shortcut="Ctrl Shift 7"
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
          shortcut="Ctrl Alt C"
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
          shortcut="Ctrl Shift B"
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
        <Tooltip
          name="Añadir link"
          side="bottom"
        >
          <button
            @click="setLink"
            :class="{ 'is-active': editor.isActive('link') }"
          >
            <Link2 class="-rotate-45" />
          </button>
        </Tooltip>
        <Tooltip
          name="Eliminar link"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().unsetLink().run()"
            :disabled="!editor.isActive('link')"
          >
            <Unlink2 class="-rotate-45" />
          </button>
        </Tooltip>
      </div>
    </div>
    <!-- <bubble-menu
      class="bubble-menu"
      :tippy-options="{ animation: false, maxWidth: 'none', }"
      :editor="editor"
      v-if="editor"
    >
      <button
        @click="
          editor
            .chain()
            .focus()
            .setImage({ size: 'small' })
            .run()
          "
        :class="{
          'is-active': editor.isActive('custom-image', {
            size: 'small'
          })
        }"
      >
        SM
      </button>
      <button
        @click="
          editor
            .chain()
            .focus()
            .setImage({ size: 'medium' })
            .run()
          "
        :class="{
          'is-active': editor.isActive('custom-image', {
            size: 'medium'
          })
        }"
      >
        MD
      </button>
      <button
        @click="
          editor
            .chain()
            .focus()
            .setImage({ size: 'large' })
            .run()
          "
        :class="{
          'is-active': editor.isActive('custom-image', {
            size: 'large'
          })
        }"
      >
        XL
      </button>
      <button
        @click="
          editor
            .chain()
            .focus()
            .setImage({ float: 'left' })
            .run()
          "
        :class="{
          'is-active': editor.isActive('custom-image', {
            float: 'left'
          })
        }"
      >
        <AlignLeft class="size-4" />
      </button>
      <button
        @click="
          editor
            .chain()
            .focus()
            .setImage({ float: 'none' })
            .run()
          "
        :class="{
          'is-active': editor.isActive('custom-image', {
            float: 'none'
          })
        }"
      >
        <AlignCenter class="size-4" />
      </button>
      <button
        @click="
          editor
            .chain()
            .focus()
            .setImage({ float: 'right' })
            .run()
          "
        :class="{
          'is-active': editor.isActive('custom-image', {
            float: 'right'
          })
        }"
      >
        <AlignRight class="size-4" />
      </button>
    </bubble-menu> -->
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Youtube,
  Globe,
  Link2,
  Unlink2,
  Maximize,
} from "lucide-vue-next";
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "radix-vue";

import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "radix-vue";

import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useStorage } from '@vueuse/core'
import { Editor, EditorContent, VueNodeViewRenderer } from "@tiptap/vue-3";

import Tooltip from "@/components/ui/Tooltip.vue";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Typography from '@tiptap/extension-typography'
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Iframe from "@/components/Tiptap/iframe.ts";
import ExternalVideo from '@/components/Tiptap/external-video.js'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import ShikiCodeBlock from '@/components/Tiptap/ShikiCodeBlock.vue'

import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();



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
      Typography,
      Iframe,
      Link.configure({
        openOnClick: true,
        defaultProtocol: 'https',
        autolink: true,
        linkOnPaste: true,
      }),
      ExternalVideo,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: "Escribir algo …",
      }),
      CodeBlockShiki
        .extend({
          addNodeView() {
            return VueNodeViewRenderer(ShikiCodeBlock)
          },
        })
        .configure({
          HTMLAttributes: {
            spellcheck: "false"
          },
          defaultTheme: 'houston',
        }),
    ],
    content: props.modelValue,
    onUpdate: () => {
      emit("update:modelValue", editor.value.getHTML());
    },
  });
});

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
      editor.value.chain().focus().setImage({ src: dataURL }).run();
    };

    reader.readAsDataURL(file);
  }
}

function addVideo() {
  const url = window.prompt(
    'Video URL',
    'https://www.youtube.com/embed/iyd8dY8rRtA'
  )

  if (url) {
    editor.value.chain().focus().setExternalVideo({ src: url }).run()
  }
}

function addIframe() {
  const url = window.prompt("Ingresar URL del iframe");
  if (url) {
    editor.value.chain().focus().setIframe({ src: url }).run();
  }
}

function setLink() {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    editor.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()

    return
  }

  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()
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



onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>

<style>
.button-group button {
  @apply border border-secondary focus-within:border-primary min-w-9 flex-1 outline-none h-9 max-w-9 text-sm focus-visible:border-primary flex justify-center items-center duration-100;
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

.tiptap {
  @apply p-4 outline-none placeholder:text-primary min-h-64 font-serif;
}

/* .tiptap pre {
  @apply bg-secondary text-foreground
} */

.tiptap p code {
  @apply bg-background px-1 rounded font-normal py-1 text-foreground
}



.tiptap .iframe-wrapper {
  @apply w-full h-[calc(100vh-9rem)] overflow-hidden m-0 border-2 bg-white border-primary/50 relative;
}

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



html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  @apply text-foreground/30;
}

/* Bubble menu */
.bubble-menu {
  @apply bg-secondary border border-secondary p-1 flex text-xs gap-2 items-center
}

.bubble-menu button {
  background-color: unset;
  @apply h-8 px-2
}

.bubble-menu button:hover {
  @apply bg-background
}

.bubble-menu.is-active {
  background-color: var(--purple);
}

.bubble-menu.is-active:hover {
  background-color: var(--purple-contrast);
}


.tiptap img {
  width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.tiptap .ProseMirror-selectednode {
  outline: 3px solid #68cef8;
}


.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 10px;
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
