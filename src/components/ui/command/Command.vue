<script setup>
import { ComboboxRoot } from 'radix-vue'
const props = defineProps()

</script>

<template>
  <ComboboxRoot class="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
    <slot />
  </ComboboxRoot>
</template>
