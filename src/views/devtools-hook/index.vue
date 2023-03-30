<template>
  <div>
    <el-input v-model="msg"></el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const msg = ref("hello");
watch(
  () => msg.value,
  () => {
    console.log("msg");
  }
);
</script>

<style></style>
