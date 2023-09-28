<template>
  <div>
    <Test ref="testRef" />
    <button @click="handleClick">click</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Test } from "./test";

const testRef = ref<InstanceType<typeof Test>>();

const handleClick = () => {
  testRef.value?.validate("hello sssss");
};
</script>
<style scoped lang="scss"></style>
