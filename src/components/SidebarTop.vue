<script setup>
import ToggleTheme from "@/components/ui/ToggleTheme.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import DialogInfo from "@/components/DialogInfo.vue";
import ToggleEditable from "./ui/ToggleEditable.vue";
import DriverJsInit from "./Tour.ts";

import { TentTree, ArrowRightToLine, ArrowLeftToLine } from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
import { useMagicKeys, whenever, breakpointsTailwind, useBreakpoints, } from "@vueuse/core";
import { onMounted } from "vue";

const counter = useCounterStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanLg = breakpoints.greater("lg");

onMounted(() => {
  if (largerThanLg.value) {
    DriverJsInit();
  }
});

const keys = useMagicKeys();
const CtrlM = keys["ctrl+m"];
const CtrlShiftE = keys["ctrl+shift+e"];

whenever(CtrlM, () => {
  counter.showProjects = !counter.showProjects;
});

whenever(CtrlShiftE, () => {
  counter.content_editable = !counter.content_editable;
});

</script>

<template>
  <div
    class="flex items-center justify-between my-0.5  group"
    :class="counter.showProjects ? ' mr-0.5 ' : ' flex-col '"
  >
    <button
      @click="counter.showProjects = !counter.showProjects"
      class="flex items-center justify-start gap-2 p-2"
    >
      <TentTree class="size-4" />
      <span
        class="text-xs"
        v-show="counter.showProjects"
      >Menú</span>
    </button>
    
    <div
      class="grid gap-0.5"
      :class="counter.showProjects ? ' grid-cols-4' : ' grid-cols-1 '"
    >
      <DialogInfo />
      <ToggleTheme />
      <ToggleEditable />
      <Tooltip
        :name="counter.showProjects ? 'Cerrar panel' : ' Abrir panel'"
        shortcut="Ctrl M"
        side="right"
      >
        <button
          v-show="counter.showProjects"
          @click="counter.showProjects = !counter.showProjects"
          class="flex items-center justify-center border border-secondary bg-background hover:bg-secondary/80 size-8"
        >
          <ArrowLeftToLine
            class="size-4"
          />
        </button>
      </Tooltip>
    </div>
    <button
      @click="counter.showProjects = !counter.showProjects"
      v-show="!counter.showProjects"
      class="absolute inset-0 z-10 top-36"
    >
      <ArrowRightToLine class="mx-auto duration-100 opacity-25 size-4 -translate-y-14 group-hover:opacity-90" />
    </button>
  </div>
</template>