<template>
  <div style="border: 1px solid">
    <h2>SubCounter</h2>
    <h3>{{ counter }}</h3>
    <br />
    <button @click="add">add</button>
    <button @click="minus">minus</button>
  </div>
</template>

<script setup lang="ts">
import { counter, add, minus } from '../store'
</script>

<style></style>
