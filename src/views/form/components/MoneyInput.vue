<template>
  <div class="money-input">
    <!-- 前置插槽 -->
    <div class="money-input__prefix">
      <slot name="prefix">
        <span class="default-prefix">￥</span>
      </slot>
    </div>

    <!-- 输入框 -->
    <el-input
      v-model="inputValue"
      v-bind="$attrs"
      class="money-input__input"
      @input="handleInput"
      @blur="handleBlur"
    >
      <!-- 输入框前置内容 -->
      <template #prefix>
        <slot name="inputPrefix"></slot>
      </template>
      <!-- 输入框后置内容 -->
      <template #suffix>
        <slot name="inputSuffix"></slot>
      </template>
    </el-input>

    <!-- 后置插槽 -->
    <div class="money-input__suffix">
      <slot name="suffix">
        <span class="default-suffix">元</span>
      </slot>
    </div>

    <!-- 底部提示 -->
    <div v-if="$slots.tip" class="money-input__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | number
  precision?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

// 处理输入
const handleInput = (value: string) => {
  // 只允许输入数字和小数点
  const reg = /^\d*\.?\d*$/
  if (reg.test(value)) {
    emit('update:modelValue', value)
  }
}

// 处理失焦
const handleBlur = () => {
  const value = props.modelValue
  if (value === '') return
  
  // 格式化金额
  const num = Number(value)
  if (isNaN(num)) {
    emit('update:modelValue', '')
    return
  }
  
  const precision = props.precision ?? 2
  const formatted = num.toFixed(precision)
  emit('update:modelValue', formatted)
}

// 计算属性处理 v-model
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style lang="scss" scoped>
.money-input {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  &__prefix,
  &__suffix {
    color: #909399;
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
  }

  &__tip {
    position: absolute;
    bottom: -20px;
    left: 0;
    font-size: 12px;
    color: #909399;
  }

  .default-prefix,
  .default-suffix {
    color: #909399;
  }
}
</style> 