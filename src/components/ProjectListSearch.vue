<script setup>
import { useCounterStore } from "@/stores/counter";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  CircleCheckBig,
  CircleX,
  FolderPen,
  Plus,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import {
  onClickOutside,
  useFocus,
  useMagicKeys,
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
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";

import Tooltip from "./ui/Tooltip.vue";

const target = ref(null);
const focusSearch = ref();
const editing = ref(false);
const { focused } = useFocus(focusSearch);
const counter = useCounterStore();
const { allItemsTodo, allItemsChecked, loaded_id, searchTerm, file_name } =
  storeToRefs(counter);

const keys = useMagicKeys();
const CtrlShiftX = keys["ctrl+shift+x"];

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
    counter.set_project(id);
  } else {
    counter.set_project(id);
    counter.showProjects = false;
  }
}

function toggleCheck(item, isChecked) {
  counter.mark_project_checked(item, isChecked);
}

const filteredOptions = computed(() => {
  if (!Array.isArray(allItemsTodo.value)) {
    return [];
  }

  const sortedItems = [...allItemsTodo.value].sort((a, b) => {
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
          name="Editar nombre de la base de datos"
          side="bottom"
          align="end"
        >
          <span
            class="flex items-center justify-center duration-100 border border-transparent group-hover:border size-8 shrink-0 bg-background group-hover:border-primary"
          >
            <FolderPen class="size-4 text-foreground" />
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
    <div
      class="relative flex items-center justify-between w-full gap-0.5 p-0.5 text-xs bg-background ring-secondary/60 focus-within:ring-secondary"
    >
      <div
        class="flex items-center justify-between w-full pl-1 border h-7 border-secondary"
      >
        <Tooltip
          shortcut="Ctrl+Shift+X"
          side="top"
        >
          <input
            ref="focusSearch"
            v-model="searchTerm"
            placeholder="Filtrar"
            class="px-1 outline-none bg-background placeholder:text-xs"
          >
        </Tooltip>
        <span
          v-if="!searchTerm"
          class="flex items-center justify-center h-full mr-0.5 text-xs w-7"
        >
          {{ allItemsTodo?.length }}
        </span>
        <button
          v-else
          class="flex items-center justify-center gap-2 px-2 text-xs h-7 bg-secondary hover:bg-secondary/90"
          @click="searchTerm = ''"
        >
          <span class="min-w-3">{{ filteredOptions.length }}</span>
          <CircleX class="size-3" />
        </button>
      </div>
      <SelectRoot v-model="sortOption">
        <SelectTrigger
          class="flex items-center justify-between w-24 px-1 text-xs border h-7 border-secondary shrink-0 bg-background text-secondary-foreground"
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
                  class="text-sm leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-secondary/50 data-[highlighted]:text-primary-foreground"
                  value="name"
                >
                  <SelectItemIndicator
                    class="absolute right-0 w-[25px] inline-flex items-center justify-center"
                  >
                    <Check class="size-4" />
                  </SelectItemIndicator>
                  <SelectItemText> Nombre </SelectItemText>
                </SelectItem>
                <SelectItem
                  class="text-sm leading-none text-foreground flex items-center h-8 px-1 py-2 pr-12 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-secondary/50 data-[highlighted]:text-primary-foreground"
                  value="date"
                >
                  <SelectItemIndicator
                    class="absolute right-0 w-[25px] inline-flex items-center justify-center"
                  >
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
    <div class="overflow-y-auto overflow-x-hidden h-[calc(100vh-9rem)]">
      <ScrollAreaRoot
        class="w-full h-[calc(100vh-9rem)] rounded overflow-hidden"
        style="--scrollbar-size: 10px"
      >
        <ScrollAreaViewport class="w-full h-full rounded">
          <div
            class="py-1 px-0.5 flex flex-col justify-start items-start relative gap-1"
          >
            <button
              @click="new_document()"
              class="flex items-center mb-0.5 justify-center gap-2 text-xs h-7 w-full text-left bg-secondary duration-100 focus-within:ring-1 ring-primary"
              :class="{
                '!bg-primary': loaded_id === null,
                '!bg-primary': loaded_id === '',
              }"
            >
              <Plus class="size-4" />
              <span v-show="loaded_id === ''">Creando</span>
              <span v-show="loaded_id !== ''">Crear</span>
            </button>
            <div
              v-for="item in filteredOptions"
              :key="item.id"
              class="flex flex-row items-center justify-between w-full"
            >
              <button
                class="flex py-0.5 rounded w-full items-center outline-none justify-start gap-2 text-sm text-left focus-within:ring-1 ring-primary"
                :class="loaded_id === item.id ? 'text-primary' : ''"
                @click="set_document(item.id)"
              >
                <ArrowRight class="size-4 shrink-0" />
                <p class="@sm:max-w-full max-w-80 line-clamp-1">
                  {{ item.project_data.name }}
                </p>
              </button>
              <input
                type="checkbox"
                :id="'todo-' + item.id"
                :checked="item.project_data.checked"
                class="w-0 opacity-0 peer"
                required=""
                @change="toggleCheck(item, $event.target.checked)"
              >
              <Tooltip name="Marcar como completo">
                <label
                  :for="'todo-' + item.id"
                  class="flex items-center justify-center rounded-full relative z-[50] mr-0.5 peer-focus:ring-1 peer-focus:ring-primary size-6 shrink-0 peer-checked:border-blue-600 hover:text-primary peer-checked:text-primary hover:bg-secondary/20"
                >
                  <Circle class="size-4" />
                </label>
              </Tooltip>
            </div>
            <div
              v-for="item in allItemsChecked"
              :key="item.id"
              class="flex flex-row items-center justify-between w-full duration-300 opacity-70"
              :class="item.project_data.checked ? '' : 'scale-0'"
            >
              <span
                class="flex py-0.5 rounded-full w-full items-center outline-none justify-start gap-2 text-sm text-left focus-within:ring-1 ring-primary"
                :class="loaded_id === item.id ? 'text-primary' : ''"
              >
                <p
                  class="@sm:max-w-full max-w-80 line-clamp-1 line-through decoration-wavy decoration-primary/50 text-foreground/50 decoration-1"
                >
                  {{ item.project_data.name }}
                </p>
              </span>
              <Tooltip name="Desmarcar">
                <input
                  type="checkbox"
                  :id="'todook-' + item.id"
                  :checked="item.project_data.checked"
                  class="w-0 opacity-0 peer"
                  required=""
                  @change="toggleCheck(item, $event.target.checked)"
                >
                <label
                  :for="'todook-' + item.id"
                  class="flex items-center justify-center rounded-full relative z-[50] mr-0.5 peer-focus:ring-1 peer-focus:ring-primary size-6 shrink-0 peer-checked:border-blue-600 hover:text-primary peer-checked:text-primary hover:bg-secondary"
                >
                  <CircleCheckBig class="size-4" />
                </label>
              </Tooltip>
            </div>
            <!-- <div
              class="flex items-center justify-center w-full py-5 mt-2 bg-secondary/20"
              v-if="filteredOptions?.length === 0"
            >
              <span class="text-xs text-secondary-foreground/30">Sin resultados</span>
            </div> -->
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
