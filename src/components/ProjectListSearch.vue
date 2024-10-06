<script setup>
import { useCounterStore } from "@/stores/counter";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  CircleOff,
  CircleX,
  DatabaseZap,
  Pin,
  PinOff,
  Plus,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, watch, shallowRef } from "vue";
import {
  onClickOutside,
  refDebounced,
  breakpointsTailwind,
  useBreakpoints,
  useStorage,
} from "@vueuse/core";
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "radix-vue";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";

import Tooltip from "./ui/Tooltip.vue";
import ProjectListSearchItem from "./ProjectListSearchItem.vue";
import ProjectListSearchItemDisabled from "./ProjectListSearchItemDisabled.vue";

const target = shallowRef(null);
const editing = shallowRef(false);
const counter = useCounterStore();
const { allItemsTodo, allItemsChecked, loaded_id, searchTerm, file_name } =
  storeToRefs(counter);


const debounced = refDebounced(searchTerm, 300);
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanLg = breakpoints.greater("lg");

// const sortOption = ref("name"); // Sort option state
const sortOption = useStorage("sortItemsBy", "name");

function editTitle() {
  editing.value = !editing.value;
}

onClickOutside(target, () => {
  editing.value = false;
});

const input = shallowRef(file_name);

watch(input, (v) => {
  if (v) counter.update_database(input.value);
  counter.auto_save();
});

function new_document() {
  if (largerThanLg.value === true) {
    counter.clear_editor();
    counter.content_editable = true;
  } else {
    counter.clear_editor();
    counter.showProjects = false;
    counter.content_editable = true;
  }
}


const allItemsUncheckedFiltered = computed(() => {
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
    <div
      class="flex items-center justify-center mx-0.5 text-sm border group bg-background/80 hover:bg-secondary/50 border-secondary"
    >
      <button
        v-if="!editing"
        @click="editTitle()"
        class="flex items-center justify-between w-full h-8 gap-1 pl-1"
      >
        <span
          v-if="!file_name"
          class="opacity-50"
        > Proyecto sin título </span>
        <span v-else>
          {{ file_name }}
        </span>
        <Tooltip
          name="Editar nombre de la base de datos local"
          side="top"
          align="end"
        >
          <span
            class="flex items-center justify-center duration-100 border border-transparent group-hover:border size-8 shrink-0 bg-background group-hover:border-primary"
          >
            <DatabaseZap class="size-4 text-foreground" />
          </span>
        </Tooltip>
      </button>
      <div
        ref="target"
        v-if="editing"
        class="flex items-center justify-between w-full h-8"
      >
        <input
          type="text"
          ref="focusedEditTitle"
          placeholder="Escriba un título"
          @keyup.enter="editTitle()"
          class="w-full h-8 pl-1 text-sm border outline-none bg-background text-primary border-secondary"
          v-model="input"
        >
        <button
          class="flex items-center justify-center outline-none size-8 shrink-0 bg-primary/80 hover:bg-primary/90 focus-visible:ring-2 ring-primary-foreground"
          @click="editTitle()"
        >
          <Check class="size-4 text-primary-foreground" />
        </button>
      </div>
    </div>
    <Tooltip
      name="Falta agregar un titulo."
      :side="'bottom'"
    >
      <button
        @click="loaded_id === '' ? null : new_document()"
        class="flex items-center my-0.5 justify-center gap-2 text-xs min-h-7 w-full text-left bg-primary focus-within:ring-1 ring-primary"
        :class="{
          '!bg-primary text-primary-foreground': loaded_id === null,
          '!bg-secondary text-secondary-foreground animate-pulse': loaded_id === '',
        }"
      >
        <Plus
          v-show="loaded_id !== ''"
          class="size-4 text-primary-foreground"
        />
        <span
          v-show="loaded_id === ''"
          class="flex items-center gap-1"
        >
          * Creando documento
          <span
            v-show="counter.project_name"
            class="inline-block font-bold truncate opacity-80 max-w-24"
          >
            {{ counter.project_name }}
          </span>

        </span>
        <span
          class="text-primary-foreground"
          v-show="loaded_id !== ''"
        >Crear nuevo documento</span>
      </button>
    </Tooltip>
    <div
      class="relative flex items-center justify-between w-full gap-0.5 p-0.5 text-xs bg-background ring-secondary/60 focus-within:ring-secondary"
    >
      <div class="relative flex items-center justify-between w-full border-2 hover:border-primary focus-within:border-primary h-7 border-secondary">
        <input
          ref="focusSearch"
          v-model="searchTerm"
          placeholder="Filtrar por título"
          class="h-6 px-1 outline-none bg-background placeholder:text-xs"
        >
        <span
          v-if="!searchTerm"
          class="flex items-center justify-center h-full mr-0.5 text-xs w-7"
        >
          {{ allItemsTodo?.length }}
        </span>
        <button
          v-else
          class="absolute top-0 right-0 flex items-center justify-center gap-2 px-2 text-xs h-7 bg-secondary hover:bg-secondary/90"
          @click="searchTerm = ''"
        >
          <span class="min-w-3">{{ allItemsUncheckedFiltered.length }}</span>
          <CircleX class="size-3" />
        </button>
      </div>
      <SelectRoot v-model="sortOption">
        <SelectTrigger
          class="flex items-center justify-between w-24 px-1 text-xs border min-w-24 h-7 border-secondary shrink-0 bg-background text-secondary-foreground"
          aria-label="Customise options"
        >
          <SelectValue placeholder="Seleccionar" />
          <ChevronDown class="h-3.5 w-3.5" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent
            class="min-w-[160px] bg-background will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100] font-mono border border-secondary"
            position="popper"
            :side-offset="5"
            align="end"
          >
            <SelectViewport class="">
              <SelectLabel class="p-2 text-xs font-medium text-primary">
                Ordenar
              </SelectLabel>
              <SelectGroup class="p-1">
                <SelectItem
                  class="text-xs leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-secondary/50 data-[highlighted]:text-foreground"
                  value="name"
                >
                  <SelectItemIndicator class="absolute right-0 w-[25px] inline-flex items-center justify-center">
                    <Check class="size-4" />
                  </SelectItemIndicator>
                  <SelectItemText> Nombre </SelectItemText>
                </SelectItem>
                <SelectItem
                  class="text-xs leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-secondary/50 data-[highlighted]:text-foreground"
                  value="date"
                >
                  <SelectItemIndicator class="absolute right-0 w-[25px] inline-flex items-center justify-center">
                    <Check class="size-4" />
                  </SelectItemIndicator>
                  <SelectItemText> Fecha </SelectItemText>
                </SelectItem>
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
    <div class="overflow-y-auto overflow-x-hidden h-[calc(100vh-11.5rem)]">
      <ScrollAreaRoot
        class="w-full h-[calc(100vh-11.5rem)] rounded overflow-hidden"
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full rounded">
          <div
            class="py-1 px-0.5 flex flex-col justify-start items-start relative gap-1"
            v-auto-animate
          >
            <ProjectListSearchItem
              v-for="item in allItemsUncheckedFiltered"
              :key="item.id"
              :data="item"
            />
            <ProjectListSearchItemDisabled
              v-for="item in allItemsChecked"
              :key="item.id"
              :data="item"
            />
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
