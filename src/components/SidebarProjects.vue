<script setup>
import { useCounterStore } from "@/stores/counter";
import {
  CircleX,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, watch, shallowRef } from "vue";
import {
  onClickOutside,
  refDebounced,
  useStorage,
} from "@vueuse/core";
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "radix-vue";

import SearchItem from "./SearchItem.vue";
import SearchItemChecked from "./SearchItemChecked.vue";
import SelectSort from "./ui/SelectSort.vue";
import ButtonCreateDocument from "./ui/ButtonCreateDocument.vue";
import EditDatabaseTitle from "./ui/EditDatabaseTitle.vue";

const target = shallowRef(null);
const editing = shallowRef(false);
const counter = useCounterStore();
const { allItemsTodo, allItemsChecked, searchTerm, file_name } =
storeToRefs(counter);

const debounced = refDebounced(searchTerm, 300);
const input = shallowRef(file_name);
const sortOption = useStorage("sortItemsBy", "name");

onClickOutside(target, () => {
  editing.value = false;
});

watch(input, (v) => {
  if (v) counter.update_database(input.value);
  counter.auto_save();
});

const results = computed(() => {
  if (!Array.isArray(allItemsTodo.value)) {
    return [];
  }

  const sortedItems = [...allItemsTodo.value].sort((a, b) => {
    const aFixed = a.project_data?.fixed ?? false;
    const bFixed = b.project_data?.fixed ?? false;

    if (aFixed !== bFixed) {
      return bFixed - aFixed;
    }

    if (sortOption.value === "name") {
      return a.project_data?.name.localeCompare(b.project_data?.name);
    } else if (sortOption.value === "date") {
      return new Date(a.project_data?.date) - new Date(b.project_data?.date);
    }
    return 0;
  });

  return debounced.value === ""
    ? sortedItems
    : sortedItems.filter((item) => {
      return item.project_data?.name
        .toLowerCase()
        .includes(debounced.value.toLowerCase());
    });
});


</script>

<template>
  <div class="h-full @container">
    <EditDatabaseTitle />
    <ButtonCreateDocument />
    <div
      class="relative flex items-center justify-between w-full gap-0.5 p-0.5 text-xs bg-background ring-secondary/60 focus-within:ring-secondary"
    >
      <div
        class="relative flex items-center justify-between w-full border-2 hover:border-primary focus-within:border-primary h-7 border-secondary"
      >
        <input
          ref="focusSearch"
          v-model="searchTerm"
          placeholder="Filtrar por título"
          class="h-6 px-1 outline-none bg-background placeholder:text-xs"
        >
        <span
          v-if="!searchTerm"
          class="flex items-center justify-center h-6 mr-0.5 text-xs w-7"
        >
          {{ allItemsTodo?.length }}
        </span>
        <button
          v-else
          class="absolute top-0 right-0 flex items-center justify-center gap-2 px-2 py-1 text-xs bg-secondary hover:outline-none hover:bg-secondary/90"
          @click="searchTerm = ''"
        >
          <span class="min-w-3">{{ results.length }}</span>
          <CircleX class="size-3" />
        </button>
      </div>
      <SelectSort />
    </div>
    <div class="overflow-y-auto overflow-x-hidden h-[calc(100vh-11.5rem)]">
      <ScrollAreaRoot
        class="w-full h-[calc(100vh-11.5rem)] rounded overflow-hidden"
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full rounded">
          <div
            class="py-1 px-0.5 flex flex-col justify-start items-start relative gap-1"
          >
            <SearchItem
              v-for="item in results"
              :key="item.id"
              :data="item"
            />
            <SearchItemChecked
              v-for="item in allItemsChecked"
              :key="item.id"
              :data="item"
            />
            <div
              v-if="results?.length + allItemsChecked?.length === 0"
              class=" w-full h-[calc(100vh-20rem)] text-center flex items-center justify-center"
            >
              <p class="w-40 text-xs text-muted-foreground text-pretty">
                Aqui se mostrarán tus documentos
              </p>
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
      </ScrollAreaRoot>
    </div>
  </div>
</template>
