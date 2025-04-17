<template>
  <form
    ref="formRef"
    class="form"
    :class="[
      `form--${layout}`,
      `form--label-align-${labelAlign}`,
      `form--label-position-${labelPosition}`,
      { 'form--inline': inline }
    ]"
  >
    <div
      v-if="layout === 'grid'"
      class="form__grid"
      :style="{
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gridAutoRows: 'minmax(min-content, max-content)'
      }"
    >
      <FormItem
        v-for="item in items"
        :key="item.name"
        :item="item"
        :model="model"
        :label-width="item.labelWidth || unifiedLabelWidth"
        :disabled="item.disabled || disabled"
        :label-align="item.labelAlign || labelAlign"
        :label-position="item.labelPosition || labelPosition"
        :style="{
          gridColumn: `span ${item.gridColSpan || gridColSpan || 1}`,
          gridRow: `span ${item.gridRowSpan || gridRowSpan || 1}`
        }"
        @update:model="handleUpdate"
      />
    </div>
    <template v-else>
      <FormItem
        v-for="item in items"
        :key="item.name"
        :item="item"
        :model="model"
        :label-width="item.labelWidth || unifiedLabelWidth"
        :disabled="item.disabled || disabled"
        :label-align="item.labelAlign || labelAlign"
        :label-position="item.labelPosition || labelPosition"
        @update:model="handleUpdate"
      />
    </template>
  </form>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { ref, provide, watch, onMounted, nextTick, computed } from 'vue'
import FormItem from './FormItem.vue'
import type { FormProps, FormInstance } from './types'

const props = withDefaults(defineProps<FormProps<T>>(), {
  layout: 'horizontal',
  labelAlign: 'right',
  labelPosition: 'inline',
  labelWidth: '100px',
  inline: false,
  disabled: false,
  gridCols: 3,
  gridColSpan: 1,
  gridRowSpan: 1
})

const emit = defineEmits<{
  (e: 'update:model', value: T): void
}>()

const formRef = ref<HTMLElement>()
const maxLabelWidth = ref(0)

// 计算最大标签宽度
const calculateMaxLabelWidth = async () => {
  if (props.layout === 'vertical' && props.labelWidth === 'auto') {
    await nextTick()
    const labels = formRef.value?.querySelectorAll('.form-item__label')
    if (labels) {
      let maxWidth = 0
      // 创建一个临时的 span 元素来计算文本宽度
      const tempSpan = document.createElement('span')
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.style.whiteSpace = 'nowrap'
      tempSpan.style.fontSize = '14px' // 使用与标签相同的字体大小
      document.body.appendChild(tempSpan)

      labels.forEach(label => {
        const text = label.textContent?.trim() || ''
        tempSpan.textContent = text
        const width = tempSpan.getBoundingClientRect().width
        maxWidth = Math.max(maxWidth, width)
      })

      document.body.removeChild(tempSpan)
      // 添加一些额外的padding，确保文本不会太靠近边缘
      maxLabelWidth.value = maxWidth + 16
    }
  }
}

// 监听布局和标签宽度的变化
watch(() => [props.layout, props.labelWidth], () => {
  calculateMaxLabelWidth()
})

// 监听表单项变化
watch(() => props.items, () => {
  calculateMaxLabelWidth()
}, { deep: true })

onMounted(() => {
  calculateMaxLabelWidth()
})

// 统一的标签宽度
const unifiedLabelWidth = computed(() => {
  if (props.layout !== 'vertical' || props.labelWidth !== 'auto') {
    return props.labelWidth
  }
  return `${maxLabelWidth.value}px`
})

const handleUpdate = (name: string, value: any) => {
  const newModel = { ...props.model, [name]: value }
  emit('update:model', newModel)
}

defineExpose({
  validate: async () => {
    // 实现表单验证逻辑
    return true
  },
  resetFields: () => {
    // 实现重置表单逻辑
  },
  clearValidate: () => {
    // 实现清除验证逻辑
  }
})
</script>

<style lang="scss" scoped>
.form {
  width: 100%;

  &--horizontal {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;

    :deep(.form-item) {
      display: flex;
      margin-bottom: 0;
    }
  }

  &--vertical {
    display: flex;
    flex-direction: column;
    gap: 20px;

    :deep(.form-item) {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      width: 100%;

      .form-item__content {
        width: 100%;
      }
    }
  }

  &--grid {
    display: grid;
    gap: 20px;
  }

  &--inline {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  &--label-align-left {
    :deep(.form-item__label) {
      text-align: left;
    }
  }

  &--label-align-right {
    :deep(.form-item__label) {
      text-align: right;
    }
  }

  &--label-position-inline {
    :deep(.form-item) {
      flex-direction: row;

    }
  }

  &--label-position-top {
    :deep(.form-item) {
      flex-direction: column;
      align-items: flex-start;
    }

    :deep(.form-item__label) {
      width: 100%;
    }
  }
}

.form__grid {
  display: grid;
  gap: 20px;
}
</style> 