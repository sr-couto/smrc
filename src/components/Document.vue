<script setup>
import DialogProjects from "./DialogProjects.vue";
import DocumentEditor from "./DocumentEditor.vue";
import DeleteDocument from "./ui/ButtonDeleteDocument.vue";
import SplitterGroup from "./ui/SplitterGroup.vue";
</script>

<template>
  <div class="w-full min-h-screen pl-8 lg:pl-0 bg-background ">
    <SplitterGroup>
      <DocumentEditor />
    </SplitterGroup>
    <DeleteDocument />
    <DialogProjects />
  </div>
</template>
