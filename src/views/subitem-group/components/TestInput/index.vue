<template>
  <div>ss</div>
</template>
<script setup lang="tsx">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emits = defineEmits<{
  ($event: 'update:modelValue', val: string): void
}>()
</script>
