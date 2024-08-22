<script setup>
import { ref, watch } from "vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "radix-vue";
import { storeToRefs } from "pinia";
import { ArrowRightToLine, Delete, X } from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
import Editor from "@/components/Tiptap/EditorTipTap.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import BottomToolbar from "@/components/BottomToolbar.vue";

const panelRef = ref()
const counter = useCounterStore();
const { project_name, project_body } = storeToRefs(counter);
const layout = ref(0)

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
          class="h-full mx-auto ring-1 lg:w-full ring-secondary"
        >
          <Editor
            v-model="counter.project_body"
            toolbar
          >
            <div class="flex items-center justify-between w-full gap-1">
              <textarea
                placeholder="Sin titulo"
                autocomplete="off"
                spellcheck="false"
                v-model="counter.project_name"
                style="field-sizing: content"
                class="w-full px-2 py-1 overflow-visible border outline-none resize-none min-h-9 create_project bg-background text-primary border-secondary focus-within:border-primary placeholder:text-foreground/50"
              />
              <button
                v-show="counter.project_name !== ''"
                @click="counter.clear_editor()"
                :class="counter.project_name
                  ? 'bg-secondary text-secondary-foreground '
                  : 'opacity-50 bg-secondary  pointer-events-none'
                "
                class="px-3 text-xs h-9 shrink-0"
              >
                <Delete class="size-4" />
              </button>
              <button
                v-show="!counter.loaded_id"
                @click="counter.create_project()"
                :disabled="counter.project_name === ''"
                :class="counter.project_name
                  ? 'bg-primary text-primary-foreground '
                  : 'opacity-50 bg-secondary  pointer-events-none'
                "
                class="px-3 text-xs h-9 shrink-0"
              >
                Crear
              </button>
            </div>
          </Editor>
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        class=" hidden lg:flex group justify-center items-center w-8 border-l-2 border-secondary data-[state=hover]:border-primary/90 data-[state=hover]:text-primary data-[state=drag]:border-primary/90 duration-100"
      >
        <Tooltip
          :name="panelRef?.isCollapsed ? 'Doble click para eontraer' : 'Doble click para expandir'"
          :side="panelRef?.isCollapsed ? 'left' : 'right'"
        >
          <button
            class="flex items-center z-20 justify-center !cursor-pointer bg-background size-6"
            @dblclick="panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()"
            @keyup.enter="panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()"
            :class="panelRef?.isCollapsed ? 'rotate-180' : ''"
          >
            <ArrowRightToLine class="text-current duration-100 !cursor-pointer size-4 opacity-90" />
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
    <BottomToolbar />
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