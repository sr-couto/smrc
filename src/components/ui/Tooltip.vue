<script setup>
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "radix-vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
    required: false,
  },
  shortcut: {
    type: String,
    default: "",
    required: false,
  },
  side: {
    type: String,
    default: "right",
    required: false,
  },
});
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delay-duration="0">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="props.side"
          class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-secondary-foreground select-none rounded-[4px] bg-secondary px-2 py-1 text-xs leading-none shadow will-change-[transform,opacity]"
          :side-offset="5"
        >
          {{ props.name }}
          <kbd
            v-show="props.shortcut"
            class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
          >
            {{ props.shortcut }}
          </kbd>
          <TooltipArrow
            class="fill-secondary"
            :width="8"
          />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
