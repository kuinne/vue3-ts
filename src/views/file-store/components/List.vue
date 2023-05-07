<template>
  <ul v-for="item in list">
    <li>{{ item.id }}</li>
  </ul>
</template>

<script setup lang="ts">
import { list } from '../store'
</script>

<style></style>
