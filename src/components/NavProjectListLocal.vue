<script setup>
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
const { items, loaded_id } = storeToRefs(counter)
import { ArrowRight, CircleX } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue'

const searchTerm = ref('')

const filteredOptions = computed(() =>
  searchTerm.value === ''
    ? items.value
    : items.value.filter((item) => {
      return item.project_data?.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
)

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
      <button
        @click="counter.new_project()"
        class="text-sm font-medium ml-auto shrink-0 underline underline-offset-2 text-primary"
      >
        Crear
      </button>
    </div>
    <div class="w-full my-1 relative bg-secondary flex text-xs p-1 ring-secondary/60 focus-within:ring-primary">
      <input
        v-model="searchTerm"
        placeholder="Filtrar"
        class=" outline-none w-full bg-secondary"
      >
      <button
        class="size-6 flex justify-center items-center"
        @click="searchTerm = ''"
      >
        <CircleX
          v-if="searchTerm"
          class="shrink-0 size-4"
        />
      </button>
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
            @click="counter.setProject(item.id)"
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