<script setup  >
import { DialogRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps()

const forwarded = useForwardPropsEmits(props)
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
