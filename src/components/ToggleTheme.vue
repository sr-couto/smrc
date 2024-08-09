<script setup lang="ts">
import { useColorMode, useStorage } from "@vueuse/core";
const counter = useCounterStore();
import { useCounterStore } from "@/stores/counter";
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "radix-vue";
import { SunMedium, Moon } from "lucide-vue-next";
import Tooltip from "./ui/Tooltip.vue";
import { onMounted } from "vue";
const mode = useColorMode();

const colorTheme = useStorage('theme', "theme-rose");

const toggleColorTheme = (theme) => {
  document.body.classList.remove(colorTheme.value)
  document.body.classList.add(theme)
  colorTheme.value = theme;
};

onMounted(() => {
  toggleColorTheme(colorTheme.value);
});

</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <Tooltip name="Modo de color">
        <button class="bg-secondary size-8 justify-center items-center flex">
          <Moon class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 duration-300 dark:scale-0" />
          <SunMedium
            class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 duration-300 dark:scale-100"
          />
          <span class="sr-only">Modo de color</span>
        </button>
      </Tooltip>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="bg-secondary w-32 grid text-xs z-10"
    >
      <DropdownMenuGroup>
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
      </DropdownMenuGroup>
      <DropdownMenuGroup class="bg-secondary p-3 w-full flex justify-between">
        <DropdownMenuItem
          @click="toggleColorTheme('theme-rose')"
          class="size-4 bg-rose-600 rounded-full cursor-pointer"
        />
        <DropdownMenuItem
          @click="toggleColorTheme('theme-blue')"
          class="size-4 bg-blue-600 rounded-full cursor-pointer"
        />
        <DropdownMenuItem
          @click="toggleColorTheme('theme-green')"
          class="size-4 bg-green-600 rounded-full cursor-pointer"
        />
        <DropdownMenuItem
          @click="toggleColorTheme('theme-yellow')"
          class="size-4 bg-yellow-600 rounded-full cursor-pointer"
        />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
