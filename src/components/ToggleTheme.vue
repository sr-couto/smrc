<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { DropdownMenuRoot, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'radix-vue'
import { SunMedium, Moon } from 'lucide-vue-next';
const mode = useColorMode()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button class="bg-secondary size-8 justify-center items-center flex">
        <Moon class="size-4 rotate-0 scale-100  transition-all dark:-rotate-90 duration-300 dark:scale-0" />
        <SunMedium
          class="absolute size-4 rotate-90 scale-0  transition-all dark:rotate-0 duration-300 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="bg-secondary w-32 grid text-xs z-10"
    >
      <DropdownMenuItem
        @click="mode = 'light'"
        class="hover:bg-secondary-foreground/10 p-2 cursor-pointer"
      >
        Claro
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="mode = 'dark'"
        class="hover:bg-secondary-foreground/10 p-2 cursor-pointer"
      >
        Oscuro
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="mode = 'auto'"
        class="hover:bg-secondary-foreground/10 p-2 cursor-pointer"
      >
        Sistema
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>