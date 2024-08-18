<script setup>
import { onMounted } from "vue";
import { useCounterStore } from "@/stores/counter";
import Sidebar from "@/components/Sidebar.vue";
import SplitterGroupEditor from "@/components/HomeSplitterGroupEditor.vue";

const counter = useCounterStore();

onMounted(() => {
  counter.init_database();
  counter.auto_save();
});

</script>
<template>
  <div class="flex w-full h-screen overflow-y-hidden">
    <Sidebar />
    <SplitterGroupEditor />
  </div>
</template>


