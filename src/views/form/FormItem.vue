<template>
  <div
    class="form-item"
    :class="[
      { 'form-item--required': item.required },
      { 'form-item--disabled': disabled }
    ]"
  >
    <div
      class="form-item__label"
      :class="{ 'form-item__label--ellipsis': item.labelEllipsis }"
      :style="{
        width: labelWidth === 'auto' ? 'auto' : labelWidth,
        flex: labelWidth === 'auto' ? '0 0 auto' : '0 0 ' + labelWidth
      }"
    >
      <el-tooltip
        v-if="item.labelEllipsis"
        :content="item.label"
        placement="top"
        :disabled="!isLabelOverflow"
        effect="dark"
      >
        <span
          ref="labelRef"
          class="label-text"
          :class="{ 'label-text--ellipsis': item.labelEllipsis }"
        >
          {{ item.label }}
        </span>
      </el-tooltip>
      <span v-else class="label-text">{{ item.label }}</span>
    </div>
    <div class="form-item__content">
      <component
        :is="getComponent(item.type)"
        v-model="modelValue"
        :placeholder="item.placeholder"
        :options="item.options"
        :disabled="disabled"
        @update:modelValue="handleUpdate"
      />
      <div v-if="error" class="form-item__error">{{ error }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import type { FormItem } from './types.ts'
import type { Component } from 'vue'
import type { ElTooltip } from 'element-plus'


const props = defineProps<{
  item: FormItem
  model: Record<string, any>
  labelWidth?: string | number
  disabled?: boolean
  labelAlign?: 'left' | 'right'
  labelPosition?: 'inline' | 'top'
}>()

const emit = defineEmits<{
  (e: 'update:model', name: string, value: any): void
}>()

const labelRef = ref<HTMLElement>()
const isLabelOverflow = ref(false)

// 检查标签是否溢出
const checkLabelOverflow = async () => {
  await nextTick()
  if (labelRef.value) {
    const label = labelRef.value
    isLabelOverflow.value = label.scrollWidth > label.clientWidth
  }
}

onMounted(() => {
  checkLabelOverflow()
})

// 监听标签宽度变化
watch(() => props.labelWidth, () => {
  checkLabelOverflow()
})

// 监听标签内容变化
watch(() => props.item.label, () => {
  checkLabelOverflow()
})

const modelValue = computed({
  get: () => props.model[props.item.name],
  set: (value) => emit('update:model', props.item.name, value)
})

const error = ref('')

const components: Record<string, string> = {
  input: 'el-input',
  textarea: 'el-input',
  select: 'el-select',
  date: 'el-date-picker',
  time: 'el-time-picker',
  switch: 'el-switch',
  checkbox: 'el-checkbox',
  radio: 'el-radio',
  slider: 'el-slider',
  rate: 'el-rate',
  color: 'el-color-picker',
  upload: 'el-upload',
  cascader: 'el-cascader',
  tree: 'el-tree',
  transfer: 'el-transfer',
  autocomplete: 'el-autocomplete',
  'input-number': 'el-input-number'
}

const getComponent = (type: string) => {
  return components[type] || 'el-input'
}

const handleUpdate = (value: any) => {
  emit('update:model', props.item.name, value)
}
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  flex-wrap: wrap;

  &--required {
    .label-text::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  &__label {
    padding-right: 12px;
    line-height: 32px;
    flex-shrink: 0;
    min-width: 0;

    &--ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__content {
    position: relative;
    min-width: 0;
    flex: 1;
    display: flex;
    flex-wrap: wrap;

    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-date-picker),
    :deep(.el-time-picker),
    :deep(.el-switch),
    :deep(.el-checkbox),
    :deep(.el-radio),
    :deep(.el-slider),
    :deep(.el-rate),
    :deep(.el-color-picker),
    :deep(.el-upload),
    :deep(.el-cascader),
    :deep(.el-tree),
    :deep(.el-transfer),
    :deep(.el-autocomplete),
    :deep(.el-input-number) {
      width: 100%;
    }
  }

  &__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}

.label-text {
  display: inline-block;
  width: 100%;

  &--ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 垂直布局
:deep(.form--label-position-top) {
  .form-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .form-item__label {
      width: 100%;
      padding-right: 0;
    }
  }
}
</style> 