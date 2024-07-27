<script setup>
import { onMounted, ref, watch } from 'vue'
import Editor from '@/components/EditorTipTap.vue'
import { useCounterStore } from '@/stores/counter'
import NavProjectListLocal from '@/components/NavProjectListLocal.vue'
import { TentTree, GripVertical } from 'lucide-vue-next'
import ToggleTheme from '@/components/ToggleTheme.vue';
import { storeToRefs } from 'pinia'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'
import { useMagicKeys, whenever, useFileDialog, useTimeoutFn, useDropZone, useFocus } from '@vueuse/core'
import ExportPopover from '@/components/ExportPopover.vue'

const inputTitleFocus = ref()
const filesData = ref([])
const showImport = ref(false)
const showProjects = ref(true)
const dropZoneRef = ref()

const keys = useMagicKeys()
const counter = useCounterStore()
const { project_name, project_body } = storeToRefs(counter)
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
const { focused } = useFocus(inputTitleFocus)
const Ctrle = keys['Ctrl+e']
const Ctrli = keys['Ctrl+i']

function create_project() {
  counter.save()
}

function new_project() {
  counter.new_project()
  focused.value = true
}

const { open, onChange } = useFileDialog({
  accept: 'application/json'
})

function onDrop(files) {
  filesData.value = []
  if (files) {
    filesData.value = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))
    counter.importDatabase(files[0])
    useTimeoutFn(() => {
      filesData.value = []
    }, 3000)

  }
}

onChange((files) => {
  counter.importDatabase(files[0])
  showImport.value = false
})


whenever(Ctrle, () => {
  showProjects.value = !showProjects.value
})

whenever(Ctrli, () => {
  showImport.value = !showImport.value
})


watch(project_name, (v) => {
  if (v)
    counter.auto_save()
})

watch(project_body, (v) => {
  if (v)
    counter.auto_save()
})

onMounted(() => {
  counter.auto_save()
})

</script>

<template>
  <div class="flex w-full min-h-screen">
    <div
      v-if="showImport"
      class="bg-secondary relative min-w-96"
    >
      <div
        ref="dropZoneRef"
        class="flex flex-col w-full absolute inset-0 duration-100  justify-center items-center border-2 border-dashed border-secondary-foreground/20 rounded"
        :class="isOverDropZone ? '!border-primary bg-primary/10' : ''"
      >
        <div
          v-if="filesData.length === 0"
          class="grid text-center gap-2"
        >
          <h2>Importar proyectos</h2>
          <button
            type="button"
            @click="open()"
            class="underline text-sm text-primary underline-offset-2"
          >
            Seleccionar archivo JSON
          </button>
        </div>
        <div v-else>
          Se cargaron los proyectos
          <template
            v-for="(file, index) in filesData"
            :key="index"
          >
            <p class="text-xs">
              desde {{ file.name }}
            </p>
          </template>
        </div>
      </div>
    </div>
    <header
      class="flex justify-start h-screen sticky top-0 z-10 flex-col bg-background border-secondary border-r"
      :class="showProjects ? 'min-w-64' : ' '"
    >
      <div
        class="flex items-center justify-between"
        :class="showProjects ? '' : ' flex-col '"
      >
        <TooltipProvider>
          <TooltipRoot :delay-duration="0">
            <TooltipTrigger as-child>
              <button
                @click="showProjects = !showProjects"
                class="flex gap-2 p-2 items-center justify-start"
              >
                <TentTree class="size-4" />
                <span
                  class="text-xs"
                  v-if="showProjects"
                >Menu
                </span>
              </button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                :side="'right'"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-secondary-foreground select-none rounded-[4px] bg-secondary px-2 py-1 text-xs leading-none shadow will-change-[transform,opacity]"
                :side-offset="5"
              >
                Menu
                <kbd
                  class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
                >
                  <span class="">Ctrl</span>B
                </kbd>
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
    <div class="w-full min-h-screen bg-background group">
      <SplitterGroup
        direction="horizontal"
        auto-save-id="splitter"
      >
        <SplitterPanel :min-size="counter.loaded_id !== null ? 0 : 50">
          <div class="ring-1 min-w-96 h-full mx-auto ring-secondary">
            <div
              :key="counter.loaded_id"
              class="max-w-3xl mx-auto"
            >
              <Editor v-model="counter.project_body">
                <input
                  type="text"
                  placeholder="Sin titulo"
                  autocomplete="off"
                  ref="inputTitleFocus"
                  v-model="counter.project_name"
                  class="bg-background outline-none text-lg p-2 h-10 text-primary ring-secondary ring-1 focus-within:ring-primary border-0 w-full placeholder:text-foreground/50"
                >
              </Editor>
            </div>
          </div>
        </SplitterPanel>
        <SplitterResizeHandle
          class="bg-secondary flex justify-center items-center w-3 data-[state=hover]:bg-secondary/50 duration-100"
        >
          <GripVertical />
        </SplitterResizeHandle>
        <SplitterPanel>
          <div class="ring-1 min-w-96 px-2 mx-auto ring-secondary">
            <h2 class="max-w-3xl  mx-auto text-4xl px-6 pt-3">
              {{ counter.project_name }}
            </h2>
            <article
              class="output-group p-6  mx-auto prose text-foreground prose-purple prose-headings:text-foreground max-w-3xl "
              v-dompurify-html="counter.project_body"
            />
          </div>
        </SplitterPanel>
      </SplitterGroup>
      <div
        class="flex fixed bottom-0 right-0 left-0 h-12 justify-between items-center z-20 text-sm bg-background border-t border-secondary gap-8"
      >
        <div class="flex items-center">
          <TooltipProvider>
            <TooltipRoot :delay-duration="0">
              <TooltipTrigger as-child>
                <button
                  @click="showImport = !showImport"
                  class="px-5 h-12"
                  :class="showImport ? 'bg-primary text-white ' : ''"
                >
                  Importar
                </button>
              </TooltipTrigger>
              <TooltipContent
                :side="'top'"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-secondary-foreground select-none rounded-[4px] bg-secondary px-2 py-1 text-xs leading-none shadow will-change-[transform,opacity]"
                :side-offset="5"
              >
                <kbd
                  class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-foreground opacity-100"
                >
                  <span class="">Ctrl</span>I
                </kbd>
                <TooltipArrow
                  class="fill-secondary"
                  :width="8"
                />
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
          <!-- <button
            class="px-5 h-12"
            @click="counter.exportDatabase()"
          >
            Exportar
          </button> -->
          <ExportPopover />
          <button
            v-if="counter.loaded_id !== null"
            @click="new_project()"
            class="px-5 h-12 text-sm font-medium ml-auto shrink-0 underline underline-offset-2 text-primary"
          >
            Crear nuevo documento
          </button>
        </div>
        <div class="">
          <button
            v-if="counter.loaded_id === null"
            @click="create_project()"
            :disabled="counter.project_name === ''"
            :class="counter.project_name ? 'bg-primary text-white h-12 px-5' : 'opacity-50 h-12 px-5 pointer-events-none'"
          >
            Crear Proyecto
          </button>
          <button
            variant="destructive"
            v-if="counter.loaded_id !== null"
            @click="counter.delete_project()"
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
