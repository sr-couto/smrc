<template>
  <div
    v-if="editor"
    v-auto-animate
    class="p-1"
  >
    <div class="control-group flex md:flex-row flex-col flex-wrap items-center gap-3 relative">
      <slot />
      <div class="flex w-full md:w-auto justify-start gap-2">
        <button
          class="size-11 focus-visible:border-primary outline-none flex justify-center items-center border rounded border-secondary"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
        >
          <Undo2 class="size-5" />
        </button>
        <button
          class="size-11 focus-visible:border-primary outline-none flex justify-center items-center border rounded border-secondary"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
        >
          <Redo2 class="size-5" />
        </button>
        <button
          class="size-11 focus-visible:border-primary outline-none flex justify-center items-center border rounded border-secondary"
          @click="editorToolbar = !editorToolbar"
        >
          <SquarePilcrow class="size-5" />
        </button>
        <button
          @click="addImage"
          class="size-11 focus-visible:border-primary outline-none flex justify-center items-center border rounded border-secondary"
        >
          <ImagePlus class="size-5" />
        </button>
      </div>
    </div>
    <div
      class="button-group flex mt-2 gap-1 flex-wrap"
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
import { Editor, EditorContent } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

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
      editorToolbar: false,
    }
  },

  methods: {
    addImage() {
      const url = window.prompt('URL')
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
        StarterKit,
        Image,
        Placeholder.configure({
          placeholder: 'Escribir algo …',
        }),
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
  @apply border border-secondary focus-within:border-primary min-w-9 max-w-10 flex-1 outline-none h-9 text-sm focus-visible:border-primary flex justify-center items-center duration-100;

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
  @apply p-2 border-0 outline-none placeholder:text-primary min-h-96;
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

.dark .prose * {
  @apply text-foreground
}
</style>