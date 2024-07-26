<script setup>
import Editor from '@/components/EditorTipTap.vue'
import { useCounterStore } from '@/stores/counter'
import NavProjectListLocal from '@/components/NavProjectListLocal.vue'
import { TentTree } from 'lucide-vue-next'
import ToggleTheme from '@/components/ToggleTheme.vue';
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'

const counter = useCounterStore()
const { project_name, project_body } = storeToRefs(counter)
const keys = useMagicKeys()

const showProjects = ref(true)
const Ctrlb = keys['Ctrl+b']

whenever(Ctrlb, () => {
  showProjects.value = !showProjects.value
})

onMounted(() => {
  counter.autoSave()
})

watch(project_name, (v) => {
  if (v)
    counter.autoSave()
})

watch(project_body, (v) => {
  if (v)
    counter.autoSave()
})

function create() {
  counter.save()
}

</script>

<template>
  <div class="flex w-full min-h-screen">
    <header
      class=" flex justify-start h-screen sticky top-0 z-10 flex-col bg-background border-r"
      :class="showProjects ? 'min-w-64' : ' '"
    >
      <div
        class="flex items-center justify-between"
        :class="showProjects ? '' : ' flex-col '"
      >
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger as-child>
              <button
                @click="showProjects = !showProjects"
                class="flex gap-2 p-2 items-center justify-start"
              >
                <TentTree class="size-4" />
                <span
                  class="text-xs"
                  v-if="showProjects"
                >Menu</span>
              </button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                :side="'right'"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-grass11 select-none rounded-[4px] bg-secondary px-2 py-1 text-xs leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                :side-offset="5"
              >
                Menu
                <TooltipArrow
                  class="fill-secondary"
                  :width="8"
                />
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>
        <ToggleTheme />
      </div>
      <NavProjectListLocal v-if="showProjects" />
    </header>
    <div class="w-full min-h-screen bg-background overflow-y-auto group">
      <SplitterGroup
        direction="horizontal"
        auto-save-id="splitter"
      >
        <SplitterPanel>
          <div class="ring-1 mx-auto ring-neutral-800">
            <div class="flex justify-between gap-2 items-start w-full">
              <input
                type="text"
                placeholder="Sin titulo"
                autocomplete="off"
                v-model="counter.project_name"
                class="bg-background outline-none text-lg p-3 focus-within:ring-1 ring-primary/50 border-0 w-full placeholder:text-foreground/50"
              >
            </div>
            <div :key="counter.loaded_id">
              <Editor v-model="counter.project_body" />
            </div>
          </div>
        </SplitterPanel>
        <SplitterResizeHandle class="bg-secondary w-0.5 data-[state=hover]:bg-secondary/50 duration-100" />
        <SplitterPanel>
          <h2 class="max-w-3xl mx-auto text-4xl px-6 pt-3">
            {{ counter.project_name }}
          </h2>
          <article
            class="output-group p-6  mx-auto prose text-foreground prose-purple prose-headings:text-foreground max-w-3xl "
            v-dompurify-html="counter.project_body"
          />
        </SplitterPanel>
      </SplitterGroup>
      <div
        class="flex fixed bottom-0 right-0 left-0 h-12 justify-between items-center z-20 text-sm bg-background border-t border-secondary gap-8"
      >
        <div class="px-3 ">
          <button
            class=""
            @click="counter.export_data()"
          >
            Exportar datos JSON
          </button>
        </div>
        <div class="">
          <button
            v-if="counter.loaded_id === null"
            @click="create()"
            :disabled="counter.project_name === ''"
            :class="counter.project_name ? 'bg-primary text-white h-12 px-5' : 'opacity-50 h-12 px-5 pointer-events-none'"
          >
            Crear Proyecto
          </button>
          <button
            variant="destructive"
            v-if="counter.loaded_id !== null"
            @click="counter.deleteProject()"
            :class="counter.loaded_id ? 'text-primary h-12 px-5' : 'opacity-50 h-12 px-5 pointer-events-none'"
            :disabled="counter.loaded_id === null"
          >
            Eliminar documento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
