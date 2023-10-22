<template>
  <ElInput v-model="inputValue"></ElInput>
  <span v-if="error" style="color: red">{{ error }}</span>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue'
import { ElInput, ElOption, ElSelect } from 'element-plus'
import { watch } from 'vue'
const props = withDefaults(
  defineProps<{
    modelValue?: string
    error?: string
  }>(),
  {
    modelValue: '',
    error: '',
  }
)
const emits = defineEmits<{
  ($event: 'update:modelValue', value: any): void
  ($event: 'update:error', value: any): void
}>()

const inputValue = ref('')

const error = ref('')

watch(
  () => props.modelValue,
  () => {
    inputValue.value = props.modelValue
  }
)

watch(inputValue, () => {
  error.value = ''
  emits('update:modelValue', inputValue.value)
})

watch(
  () => props.error,
  () => {
    error.value = props.error
  }
)

watch(error, () => {
  emits('update:error', error.value)
})

const validate = () => {
  if (!props.modelValue) {
    error.value = '必填' + Math.random().toString().slice(-8)
  }
}

defineExpose({
  validate,
})
</script>

<style></style>
