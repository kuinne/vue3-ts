<template>
  <div class="page">
    <Sidebar />
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Sidebar from "./Layout/Sidebar/index.vue";
</script>

<style lang="scss">
.page {
  height: 100vh;
  display: flex;
  overflow: hidden;

  .main {
    flex: 1;
  }
}
</style>
