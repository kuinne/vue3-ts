<template>
  <div>
    <h3>{{ counter }}</h3>
    <br />
    <button @click="add">add</button>
    <button @click="minus">minus</button>
  </div>
  <SubCounter />
  <UseSubCounter />
  <List />
</template>

<script setup lang="ts">
import { counter, add, minus, getList } from './store'
import SubCounter from './components/SubCounter.vue'
import List from './components/List.vue'
import useSubCounter from './hooks/use-sub-counter'
import { onMounted } from 'vue'

const { render: UseSubCounter } = useSubCounter()

onMounted(() => {
  getList()
})
</script>

<style></style>
