<script setup>
import { shallowRef } from "vue";
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "radix-vue";
import { ArrowRightToLine } from "lucide-vue-next";
import Tooltip from "@/components/ui/Tooltip.vue";

const panelRef = shallowRef()
const layout = shallowRef(0)

</script>

<template>
  <SplitterGroup
    direction="horizontal"
    auto-save-id="splitter"
    @layout="layout = $event"
  >
    <div
      :style="`flex: ${layout[1]} 1 0px; overflow: hidden;`"
      class="hidden lg:flex"
    />
    <SplitterPanel :min-size="80">
      <slot />
    </SplitterPanel>
    <SplitterResizeHandle
      class="hidden lg:flex group justify-center items-center w-8 border-l-2 border-secondary/10 data-[state=hover]:border-primary/90  data-[state=drag]:border-primary/90 data-[state=hover]:delay-700 data-[state=hover]:border-l-4 duration-300"
    >
      <Tooltip
        :name="panelRef?.isCollapsed ? 'Contraer' : 'Expandir'"
        :side="panelRef?.isCollapsed ? 'left' : 'right'"
      >
        <button
          class="flex items-center z-20 justify-center !cursor-pointer bg-background size-6"
          @click="panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()"
          @keyup.enter="panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()"
          :class="panelRef?.isCollapsed ? 'rotate-180' : ''"
        >
          <ArrowRightToLine class="delay-75 !cursor-pointer size-4 opacity-90" />
        </button>
      </Tooltip>
    </SplitterResizeHandle>
    <SplitterPanel
      :max-size="20"
      :collapsed-size="0"
      ref="panelRef"
      collapsible
      @resize="resize = $event"
      class="hidden lg:flex"
    />
  </SplitterGroup>
</template>
