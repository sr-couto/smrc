<template>
  <node-view-wrapper
    class="code-block"
    spellcheck="false"
  >
    <div
      class="absolute top-0 right-0 z-40 flex items-center justify-end gap-1 -translate-x-1 -translate-y-4"
    >
      <RadixVirtual
        v-model="selectedLanguage"
        :items="languages"
      />
      <button
        class="flex items-center justify-center duration-100 size-6 bg-secondary shrink-0"
        :class="copyText === 'Copied' ? '!bg-primary' : ''"
        @click="copyToClipboard()"
      >
        <ClipboardCheck
          v-if="copyText === 'Copied'"
          class="size-4 text-primary-foreground"
        />
        <Clipboard
          v-else
          class="size-4"
        />
      </button>
    </div>
    <pre><code class="text-xs leading-6"><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { bundledLanguages } from "shiki";
import RadixVirtual from "@/components/ui/RadixVirtual.vue";
import { Clipboard, ClipboardCheck } from "lucide-vue-next";

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
    RadixVirtual,
    Clipboard,
    ClipboardCheck,
  },

  props: nodeViewProps,

  data() {
    return {
      languages: Object.keys(bundledLanguages),
      copyText: "Copy",
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
  methods: {
    copyToClipboard(uuid, successful = () => null, failure = () => null) {
      const clipboard = navigator.clipboard;
      let value = this.node.content.content[0].text;
      if (clipboard !== undefined && clipboard !== "undefined") {
        navigator.clipboard.writeText(value).then(successful, failure);
        this.copyText = "Copied";
      } else {
        if (document.execCommand) {
          const el = document.createElement("textarea");
          el.value = value;
          document.body.append(el);

          el.select();
          el.setSelectionRange(0, value.length);

          if (document.execCommand("copy")) {
            this.copyText = "Copied"; // popper?
            // successful();
          }

          el.remove();
        } else {
          this.copyText = "Error!";
          alert("Error!");
          // failure();
        }
      }
      setTimeout(() => {
        this.copyText = "copy";
      }, 1000);
    },
  },
};
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
