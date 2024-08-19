<template>
  <div
    v-if="editor"
    v-auto-animate
    class="px-1 @container grid md:pr-2 w-full"
  >
    <div
      v-if="toolbar"
      class="sticky top-0 z-30 py-1 bg-background"
    >
      <div
        class="control-group max-w-full mx-auto w-full flex @3xl:flex-row flex-wrap @3xl:flex-nowrap items-start gap-1 relative"
      >
        <slot />
        <div class="flex justify-start gap-1 mb-1 md:w-auto">
          <Tooltip
            name="Deshacer"
            side="bottom"
          >
            <button
              class="flex items-center justify-center border outline-none size-10 focus-visible:border-primary border-secondary"
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
              class="flex items-center justify-center border outline-none size-10 focus-visible:border-primary border-secondary"
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
              class="flex items-center justify-center border outline-none size-10 focus-visible:border-primary border-secondary"
              :class="editorToolbar ? 'bg-primary text-primary-foreground' : ''"
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
                <span
                  class="flex items-center justify-center border outline-none size-10 focus-visible:border-primary border-secondary"
                >
                  <ImagePlus class="size-5" />
                </span>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              class="z-50 grid text-xs bg-secondary w-44"
            >
              <DropdownMenuItem
                as-child
                class="relative flex justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
              >
                <label
                  class="flex justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
                  for="img-uploader"
                  id="uploader"
                >
                  Base64
                  <input
                    id="img-uploader"
                    type="file"
                    accept="image/jpeg"
                    class="absolute inset-0 opacity-0"
                    @change="addImageBase64"
                  >
                </label>
              </DropdownMenuItem>

              <DropdownMenuItem
                @click="addImage"
                class="justify-between p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
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
              class="flex items-center justify-center border outline-none size-10 focus-visible:border-primary border-secondary"
            >
              <Video class="size-5" />
            </button>
          </Tooltip>
          <!-- <Tooltip
            name="Iframe"
            side="bottom"
          >
            <button
              @click="addIframe"
              class="flex items-center justify-center border outline-none size-10 focus-visible:border-primary border-secondary"
            >
              <Globe class="size-5" />
            </button>
          </Tooltip> -->
        </div>
      </div>
      <div
        class="button-group"
        v-if="editorToolbar"
      >
        <DropdownMenuRoot>
          <DropdownMenuTrigger
            class="headingSelector flex items-center !text-xs !justify-between w-full bg-secondary px-2"
          >
            <template v-if="editor.isActive('heading', { level: 1 })">
              Título nivel 1 (H1)
            </template>
            <template v-else-if="editor.isActive('heading', { level: 2 })">
              Título nivel 2 (H2)
            </template>
            <template v-else-if="editor.isActive('heading', { level: 3 })">
              Título nivel 3 (H3)
            </template>
            <template v-else-if="editor.isActive('heading', { level: 4 })">
              Título nivel 4 (H4)
            </template>
            <template v-else-if="editor.isActive('heading', { level: 5 })">
              Título nivel 5 (H5)
            </template>
            <template v-else-if="editor.isActive('heading', { level: 6 })">
              Título nivel 6 (H6)
            </template>
            <template v-else-if="editor.isActive('codeBlock')">
              Código
            </template>
            <template v-else>
              Párrafo
            </template>
            <span class="sr-only">Alineación de texto</span>
            <ChevronDown class="size-4 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            class="z-10 grid text-xs border w-44 bg-background border-secondary"
          >
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
              :class="{ 'is-active': editor.isActive('paragraph') }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Párrafo
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Titulo 1
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Titulo 2
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Titulo 3
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Titulo 4
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Titulo 5
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Titulo 6
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="editor.chain().focus().toggleCodeBlock().run()"
              :class="{ 'is-active': editor.isActive('codeBlock') }"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
            >
              Código
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
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
          shortcut="Ctrl Shift S"
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
          shortcut="Ctrl E"
        >
          <button
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }"
          >
            <Code />
          </button>
        </Tooltip>

        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <Tooltip
              name="Alineación de texto"
              side="bottom"
            >
              <button
                class="flex items-center justify-center w-full bg-secondary"
              >
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
            class="z-50 grid w-64 text-xs bg-secondary"
          >
            <DropdownMenuItem
              @click="editor.chain().focus().setTextAlign('left').run()"
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
              :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
            >
              <div class="flex items-center justify-start gap-3 p-1">
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
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
              :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
            >
              <div class="flex items-center justify-start gap-3 p-1">
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
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
              :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
            >
              <div class="flex items-center justify-start gap-3 p-1">
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
              class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
              :class="{
                'is-active': editor.isActive({ textAlign: 'justify' }),
              }"
            >
              <div class="flex items-center justify-start gap-3 p-1">
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
              class="flex items-center justify-between p-2 pr-3 cursor-pointer hover:bg-secondary-foreground/10"
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
        :class="
          editorToolbar ? 'h-[calc(100vh-9.25rem)]' : 'h-[calc(100vh-6.75rem)]'
        "
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full">
          <div
            class="max-w-full mx-auto prose dark:prose-invert"
            spellcheck="false"
          >
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
  Link2,
  Unlink2,
  Video,
  ChevronDown,
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
import { useStorage } from "@vueuse/core";
import { Editor, EditorContent, VueNodeViewRenderer } from "@tiptap/vue-3";

import Tooltip from "@/components/ui/Tooltip.vue";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockShiki from "tiptap-extension-code-block-shiki";
// import Heading  from "@/components/Tiptap/Heading.js";
import ShikiCodeBlock from "@/components/Tiptap/ShikiCodeBlock.vue";

const editor = ref(null);
const editorToolbar = useStorage("editorToolbar", true);

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
      // Iframe,
      // Heading,
      Link.configure({
        openOnClick: true,
        defaultProtocol: "https",
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener",
          class:
            "px-1 underline-offset-2 text-primary cursor-pointer hover:text-primary/80",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      // ResizableMedia.configure({
      //   inline: true,
      //   allowBase64: true,
      // }),
      // Image.configure({
      //   allowBase64: true,
      //   inline: true,
      // }),
      TableRow,
      TableHeader,
      TableCell,
      // ExternalVideo,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Escribir algo …",
      }),
      Youtube.configure({
        controls: true,
        ccLanguage: "es",
        nocookie: true,
      }),
      CodeBlockShiki.extend({
        addNodeView() {
          return VueNodeViewRenderer(ShikiCodeBlock);
        },
      }).configure({
        HTMLAttributes: {
          spellcheck: "false",
        },
        defaultTheme: "houston",
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
    editor.value?.commands.setMedia({
      src: url,
      "media-type": "img",

      alt: "Something else",
      title: "Something",
      width: "800",
      height: "400",
    });
  }
}

// const addImage = () => editor.value?.commands.setMedia({
//   src: 'https://source.unsplash.com/8xznAGy4HcY/800x400',
//   'media-type': 'img',

//   alt: 'Something else',
//   title: 'Something',
//   width: '800',
//   height: '400',
// })

function addImageBase64(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      editor.value?.commands.setMedia({
        src: dataURL,
        "media-type": "img",

        alt: "Something else",
        title: "Something",
        width: "800",
        height: "400",
      });
    };

    reader.readAsDataURL(file);
  }
}

// function addVideo() {
//   const url = window.prompt(
//     'Video URL',
//     'https://www.youtube.com/embed/iyd8dY8rRtA'
//   )

//   if (url) {
//     editor.value.chain().focus().setExternalVideo({ src: url }).run()
//   }
// }

// function addIframe() {
//   const url = window.prompt("Ingresar URL del iframe");
//   if (url) {
//     editor.value.chain().focus().setIframe({ src: url }).run();
//   }
// }

function addVideo() {
  const url = prompt("Enter YouTube URL");
  editor.value.commands.setYoutubeVideo({
    src: url,
    width: Math.max(320, parseInt(640, 10)) || 640,
    height: Math.max(180, parseInt(480, 10)) || 480,
  });
}

function setLink() {
  const previousUrl = editor.value.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();

    return;
  }

  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
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
.button-group {
  @apply bg-background flex flex-wrap w-full;
}

.headingSelector {
  /* grid-column: 1 / 8; */
  max-width: 14rem;
  min-width: 14rem !important;
}

.button-group button {
  @apply border border-secondary focus-within:border-primary outline-none h-9 min-w-9 max-w-10 xl:max-w-14 text-sm focus-visible:border-primary flex justify-center items-center duration-100;
  flex: 1;
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

.tiptap h1:first-of-type,
.tiptap h2:first-of-type,
.tiptap h3:first-of-type,
.tiptap h4:first-of-type,
.tiptap h5:first-of-type,
.tiptap h6:first-of-type {
  @apply mt-4;
}

.tiptap p {
  @apply break-all
}

.tiptap p code {
  @apply bg-primary/20 px-1 mx-0.5 rounded py-0.5 text-foreground ring-1 ring-primary/30 font-light text-sm;
}

.tiptap .iframe-wrapper {
  @apply w-full h-[calc(100vh-9rem)] overflow-hidden m-0 border-2 bg-white border-primary/50 relative;
}

.tiptap .iframe-wrapper iframe {
  @apply w-full h-[calc(100vh-9rem)] bg-white;
}

.tiptap iframe:before {
  content: "Cargando iframe";
}

.tiptap img {
  @apply mx-auto;
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
  @apply bg-secondary border border-secondary p-1 flex text-xs gap-2 items-center;
}

.bubble-menu button {
  background-color: unset;
  @apply h-8 px-2;
}

.bubble-menu button:hover {
  @apply bg-background;
}

.bubble-menu.is-active {
  background-color: var(--purple);
}

.bubble-menu.is-active:hover {
  background-color: var(--purple-contrast);
}

.tiptap [data-youtube-video] {
  @apply max-w-3xl mx-auto bg-primary/20 relative;
}

.tiptap [data-youtube-video]::before {
  content: "";
  @apply absolute inset-0 bg-primary/10 mix-blend-multiply z-10 animate-pulse;
}

.tiptap [data-youtube-video] iframe {
  @apply w-full h-64 @lg:h-96 @lg:aspect-video aspect-square relative z-20;
  /* aspect-ratio: 16/9; */
}

.tiptap table {
  border-collapse: collapse;
  margin: 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
}

.tiptap td,
.tiptap th {
  border: 1px solid var(--gray-3);
  box-sizing: border-box;
  min-width: 1em;
  padding: 6px 8px;
  position: relative;
  vertical-align: top;
}

.tiptap th {
  background-color: var(--gray-1);
  font-weight: bold;
  text-align: left;
}

.tiptap .selectedCell:after {
  background: var(--gray-2);
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}

.tiptap .column-resize-handle {
  background-color: var(--purple);
  bottom: -2px;
  pointer-events: none;
  position: absolute;
  right: -2px;
  top: 0;
  width: 4px;
}

.tiptap .tableWrapper {
  margin: 1.5rem 0;
  overflow-x: auto;
}

.tiptap.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.tiptap img {
  width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.tiptap .ProseMirror-selectednode {
  /* outline: 3px solid #68cef8; */
  @apply ring-2 ring-primary;
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
