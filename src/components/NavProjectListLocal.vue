<script setup>
import { useCounterStore } from '@/stores/counter'
import { ArrowRight, CircleX, Plus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue'
import { useFocus, useMagicKeys, refDebounced } from '@vueuse/core'
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'radix-vue'

const focusSearch = ref()
const { focused } = useFocus(focusSearch)
const keys = useMagicKeys()
const counter = useCounterStore()
const CtrlAltS = keys['ctrl+alt+s']
const { allItems, loaded_id, searchTerm, file_name } = storeToRefs(counter)
const debounced = refDebounced(searchTerm, 300)

function new_document() {
  counter.clear_editor()
}

const filteredOptions = computed(() =>
  debounced.value === ''
    ? allItems.value
    : allItems.value.filter((item) => {
      return item.project_data?.name.toLowerCase().includes(debounced.value.toLowerCase())
    })
)

function handleOpenChange() {
  focused.value = true
}

watch(CtrlAltS, (v) => {
  if (v)
    handleOpenChange()
})

</script>
<template>
  <div class="h-full p-1 border-t border-secondary">
    <div class="flex justify-between items-center">
      <div
        class="flex justify-start gap-3"
        v-if="file_name"
      >
        <RouterLink
          to="/"
          class="text-sm"
        >
          {{ file_name }}
        </RouterLink>
      </div>
    </div>
    <div
      class="relative flex items-center justify-between w-full p-1 my-1 text-xs bg-secondary ring-secondary/60 focus-within:ring-secondary"
    >
      <input
        ref="focusSearch"
        v-model="searchTerm"
        placeholder="Filtrar [Ctrl+Alt+S]"
        class="w-full h-6 outline-none bg-secondary placeholder:text-xs"
      >
      <div class="shrink-0">
        <span
          v-if="!searchTerm"
          class="flex items-center justify-center text-xs rounded bg-background size-5"
        >
          {{ allItems?.length }}
        </span>
        <button
          v-else
          class="flex items-center justify-center h-5 gap-2 px-1 text-xs rounded bg-background"
          @click="searchTerm = ''"
        >
          <CircleX class="shrink-0 size-3" />
          <span>{{ filteredOptions.length }}</span>
        </button>
      </div>
    </div>
    <div class="overflow-y-auto overflow-x-hidden h-[calc(100vh-9rem)] ">
      <ScrollAreaRoot
        class="w-full h-[calc(100vh-9rem)] rounded overflow-hidden "
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full rounded">
          <div
            class="py-1"
          >
            <button
              v-if="counter.loaded_id !== null"
              @click="new_document()"
              class="flex items-center justify-start gap-2 text-sm w-full text-left duration-100 focus-within:ring-1 ring-primary"
              :class="counter.loaded_id !== null ? 'text-secondary-foreground  ' : 'text-primary pointer-events-none'"
            >
              <Plus class="size-4" />
              <span>Agregar</span>
            </button>
            <button
              v-else
              @click="counter.create_project()"
              :disabled="counter.project_name === ''"
              class="flex items-center justify-start gap-2 disabled:animate-pulse text-sm w-full text-primary text-left duration-100 focus-within:ring-1 ring-primary"
            >
              <Plus class="size-4" />
              <p class="w-56 truncate">
                Agregando {{ counter.project_name }}
              </p>
            </button>

            <div
              v-for="item in filteredOptions"
              :key="item.id"
              class="w-full"
            >
              <div class="flex flex-row items-center justify-between w-full pb-0">
                <button
                  class="flex items-center outline-none justify-start gap-2 text-sm text-left duration-100 focus-within:ring-1 ring-primary"
                  :class="loaded_id === item.id ? 'text-primary' : ''"
                  @click="counter.set_project(item.id)"
                >
                  <ArrowRight class="size-4" />
                  <p class="w-56 truncate">
                    {{ item.project_data.name }}
                  </p>
                </button>
              </div>
            </div>
            <div
              class="flex justify-center items-center w-full py-5 mt-2 bg-secondary/20"
              v-if="filteredOptions?.length === 0"
            >
              <span class="text-xs text-secondary-foreground/30">Sin resultados</span>
            </div>
          </div>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar
          class="flex select-none touch-none p-0.5 bg-secondary transition-colors duration-[160ms] ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollAreaThumb
            class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
          />
        </ScrollAreaScrollbar>
        <!-- <ScrollAreaScrollbar
          class="flex select-none touch-none p-0.5 bg-secondary transition-colors duration-[160ms] ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="horizontal"
        >
          <ScrollAreaThumb
            class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
          />
        </ScrollAreaScrollbar> -->
      </ScrollAreaRoot>
    </div>
  </div>
</template>