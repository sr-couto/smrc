<script setup>
import { TentTree,  ArrowRightToLine, ArrowLeftToLine } from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
import { useMagicKeys, whenever } from "@vueuse/core";
import ToggleTheme from "@/components/ToggleTheme.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import DialogInfo from "@/components/DialogInfo.vue";

const counter = useCounterStore();

const keys = useMagicKeys();
const CtrlAltW = keys["ctrl+alt+w"];

whenever(CtrlAltW, () => {
  counter.showProjects = !counter.showProjects;
});

</script>

<template>
  <div
    class="flex items-center justify-between group mb-0.5"
    :class="counter.showProjects ? '' : ' flex-col '"
  >
    <button
      @click="counter.showProjects = !counter.showProjects"
      class="flex items-center justify-start gap-2 p-2"
    >
      <TentTree class="size-4" />
      <span
        class="text-xs"
        v-show="counter.showProjects"
      >Menu</span>
    </button>
    
    <div
      class="grid gap-1"
      :class="counter.showProjects ? ' grid-cols-3 ' : ' grid-cols-1 '"
    >
      <DialogInfo />
      <ToggleTheme />
      <Tooltip
        :name="counter.showProjects ? 'Cerrar panel' : ' Abrir panel'"
        shortcut="Ctrl Alt W"
        side="right"
      >
        <button
          v-show="counter.showProjects"
          @click="counter.showProjects = !counter.showProjects"
          class="flex items-center justify-center bg-secondary hover:bg-secondary/80 size-8"
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
      class="absolute inset-0 z-10 top-28"
    >
      <ArrowRightToLine class="mx-auto duration-100 opacity-25 size-4 -translate-y-14 group-hover:opacity-90" />
    </button>
  </div>
</template>