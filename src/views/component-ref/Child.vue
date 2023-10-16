<template>
  <div>
    child
    <ChildChild ref="childchildRef" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ChildChild from "./ChildChild.vue";

const childchildRef = ref<InstanceType<typeof ChildChild>>();

defineExpose({
  childchildRef,
});
</script>
<style scoped lang="scss"></style>
