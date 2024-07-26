<script setup>
import { useMagicKeys } from '@vueuse/core'
import {
  CommandDialog,
  CommandGroup,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useColorMode } from '@vueuse/core'

const open = ref(false)
const router = useRouter();
const keys = useMagicKeys()
const CtrlM = keys['Ctrl+M']

function handleOpenChange() {
  open.value = !open.value
}

function selectRoute(i) {
  router.push(i);
  open.value = false
}

const mode = useColorMode()

watch(CtrlM, (v) => {
  if (v)
    handleOpenChange()
})
</script>

<template>
  <button
    @click="handleOpenChange"
    class="text-xs text-muted-foreground"
  >
    Menú
    <kbd
      class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
    >
      <span class="">Ctrl</span>M
    </kbd>
  </button>
  <CommandDialog
    :open="open"
    @update:open="handleOpenChange"
  >
    <CommandInput placeholder="Buscar páginas..." />
    <CommandList heading="Suggestions">
      <CommandEmpty>Sin resultados.</CommandEmpty>
      <CommandGroup heading="Páginas">
        <CommandItem
          value="inicio"
          @select="selectRoute('/inicio')"
        >
          Inicio
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>