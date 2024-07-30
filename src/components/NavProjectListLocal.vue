<script setup>
import { useCounterStore } from '@/stores/counter'
import { ArrowRight, CircleX, CirclePlus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue'
import { useFocus, useMagicKeys, refDebounced } from '@vueuse/core'

const focusSearch = ref()
const { focused } = useFocus(focusSearch)
const keys = useMagicKeys()
const counter = useCounterStore()
const CtrlM = keys['Ctrl+M']
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

watch(CtrlM, (v) => {
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
      <button
        @click="new_document()"
        class="text-xs flex gap-1 "
        :class="counter.loaded_id !== null ? 'text-primary  ' : 'text-primary/50 pointer-events-none'"
      >
        Agregar
        <CirclePlus class="size-4" />
      </button>
    </div>
    <div
      class="relative flex items-center justify-between w-full p-1 my-1 text-xs bg-secondary ring-secondary/60 focus-within:ring-secondary"
    >
      <input
        ref="focusSearch"
        v-model="searchTerm"
        placeholder="Filtrar [Ctrl+M]"
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
    <div
      class="mt-3"
      v-auto-animate
    >
      <div
        v-for="item in filteredOptions"
        :key="item.id"
        class="w-full"
      >
        <div class="flex flex-row items-center justify-between w-full pb-0">
          <button
            class="flex items-center justify-start gap-2 text-sm text-left duration-100 focus-within:ring-1 ring-primary"
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
    </div>
  </div>
</template>