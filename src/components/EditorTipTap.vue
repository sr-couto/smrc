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
          <button
            class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
          >
            <Undo2 class="size-5" />
          </button>
          <button
            class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
          >
            <Redo2 class="size-5" />
          </button>
          <button
            class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
            @click="editorToolbar = !editorToolbar"
          >
            <SquarePilcrow class="size-5" />
          </button>
          <button
            @click="addImage"
            class="size-10 focus-visible:border-primary outline-none flex justify-center items-center border border-secondary"
          >
            <ImagePlus class="size-5" />
          </button>
        </div>
      </div>
      <div
        class="button-group  bg-background py-1 border-b border-secondary flex mt-1 gap-1 flex-wrap"
        v-if="editorToolbar"
      >
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <Bold />
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <Italic />
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <Strikethrough />
        </button>
        <button
          @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
        >
          <Code />
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()">
          <RemoveFormatting />
        </button>
        <button @click="editor.chain().focus().clearNodes().run()">
          <Eraser />
        </button>
        <button
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          <!-- <Pilcrow /> -->
          P
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          H1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          H2
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          H3
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          H4
        </button>
        <button
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
        </button>
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <List />
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <ListOrdered />
        </button>
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
        >
          <SquareTerminal />
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          <Quote />
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()">
          <Minus />
        </button>
      </div>
    </div>
    <div class="prose text-foreground prose-purple prose-headings:text-foreground max-w-full">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { Italic, ImagePlus, SquarePilcrow, Bold, Strikethrough, Code, RemoveFormatting, Eraser, List, ListOrdered, SquareTerminal, Quote, Minus, Undo2, Redo2 } from 'lucide-vue-next';
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



/* .tiptap pre {
  background: var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
}

.tiptap code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
} */

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


.theme-vs2015 pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}

.theme-vs2015 code.hljs {
  padding: 3px 5px
}

.theme-vs2015 .hljs {
  background: #1e1e1e;
  color: #dcdcdc
}

.theme-vs2015 .hljs-keyword,
.theme-vs2015 .hljs-literal,
.theme-vs2015 .hljs-name,
.theme-vs2015 .hljs-symbol {
  color: #569cd6
}

.theme-vs2015 .hljs-link {
  color: #569cd6;
  text-decoration: underline
}

.theme-vs2015 .hljs-built_in,
.theme-vs2015 .hljs-type {
  color: #4ec9b0
}

.theme-vs2015 .hljs-class,
.theme-vs2015 .hljs-number {
  color: #b8d7a3
}

.theme-vs2015 .hljs-meta .hljs-string,
.theme-vs2015 .hljs-string {
  color: #d69d85
}

.theme-vs2015 .hljs-regexp,
.theme-vs2015 .hljs-template-tag {
  color: #9a5334
}

.theme-vs2015 .hljs-formula,
.theme-vs2015 .hljs-function,
.theme-vs2015 .hljs-params,
.theme-vs2015 .hljs-subst,
.theme-vs2015 .hljs-title {
  color: #dcdcdc
}

.theme-vs2015 .hljs-comment,
.theme-vs2015 .hljs-quote {
  color: #57a64a;
  font-style: italic
}

.theme-vs2015 .hljs-doctag {
  color: #608b4e
}

.theme-vs2015 .hljs-meta,
.theme-vs2015 .hljs-meta .hljs-keyword,
.theme-vs2015 .hljs-tag {
  color: #9b9b9b
}

.theme-vs2015 .hljs-template-variable,
.theme-vs2015 .hljs-variable {
  color: #bd63c5
}

.theme-vs2015 .hljs-attr,
.theme-vs2015 .hljs-attribute {
  color: #9cdcfe
}

.theme-vs2015 .hljs-section {
  color: gold
}

.theme-vs2015 .hljs-emphasis {
  font-style: italic
}

.theme-vs2015 .hljs-strong {
  font-weight: 700
}

.theme-vs2015 .hljs-bullet,
.theme-vs2015 .hljs-selector-attr,
.theme-vs2015 .hljs-selector-class,
.theme-vs2015 .hljs-selector-id,
.theme-vs2015 .hljs-selector-pseudo,
.theme-vs2015 .hljs-selector-tag {
  color: #d7ba7d
}

.theme-vs2015 .hljs-addition {
  background-color: #144212;
  display: inline-block;
  width: 100%
}

.theme-vs2015 .hljs-deletion {
  background-color: #600;
  display: inline-block;
  width: 100%
}
</style>