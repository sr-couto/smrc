<script setup>
import { computed } from 'vue'
import { ComboboxContent, useForwardPropsEmits } from 'radix-vue'

const props = withDefaults(defineProps(), {
  dismissable: false,
})

const emits = defineEmits()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps)
</script>

<template>
  <ComboboxContent
    v-bind="forwarded"
    class="max-h-[300px] overflow-y-auto overflow-x-hidden"
  >
    <div role="presentation">
      <slot />
    </div>
  </ComboboxContent>
</template>
