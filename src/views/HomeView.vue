<script setup>
import { onMounted, ref, watch } from "vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "radix-vue";
import { storeToRefs } from "pinia";
import { TentTree, GripVertical } from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
import { useMagicKeys, whenever } from "@vueuse/core";
import Editor from "@/components/EditorTipTap.vue";
import NavProjectListLocal from "@/components/NavProjectListLocal.vue";
import ToggleTheme from "@/components/ToggleTheme.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import BottomToolbar from "@/components/BottomToolbar.vue";
import DialogInfo from "@/components/DialogInfo.vue";

const counter = useCounterStore();
const { project_name, project_body } = storeToRefs(counter);

const keys = useMagicKeys();
const CtrlAltW = keys["ctrl+alt+w"];
const layout = ref(0)

onMounted(() => {
  counter.init_database();
  counter.auto_save();
});

whenever(CtrlAltW, () => {
  counter.showProjects = !counter.showProjects;
});

watch(project_name, (v) => {
  if (v) counter.auto_save();
});

watch(project_body, (v) => {
  if (v) counter.auto_save();
});
</script>
<template>
  <div class="flex w-full h-screen overflow-y-hidden">
    <header
      class="fixed lg:sticky top-0 z-50 flex flex-col justify-start h-screen border-r bg-background border-secondary"
      :class="counter.showProjects ? 'min-w-64' : ' '"
    >
      <div
        class="flex items-center justify-between"
        :class="counter.showProjects ? '' : ' flex-col '"
      >
        <Tooltip
          name="Menú"
          shortcut="W"
        >
          <button
            @click="counter.showProjects = !counter.showProjects"
            class="flex items-center justify-start gap-2 p-2"
          >
            <TentTree class="size-4" />
            <span
              class="text-xs"
              v-show="counter.showProjects"
            >Menu </span>
          </button>
        </Tooltip>
        <div
          class="flex  gap-1"
          :class="counter.showProjects ? '' : ' flex-col '"
        >
          <DialogInfo />
          
          <ToggleTheme />
        </div>
        <button
          @click="counter.showProjects = !counter.showProjects"
          v-show="!counter.showProjects"
          class="absolute inset-0 top-32 z-10"
        />
      </div>
      <NavProjectListLocal v-show="counter.showProjects" />
      <!-- <FileDropZone
        v-show="counter.showProjects"
        class="hidden md:flex"
      /> -->
    </header>
    <button
      @click="counter.showProjects = !counter.showProjects"
      v-show="counter.showProjects"
      class="fixed inset-0 bg-background/90 lg:hidden z-40"
    />
    <div class="w-full pl-8 lg:pl-0 min-h-screen bg-background group">
      <SplitterGroup
        direction="horizontal"
        auto-save-id="splitter"
        @layout="layout = $event"
      >
        <div
          :style="`flex: ${layout[1]} 1 0px; overflow: hidden;`"
          class="hidden md:flex"
        />
        <SplitterPanel
          :min-size="75"
        >
          <div class="h-full mx-auto ring-1 md:w-auto ring-secondary">
            <div
              :key="counter.loaded_id"
              class="w-full mx-auto"
            >
              <Editor
                v-model="counter.project_body"
                toolbar
              >
                <div class="flex gap-1 w-full items-center justify-between">
                  <input
                    type="text"
                    placeholder="Sin titulo"
                    autocomplete="off"
                    @keyup.enter="counter.create_project()"
                    v-model="counter.project_name"
                    class="w-full h-10 p-2 text-lg outline-none bg-background text-primary border-secondary border focus-within:border-primary placeholder:text-foreground/50"
                  >
                  <button
                    v-show="!counter.loaded_id"
                    @click="counter.create_project()"
                    class="h-10 px-3 shrink-0 text-xs"
                    :disabled="counter.project_name === ''"
                    :class="
                      counter.project_name
                        ? 'bg-primary text-white '
                        : 'opacity-50 bg-secondary  pointer-events-none'
                    "
                  >
                    Crear
                  </button>
                </div>
              </Editor>
            </div>
          </div>
        </SplitterPanel>
        <SplitterResizeHandle
          class=" hidden md:flex justify-center items-center w-2 border-l border-secondary data-[state=hover]:border-primary/10 duration-100"
        />
        <SplitterPanel
          :max-size="30"
          class="hidden md:flex"
        />
      </SplitterGroup>
      <BottomToolbar />
    </div>
  </div>
</template>

<style>
.preview img {
  @apply w-full;
}
</style>
