<template>
  <div class="flex-container">
    <div class="flex-item">1</div>
    <div class="flex-item">2</div>
    <div class="flex-item first">3</div>
    <div class="flex-item">4</div>
    <div class="flex-item">5</div>
    <div class="flex-item">6</div>
    <div class="flex-item last">7</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
</script>
<style scoped lang="scss">
.flex-container {
  display: flex;
  flex-wrap: wrap;

  gap: 20px;
}
.flex-item {
  width: 150px;
  height: 30px;
  border: 1px solid;
  box-sizing: border-box;
}
.last {
  margin-left: auto;
}

.first {
  order: -1;
}
</style>
