<template>
  <node-view-wrapper class="code-block">
    <select
      contenteditable="false"
      v-model="selectedLanguage"
    >
      <option :value="null">
        auto
      </option>
      <option disabled>
        —
      </option>
      <option
        v-for="(language, index) in languages"
        :value="language"
        :key="index"
      >
        {{ language }}
      </option>
    </select>
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },

  props: nodeViewProps,

  data() {
    return {
      languages: this.extension.options.lowlight.listLanguages(),
    };
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language;
      },
      set(language) {
        this.updateAttributes({ language });
      },
    },
  },
};
</script>

<style>
.tiptap .code-block {
  position: relative;
}

.tiptap select {
  @apply bg-background border border-background top-1 right-1 text-xs p-1 absolute;
}

.tiptap option {
  @apply bg-secondary;
}
</style>
