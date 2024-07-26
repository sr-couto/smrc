<script setup>
import { computed } from 'vue'
import { DialogTitle, useForwardProps } from 'radix-vue'

const props = defineProps()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTitle
    v-bind="forwardedProps"
    text-lg
    font-semibold
    leading-none
    tracking-tight "
  >
    <slot />
  </DialogTitle>
</template>
