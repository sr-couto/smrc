<script setup>
import { useCounterStore } from '@/stores/counter'
import { ArrowRight } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue'
import { useFocus, useMagicKeys } from '@vueuse/core'

const inputSearch = ref()
const { focused } = useFocus(inputSearch)
const counter = useCounterStore()
const { items, loaded_id } = storeToRefs(counter)
const searchTerm = ref('')

const filteredOptions = computed(() =>
  searchTerm.value === ''
    ? items.value
    : items.value.filter((item) => {
      return item.project_data?.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
)

const keys = useMagicKeys()
const CtrlM = keys['Ctrl+M']

function handleOpenChange() {
  focused.value = true
}

watch(CtrlM, (v) => {
  if (v)
    handleOpenChange()
})

</script>

<template>
  <div class="h-full border-t p-1 border-neutral-800">
    <div class="flex justify-start gap-3">
      <RouterLink
        to="/"
        class="text-sm"
      >
        Proyectos
      </RouterLink>
      <span class="text-xs bg-secondary size-5 flex justify-center items-center rounded">
        {{ items?.length }}
      </span>
    </div>
    <div class="w-full my-1 relative bg-secondary flex text-xs p-1 ring-secondary/60 focus-within:ring-secondary">
      <input
        ref="inputSearch"
        v-model="searchTerm"
        placeholder="Filtrar [Ctrl+M]"
        class=" outline-none w-full bg-secondary h-6 placeholder:text-xs"
      >
      <!-- <button
        v-if="searchTerm"
        class="size-6 flex justify-center items-center"
        @click="searchTerm = ''"
      >
        <CircleX class="shrink-0 size-4" />
      </button> -->
    </div>
    <div class="mt-3">
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