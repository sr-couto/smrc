<template>
  <div
    v-if="editor"
    v-auto-animate
    class="px-1 pt-1 @container grid"
  >
    <div class="sticky z-20 top-0 bg-background pt-1">
      <div class="control-group flex md:flex-row flex-col flex-wrap @lg:flex-nowrap items-center gap-1 relative">
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
          <Tooltip
            name="Agregar imagen"
            side="bottom"
          >
            <button
              @click="addImage"
              class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            >
              <ImagePlus class="size-5" />
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
              <Wifi class="size-5" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div
        class="button-group  bg-background py-1 border-b border-secondary flex mt-1 gap-1 flex-wrap"
        v-if="editorToolbar"
      >
        <Tooltip
          name="Bold"
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
          name="Italic"
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
          name="Strikethrough"
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
          name="Code"
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
          <button
            @click="editor.chain().focus().setHorizontalRule().run()"
          >
            <Minus />
          </button>
        </Tooltip>
        <Tooltip
          name="Quitar formato"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().unsetAllMarks().run()"
          >
            <RemoveFormatting />
          </button>
        </Tooltip>
        <Tooltip
          name="Limpiar todo"
          side="bottom"
        >
          <button
            @click="editor.chain().focus().clearNodes().run()"
          >
            <Eraser />
          </button>
        </Tooltip>
      </div>
    </div>
    <div>
      <ScrollAreaRoot
        class="w-full h-[calc(100vh-6rem)] rounded overflow-hidden "
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full rounded">
          <div class="prose text-foreground prose-purple prose-headings:text-foreground max-w-full">
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
import { Italic, ImagePlus, SquarePilcrow, Bold, Strikethrough, Code, RemoveFormatting, Eraser, List, ListOrdered, SquareTerminal, Quote, Minus, Undo2, Redo2, Wifi } from 'lucide-vue-next';
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'radix-vue'

</script>

<script>
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { lowlight } from "lowlight/lib/common.js";
import CodeBlockComponent from './CodeBlockComponent.vue'
import Iframe from './iframe.ts'
import Tooltip from './ui/Tooltip.vue';

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)

export default {
  components: {
    EditorContent
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      editor: null,
      editorToolbar: true,
    }
  },

  methods: {
    addImage() {
      const url = window.prompt('Ingresar URL de la imagen')
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
    addIframe() {
      const url = window.prompt('Ingresar URL del iframe')

      if (url) {
        this.editor.chain().focus().setIframe({ src: url }).run()
      }
    },
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) {
        return
      }
      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({

      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
          codeBlock: false
        }),
        Image,
        Iframe,
        Placeholder.configure({
          placeholder: 'Escribir algo …',
        }),
        CodeBlockLowlight
          .extend({
            addNodeView() {
              return VueNodeViewRenderer(CodeBlockComponent)
            },
          })
          .configure({ lowlight }),
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style>
.tiptap iframe {
  @apply w-full h-[78vh] my-12 border border-primary p-2
}

.button-group button {
  @apply border border-secondary focus-within:border-primary min-w-9 max-w-9 flex-1 outline-none h-9 text-sm focus-visible:border-primary flex justify-center items-center duration-100;

}

.control-group button {
  @apply disabled:opacity-50
}

.button-group button.is-active {
  @apply bg-primary text-primary-foreground;
}

.button-group button svg {
  @apply size-4
}

/* Basic editor styles */
.tiptap {
  @apply p-2 border border-t-0 border-secondary outline-none placeholder:text-primary min-h-96;
}

.tiptap:first-child * {
  margin-top: 0;
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  @apply text-foreground/30
}

.tiptap blockquote {
  @apply text-foreground
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