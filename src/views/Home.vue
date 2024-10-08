<script setup>
import { onMounted, watch } from "vue";
import { useCounterStore } from "@/stores/counter";
import { storeToRefs } from "pinia";

import Sidebar from "@/components/TheSidebar.vue";
import Document from "@/components/Document.vue";

const counter = useCounterStore();
const { project_name, project_body } = storeToRefs(counter);

onMounted(() => {
  counter.init_database();
  counter.auto_save();
});

watch(project_name, (v) => {
  if (v) counter.auto_save();
});

watch(project_body, (v) => {
  if (v) counter.auto_save();
});


</script>
<template>
  <div class="flex w-full h-screen overflow-y-hidden">
    <Sidebar />
    <Document />
  </div>
</template>


