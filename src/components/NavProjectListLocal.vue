<script setup>
import { useCounterStore } from '@/stores/counter'
import { ArrowRight, CircleX } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue'
import { useFocus, useMagicKeys, refDebounced } from '@vueuse/core'

const focusSearch = ref()
const { focused } = useFocus(focusSearch)

const keys = useMagicKeys()
const counter = useCounterStore()
const { allItems, loaded_id, searchTerm, file_name } = storeToRefs(counter)
const debounced = refDebounced(searchTerm, 300)
const CtrlM = keys['Ctrl+M']

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
  <div class="h-full border-t p-1 border-secondary">
    <div class="flex justify-start gap-3">
      <RouterLink
        to="/"
        class="text-sm"
      >
        {{ file_name }}
      </RouterLink>
    </div>
    <div class="w-full my-1 relative bg-secondary  items-center flex text-xs justify-between p-1 ring-secondary/60 focus-within:ring-secondary">
      <input
        ref="focusSearch"
        v-model="searchTerm"
        placeholder="Filtrar [Ctrl+M]"
        class=" outline-none w-full bg-secondary h-6 placeholder:text-xs"
      >
      <div class="shrink-0">
        <span
          v-if="!searchTerm"
          class="text-xs bg-background size-5 flex justify-center items-center rounded"
        >
          {{ allItems?.length }}
        </span>
        <button
          v-else
          class="text-xs bg-background px-1 h-5 gap-2 flex justify-center items-center rounded"
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
        <div class="flex flex-row w-full justify-between items-center pb-0">
          <button
            class="flex items-center focus-within:ring-1 duration-100 ring-primary justify-start text-left text-sm gap-2"
            :class="loaded_id === item.id ? 'text-primary' : ''"
            @click="counter.set_project(item.id)"
          >
            <ArrowRight class="size-4" />
            <p class="truncate w-56">
              {{ item.project_data.name }}
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>