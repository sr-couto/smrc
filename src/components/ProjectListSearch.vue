<script setup>
import { useCounterStore } from "@/stores/counter";
import { ArrowRight, Check, CircleX, Pencil, Plus } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import {
  useFocus,
  useMagicKeys,
  refDebounced,
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "radix-vue";
import Tooltip from "./ui/Tooltip.vue";

const focusSearch = ref();
const editing = ref(false);
const { focused } = useFocus(focusSearch);
const counter = useCounterStore();
const { allItems, loaded_id, searchTerm, file_name } = storeToRefs(counter);

const keys = useMagicKeys();
const CtrlShiftX = keys["ctrl+shift+x"];

const debounced = refDebounced(searchTerm, 300);
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanLg = breakpoints.greater("lg");

function editTitle() {
  editing.value = !editing.value;
}

const input = ref(file_name);

watch(input, (v) => {
  if (v) counter.update_database(input.value);
  counter.auto_save();
});

function new_document() {
  if (largerThanLg.value === true) {
    counter.clear_editor();
  } else {
    counter.clear_editor();
    counter.showProjects = false;
  }
}

function set_document(id) {
  if (largerThanLg.value === true) {
    counter.set_project(id)
  } else {
    counter.set_project(id)
    counter.showProjects = false;
  }
}

const filteredOptions = computed(() =>
  debounced.value === ""
    ? allItems.value
    : allItems.value.filter((item) => {
        return item.project_data?.name
          .toLowerCase()
          .includes(debounced.value.toLowerCase());
      }),
);

function handleOpenChange() {
  focused.value = true;
}

watch(CtrlShiftX, (v) => {
  if (v) handleOpenChange();
});
</script>
<template>
  <div class="h-full @container">
    <div
      class="flex items-center justify-center text-sm border-l bg-secondary/80 hover:bg-secondary/50 mb-0.5 border-secondary"
    >
      <button
        v-if="!editing"
        @click="editTitle()"
        class="flex items-center justify-between w-full h-8 gap-1 pl-1"
      >
        <span v-if="!file_name"> Sin titulo </span>
        <span v-else>
          {{ file_name }}
        </span>
        <Tooltip
          name="Editar título"
          side="right"
        >
          <span
            class="flex items-center justify-center duration-300 border size-8 shrink-0 bg-secondary hover:border-primary border-secondary"
          >
            <Pencil class="size-4 text-primary" />
          </span>
        </Tooltip>
      </button>
      <div
        v-if="editing"
        class="flex items-center justify-between w-full h-8"
      >
        <input
          type="text"
          @keyup.enter="editTitle()"
          class="w-full h-8 pl-1 text-sm outline-none bg-primary text-primary-foreground border-secondary"
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
    <div
      class="relative flex items-center justify-between w-full p-1 text-xs bg-secondary ring-secondary/60 focus-within:ring-secondary"
    >
      <input
        ref="focusSearch"
        v-model="searchTerm"
        placeholder="Filtrar [Ctrl+Shift+X]"
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
    <div class="overflow-y-auto overflow-x-hidden h-[calc(100vh-9rem)]">
      <ScrollAreaRoot
        class="w-full h-[calc(100vh-9rem)] rounded overflow-hidden"
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full rounded">
          <div class="py-1 px-0.5">
            <button
              @click="new_document()"
              class="flex items-center mb-0.5 justify-start gap-2 text-sm w-full text-left  duration-100 focus-within:ring-1 ring-primary"
              :class="
                counter.loaded_id !== null
                  ? 'text-foreground  '
                  : 'text-primary/70 pointer-events-none'
              "
            >
              <Plus class="size-4" />
              <span>Crear</span>
            </button>
            <div
              v-for="item in filteredOptions"
              :key="item.id"
              class="flex flex-row items-center justify-between w-full"
            >
              <button
                class="flex py-0.5 w-full items-center outline-none justify-start gap-2 text-sm text-left duration-100 focus-within:ring-1 ring-primary"
                :class="loaded_id === item.id ? 'text-primary' : ''"
                @click="set_document(item.id)"
              >
                <ArrowRight class="size-4 shrink-0 " />
                <p class="@sm:max-w-full max-w-80 line-clamp-1">
                  {{ item.project_data.name }}
                </p>
              </button>
            </div>
            <div
              class="flex items-center justify-center w-full py-5 mt-2 bg-secondary/20"
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
