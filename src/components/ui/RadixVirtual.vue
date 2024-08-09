<script setup>
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from "radix-vue";

import {
  ListboxContent,
  ListboxFilter,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  ListboxVirtualizer,
} from "radix-vue";
import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'radix-vue'


import { ref, computed } from "vue";
import { Check, ChevronDown, CirclePlus, Delete, RotateCcw, X } from 'lucide-vue-next'

const hoverState = ref(false)

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  items: {
    type: Object,
    default() {
      return {}
    }
  },
  optionLabel: {
    type: String,
    required: false,
    default: ""
  },
  optionValue: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  debug: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits(['update:modelValue']);

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

// const selectedPeople = ref();
const searchTerm = ref("");

const filteredOptions = computed(() =>
  searchTerm.value === ""
    ? props.items
    : props.items.filter((person) => {
      return person.toLowerCase().includes(searchTerm.value.toLowerCase());
    })
);

</script>
<template>
  <fieldset
    v-if="!props.loading"
    class="w-full flex flex-col relative font-mono"
  >
    <PopoverRoot>
      <div class="btn">
        <PopoverTrigger
          class="flex items-center relative justify-start w-full gap-2"
          aria-label="Update dimensions"
        >
          <div
            v-if="selected"
            class="flex text-xs  w-full justify-between items-center gap-2"
          >
            <span class="shrink-0">{{ selected }}</span>
            <ChevronDown class="size-4 shrink-0" />
          </div>
          <div
            v-else
            class="flex text-xs w-full justify-between items-center gap-2"
          >
            <span>Seleccionar</span>
            <ChevronDown class="size-4 shrink-0" />
          </div>
        </PopoverTrigger>
      </div>
      <PopoverPortal>
        <PopoverContent
          side="bottom"
          :side-offset="12"
          align="end"
          :align-offset="-8"
          class=" w-64 lg:max-w-7xl  bg-background shadow-md focus:shadow-lg will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade border border-secondary"
        >
          <div class="flex flex-col gap-2.5">
            <ListboxRoot
              v-model="selected"
              class="flex flex-col w-full gap-1  mx-auto text-foreground "
            >
              <div class="w-64">
                <svg
                  class="absolute top-2 left-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#888888"
                    class="fill-foreground"
                    d="M9.538 15.23q-2.398 0-4.064-1.666T3.808 9.5t1.666-4.064t4.064-1.667t4.065 1.667T15.269 9.5q0 1.042-.369 2.017t-.97 1.668l5.908 5.907q.14.14.15.345t-.15.363t-.353.16t-.354-.16l-5.908-5.908q-.75.639-1.725.989t-1.96.35m0-1q1.99 0 3.361-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
                  />
                </svg>
                <ListboxFilter
                  v-model="searchTerm"
                  placeholder="Buscar..."
                  class="w-full selection:bg-primary p-1 font-mono text-xs h-8 pl-10 text-foreground bg-background border border-secondary  outline-none placeholder:text-foreground/20"
                />
              </div>
              <ListboxContent class="w-full overflow-auto overflow-x-hidden bg-background h-[202px]">
                <ListboxVirtualizer
                  v-slot="{ option }"
                  :options="filteredOptions"
                  :estimate-size="30"
                >
                  <ListboxItem
                    :value="option"
                    class=" w-64 flex items-center  px-3 h-8 leading-none relative text-foreground select-none outline-none data-[highlighted]:ring-primary data-[highlighted]:ring-1 focus:ring-primary focus:ring-1 data-[state=checked]:text-primary data-[disabled]:opacity-50 data-[highlighted]:bg-secondary"
                  >
                    <ListboxItemIndicator class="absolute right-2 inline-flex items-center justify-center">
                      <Check class="size-5" />
                    </ListboxItemIndicator>
                    <p class="leading-5 text-pretty text-xs font-mono">
                      {{ option }}
                    </p>
                  </ListboxItem>
                </ListboxVirtualizer>
              </ListboxContent>
            </ListboxRoot>
          </div>
          <Transition mode="out-in">
            <button
              aria-label="Reset search"
              @click="searchTerm = ''"
              v-if="searchTerm.length !== 0"
              class="absolute focus:bg-blue-300 inline-flex items-center cursor-pointer justify-center text-foreground  outline-none size-7 top-[2px] right-8 hover:bg-background bg-background"
            >
              <RotateCcw class="size-4" />
            </button>
          </Transition>
          <PopoverClose
            class="absolute focus:bg-blue-300 inline-flex items-center justify-center cursor-pointer text-foreground  outline-none size-7 top-[2px] right-0 hover:bg-background bg-background"
            aria-label="Close"
          >
            <X class="size-4" />
          </PopoverClose>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </fieldset>
  <div
    v-else
    class="grid gap-2"
  >
    <div class="w-20 h-4 bg-gray-100" />
    <div class="w-32 h-10 bg-gray-100" />
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


.btn {
  @apply flex items-center w-full justify-start gap-1 px-2 h-7  text-xs bg-background font-normal text-foreground transition-colors border border-secondary ring-secondary ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
}
</style>
