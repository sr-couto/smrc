<script setup>
import { onMounted, ref, watch } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
import { storeToRefs } from 'pinia'
import { TentTree, GripVertical } from 'lucide-vue-next'
import { useCounterStore } from '@/stores/counter'
import { useMagicKeys, whenever } from '@vueuse/core'
import Editor from '@/components/EditorTipTap.vue'
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'radix-vue'
import NavProjectListLocal from '@/components/NavProjectListLocal.vue'
import ToggleTheme from '@/components/ToggleTheme.vue';
import Tooltip from '@/components/ui/Tooltip.vue'
import BottomToolbar from '@/components/BottomToolbar.vue'
import FileDropZone from '@/components/FileDropZone.vue'

const counter = useCounterStore()
const { project_name, project_body } = storeToRefs(counter)

const keys = useMagicKeys()
const CtrlAltW = keys['ctrl+alt+w']

onMounted(() => {
  counter.set_database()
  counter.auto_save()
})

whenever(CtrlAltW, () => {
  counter.showProjects = !counter.showProjects
})

watch(project_name, (v) => {
  if (v)
    counter.auto_save()
})

watch(project_body, (v) => {
  if (v)
    counter.auto_save()
})

</script>
<template>
  <div class="flex w-full h-screen overflow-y-hidden">
    <header
      class="fixed lg:sticky top-0 z-20 flex flex-col justify-start h-screen border-r bg-background hover:bg-background/80 duration-300  border-secondary"
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
            >Menu
            </span>
          </button>
        </Tooltip>
        <ToggleTheme />
        <button
          @click="counter.showProjects = !counter.showProjects"
          v-show="!counter.showProjects"
          class="absolute inset-0 top-20 z-10" 
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
      class="fixed inset-0 bg-background/95 lg:hidden z-10"
    />
    <div class="w-full pl-8 lg:pl-0 min-h-screen bg-background group">
      <SplitterGroup
        direction="horizontal"
        auto-save-id="splitter"
      >
        <SplitterPanel :min-size="50">
          <div class="h-full mx-auto ring-1 md:w-auto  ring-secondary">
            <div
              :key="counter.loaded_id"
              class="w-full mx-auto"
            >
              <Editor v-model="counter.project_body">
                <input
                  type="text"
                  placeholder="Sin titulo"
                  autocomplete="off"
                  v-model="counter.project_name"
                  class="w-full h-10 p-2 text-lg outline-none bg-background text-primary border-secondary border focus-within:border-primary placeholder:text-foreground/50"
                >
              </Editor>
            </div>
          </div>
        </SplitterPanel>
        <SplitterResizeHandle
          class="bg-secondary hidden md:flex justify-center items-center w-3 data-[state=hover]:bg-secondary/50 duration-100"
        >
          <GripVertical />
        </SplitterResizeHandle>
        <SplitterPanel class="hidden md:flex"/>
      </SplitterGroup>
      <BottomToolbar />
    </div>
  </div>
</template>

<style>

.preview  img {
  @apply w-full
}


</style>
