<template>
  <input v-model="props.modelValue" />
  <ElInput v-model="value"></ElInput>
</template>

<script setup lang="ts">
import { ElDialog, ElInput, ElOption, ElSelect } from 'element-plus'
import { ref } from 'vue'
const props = defineProps<{
  modelValue?: string
}>()
const value = ref<string>('')
</script>

<style></style>
