<script setup  >
import {  computed } from 'vue'
import { ComboboxItem, useForwardPropsEmits } from 'radix-vue'

const props = defineProps()
const emits = defineEmits()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxItem
    v-bind="forwarded"
    class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  >
    <slot />
  </ComboboxItem>
</template>
