<template>
  <div class="w-2/3 pt-6 m-auto">
    <Nav />
    <main class="py-6">
      <MyProfile />
    </main>
  </div>
</template>

<script setup lang="ts">
import Nav from './components/Nav.vue'
import MyProfile from './components/MyProfile.vue'
import { onMounted } from 'vue'
import { initStore } from './store'

initStore()
</script>

<style></style>
