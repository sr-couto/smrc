<script setup>
import {
  ArrowRight,
  Circle,
  Pin,
  PinOff,
} from "lucide-vue-next";
import { useCounterStore } from "@/stores/counter";
import { storeToRefs } from "pinia";
import Tooltip from "./ui/Tooltip.vue";
import {
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";
import { computed } from "vue";
const counter = useCounterStore();
const { loaded_id } =   storeToRefs(counter);
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanLg = breakpoints.greater("lg");
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

function hasUnsavedChanges() {
  if (counter.project_body === "<p></p>") {
    return false;
  }
  return (
    loaded_id.value === "" && // Si no hay documento cargado
    counter.project_body !== "" // Si el nombre del proyecto está marcado como dirty
  );
}

function set_document(id) {
  if (hasUnsavedChanges()) {
    if (!confirm("El documento actual tienes cambios sin guardar. ¿Quieres continuar y descartar los cambios?")) {
      return; // Cancela la acción si el usuario no confirma
    }
  }
  if (largerThanLg.value === true) {
    counter.set_project(id);
  } else {
    counter.set_project(id);
    counter.showProjects = false;
  }
}

function toggleCheck(item, isChecked) {
  counter.change_project_checked(item, isChecked);
}

function toggleFixed(item, isFixed) {
  counter.change_project_fixed(item, isFixed);
}

const truncatedString = computed((str) => {
  if (str.length > 60) {
    return str.substring(0, 57) + '...';
  }
  return str;
});

</script>
<template>
  <div class="relative flex items-center justify-between w-full pr-3 h-7 md:pr-2 group">
    <Tooltip :name="props.data.project_data?.fixed ? 'Desfijar' : 'Fijar'">
      <div class="flex items-center">
        <ArrowRight
          class="mx-1 size-4 shrink-0 group-hover:hidden"
          :class="props.data.project_data?.fixed ? '!hidden' : ''"
        />
        <button
          @click="toggleFixed(props.data, props.data.project_data?.fixed)"
          class="hidden py-1 mx-1 duration-300 outline-none group-hover:inline-flex md:py-0 hover:text-primary"
          :class="props.data.project_data?.fixed ? '!inline-flex' : ''"
        >
          <template v-if="props.data.project_data?.fixed">
            <PinOff class="size-4 text-primary" />
          </template>
          <template v-else>
            <Pin class="size-4 " />
          </template>
        </button>
      </div>
    </Tooltip>
    <button
      class="flex px-2 py-0.5 rounded w-full items-center outline-none justify-start gap-2 text-sm text-left focus-within:ring-1 ring-primary"
      :class="loaded_id === props.data.id ? 'text-primary' : ''"
      @click="set_document(props.data.id)"
    >
      <p class="@sm:max-w-full max-w-80 ">
        <!-- {{ truncatedString(props.data.project_data?.name) }} -->
        {{ props.data.project_data?.name.length > 25 ? props.data.project_data?.name.substring(0, 25) + '&hellip;' : props.data.project_data?.name }}
      </p>
    </button>
    <input
      type="checkbox"
      :id="'todo-' + props.data.id"
      :checked="props.data.project_data?.checked"
      class="w-0 opacity-0 peer"
      required=""
      @change="toggleCheck(props.data, $event.target.checked)"
    >
    <Tooltip name="Marcar como completo">
      <label
        :for="'todo-' + props.data.id"
        class="flex items-center justify-center rounded-full relative z-[50] mr-0.5 peer-focus:ring-1 peer-focus:ring-primary size-7 md:size-6 shrink-0 peer-checked:border-blue-600 hover:text-primary peer-checked:text-primary hover:bg-secondary/20"
      >
        <Circle class="size-5 md:size-4" />
      </label>
    </Tooltip>
  </div>
</template>
