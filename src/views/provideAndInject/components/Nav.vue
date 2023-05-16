<template>
  <nav class="flex">
    <div class="flex-grow">
      <a class="px-4 hover:underline" href="#">Home</a>
      <a class="px-4 hover:underline" href="#">About</a>
      <a class="px-4 hover:underline" href="#">My Account</a>
    </div>
    <div class="flex-shrink">Hello, {{ getUsername }}!</div>
  </nav>
</template>
<script setup lang="ts">
import { useStore } from '../store'

const { getUsername, updateUsername } = useStore()
</script>
