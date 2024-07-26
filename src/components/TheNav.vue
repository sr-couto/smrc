<script setup>
import { TentTree, X } from 'lucide-vue-next';

import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'radix-vue'

// import AppNavigationCommandBar from '@/components/AppNavigationCommandBar.vue';
import { RouterLink } from 'vue-router';
import ToggleTheme from './ToggleTheme.vue';
import NavProjectList from './NavProjectList.vue';
</script>

<template>
  <header class="min-w-64 flex justify-start flex-col bg-background border-r">
    <div class="flex items-center justify-between pr-1 h-10">
      <RouterLink
        to="/"
        class="flex gap-2 p-2 items-center justify-start"
      >
        <TentTree class="size-4" />
      </RouterLink>
      <ToggleTheme />
    </div>
    <NavProjectList />
    <div class="bg-background p-2 text-xs ">
      <!-- <AppNavigationCommandBar /> -->
      <PopoverRoot>
        <PopoverTrigger class="py-2">
          Más
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent class=" p-2 bg-background ring-1 ring-secondary w-64 flex flex-col">
            <RouterLink
              to="/"
              class="p-1 border-b border-secondary"
            >
              Home
            </RouterLink>
            <PopoverClose class="fixed top-0 right-0 p-1 opacity-50">
              <X class="size-4" />
            </PopoverClose>
            <PopoverArrow class="fill-secondary" />
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </div>
  </header>
</template>
