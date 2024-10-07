<script setup>
import { shallowRef, watch } from "vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "radix-vue";
import { storeToRefs } from "pinia";
import { ArrowRightToLine, Trash2 } from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
import Editor from "@/components/Tiptap/EditorTipTap.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import DialogProjectListSearch from "./DialogProjectListSearch.vue";

const panelRef = shallowRef()
const counter = useCounterStore();
const { project_name, project_body } = storeToRefs(counter);
const layout = shallowRef(0)

watch(project_name, (v) => {
  if (v) counter.auto_save();
});

watch(project_body, (v) => {
  if (v) counter.auto_save();
});

</script>

<template>
  <div class="w-full min-h-screen pl-8 lg:pl-0 bg-background ">
    <SplitterGroup
      direction="horizontal"
      auto-save-id="splitter"
      @layout="layout = $event"
    >
      <div
        :style="`flex: ${layout[1]} 1 0px; overflow: hidden;`"
        class="hidden lg:flex"
      />
      <SplitterPanel :min-size="80">
        <div
          :key="counter.loaded_id"
          class="relative h-full mx-auto ring-1 lg:w-full ring-secondary"
        >
          <Editor
            v-if="counter.content_editable"
            v-model="counter.project_body"
            toolbar
            editable
          >
            <div class="flex flex-col items-start justify-between w-full gap-1">
              <textarea
                placeholder="Item sin título"
                autocomplete="off"
                spellcheck="false"
                v-model="counter.project_name"
                style="field-sizing: content"
                class="w-full px-2 py-1 overflow-visible border outline-none resize-none min-h-9 create_project bg-background text-foreground border-secondary focus-within:border-primary placeholder:text-foreground/50 hover:border-primary"
              />
            </div>
          </Editor>
          <Editor
            v-else
            v-model="counter.project_body"
          >
            <div v-if="counter.loaded_id === ''">
              Seleccione un item para visualizar
            </div>
            <h1 class="pt-6 mb-0 font-serif text-4xl/relax text-primary text-balance">
              {{ counter.project_name }}
            </h1>
          </Editor>
          <button
            v-show="!counter.loaded_id"
            @click="counter.create_project()"
            :disabled="counter.project_name === ''"
            :class="counter.project_name
              ? 'bg-primary text-primary-foreground '
              : 'disabled bg-secondary  pointer-events-none'
            "
            class="absolute bottom-0 left-0.5 right-0 md:right-2 z-20 px-3 text-xs h-11"
          >
            <span
              class="GuardarDocumento"
            >
              Guardar documento
            </span>
          </button>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        class="hidden lg:flex group justify-center items-center w-8 border-l-2 border-secondary/10 data-[state=hover]:border-primary/90  data-[state=drag]:border-primary/90 data-[state=hover]:delay-700 data-[state=hover]:border-l-4 duration-300"
      >
        <Tooltip
          :name="panelRef?.isCollapsed ? 'Contraer' : 'Expandir'"
          :side="panelRef?.isCollapsed ? 'left' : 'right'"
        >
          <button
            class="flex items-center z-20 justify-center !cursor-pointer bg-background size-6"
            @click="panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()"
            @keyup.enter="panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()"
            :class="panelRef?.isCollapsed ? 'rotate-180' : ''"
          >
            <ArrowRightToLine class="delay-75 !cursor-pointer size-4 opacity-90" />
          </button>
        </Tooltip>
      </SplitterResizeHandle>
      <SplitterPanel
        :max-size="20"
        :collapsed-size="0"
        ref="panelRef"
        collapsible
        @resize="resize = $event"
        class="hidden lg:flex"
      />
    </SplitterGroup>
    <button
      @click="counter.delete_project()"
      class="fixed bottom-0 right-0 flex items-center justify-center ml-auto text-xs size-8 hover:bg-primary/30 bg-primary/10"
      :class="counter.loaded_id ? 'text-primary' : 'hidden'
      "
    >
      <Trash2 class="size-4" />
    </button>
    <DialogProjectListSearch />
  </div>
</template>

<style>
/* textarea.create_project {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea.create_project::-webkit-scrollbar {
  display: none;
} */
</style>