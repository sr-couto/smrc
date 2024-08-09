<template>
  <node-view-wrapper
    class="code-block"
    spellcheck="false"
  >
    <div class="flex absolute z-40 p-1 -translate-y-6 translate-x-1 top-0 right-0 gap-2">
      <RadixVirtual
        v-model="selectedLanguage"
        :items="languages"
      />
    </div>
    <pre><code class="text-xs leading-6"><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import {
  bundledLanguages,
} from 'shiki'
import RadixVirtual from '@/components/ui/RadixVirtual.vue';

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
    RadixVirtual
  },

  props: nodeViewProps,

  data() {
    return {
      languages: Object.keys(bundledLanguages),
    }
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language
      },
      set(language) {
        this.updateAttributes({ language })
      },
    },
  },
}
</script>

<style>
.tiptap .code-block {
  position: relative;
}

.tiptap select {
  @apply bg-background font-mono border border-background top-1 right-1 text-xs p-1 absolute;
}

.tiptap option {
  @apply bg-secondary;
}
</style>