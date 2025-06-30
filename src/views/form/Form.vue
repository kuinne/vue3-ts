<template>
  <div
    ref="formRef"
    class="form"
    :class="[
      `form--layout-${layout}`,
      `form--label-position-${labelPosition}`,
      `form--size-${size}`
    ]"
    :style="{
      '--form-grid-cols': layout === 'grid' ? gridCols : undefined,
      '--form-row-gap': rowGap,
      '--form-col-gap': colGap
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, nextTick, computed } from 'vue'
  import type { FormProps } from './types/form'
  import { useProvideFormContext } from './hooks/useFormContext'

  const props = withDefaults(defineProps<FormProps>(), {
    layout: 'horizontal',
    labelAlign: 'right',
    labelPosition: 'inline',
    labelWidth: '100px',
    disabled: false,
    gridCols: 3,
    gridColSpan: 1,
    gridRowSpan: 1,
    rowGap: '20px',
    colGap: '20px',
    size: 'default'
  })

  const formRef = ref<HTMLElement>()
  const maxLabelWidth = ref(0)

  // 计算最大标签宽度
  const calculateMaxLabelWidth = async () => {
    if (
      (props.layout === 'vertical' || props.layout === 'horizontal') &&
      props.labelPosition === 'inline' &&
      props.labelWidth === 'auto'
    ) {
      await nextTick()
      const labels = formRef.value?.getElementsByClassName('form-item__label')

      if (labels && labels.length > 0) {
        let maxWidth = 0
        // 创建临时span计算文本宽度
        const tempSpan = document.createElement('span')
        tempSpan.style.visibility = 'hidden'
        tempSpan.style.position = 'absolute'
        tempSpan.style.whiteSpace = 'nowrap'
        tempSpan.style.fontSize = '14px'
        document.body.appendChild(tempSpan)

        // 将HTMLCollection转换为数组
        Array.from(labels).forEach((label: Element) => {
          const text = label.textContent?.trim() || ''
          tempSpan.textContent = text
          const width = tempSpan.getBoundingClientRect().width
          maxWidth = Math.max(maxWidth, width)
        })

        document.body.removeChild(tempSpan)
        // 添加padding
        maxLabelWidth.value = maxWidth + 16
      }
    }
  }

  // 监听布局和标签宽度的变化
  watch(
    () => [props.layout, props.labelWidth, props.labelPosition],
    () => {
      calculateMaxLabelWidth()
    }
  )

  onMounted(() => {
    calculateMaxLabelWidth()
  })

  // 统一的标签宽度
  const unifiedLabelWidth = computed(() => {
    if (
      props.layout === 'vertical' &&
      props.labelPosition === 'inline' &&
      props.labelWidth === 'auto'
    ) {
      return `${maxLabelWidth.value}px`
    }
    return props.labelWidth
  })

  useProvideFormContext({
    labelWidth: computed(() => unifiedLabelWidth.value),
    labelEllipsis: computed(() => props.labelEllipsis),
    labelAlign: computed(() => props.labelAlign),
    labelPosition: computed(() => props.labelPosition),
    gridCols: computed(() => props.gridCols),
    gridColSpan: computed(() => props.gridColSpan),
    gridRowSpan: computed(() => props.gridRowSpan),
    size: computed(() => props.size)
  })

  defineExpose({
    validate: async () => {
      // 获取所有表单项
      const formItems = formRef.value?.getElementsByClassName('form-item')
      if (!formItems) return true

      // 遍历所有表单项进行验证
      const results = await Promise.all(
        Array.from(formItems).map(async item => {
          const formItem = item as any
          if (formItem.__vueParentComponent?.exposed?.validate) {
            return formItem.__vueParentComponent.exposed.validate()
          }
          return true
        })
      )

      // 所有表单项都验证通过才返回 true
      return results.every(result => result === true)
    },
    resetFields: () => {
      // 重置所有表单项的值
      const formItems = formRef.value?.getElementsByClassName('form-item')
      if (!formItems) return

      Array.from(formItems).forEach(item => {
        const formItem = item as any
        if (formItem.__vueParentComponent?.exposed?.clearValidate) {
          formItem.__vueParentComponent.exposed.clearValidate()
        }
      })
    },
    clearValidate: () => {
      // 清除所有表单项的验证状态
      const formItems = formRef.value?.getElementsByClassName('form-item')
      if (!formItems) return

      Array.from(formItems).forEach(item => {
        const formItem = item as any
        if (formItem.__vueParentComponent?.exposed?.clearValidate) {
          formItem.__vueParentComponent.exposed.clearValidate()
        }
      })
    }
  })
</script>

<style lang="scss" scoped>
  :root {
    // 网格变量
    --form-grid-cols: 3;
    --form-row-gap: 20px;
    --form-col-gap: 20px;
  }

  .form {
    width: 100%;
    margin-bottom: var(--form-row-gap);

    &--layout {
      &-horizontal {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--form-row-gap);
      }

      &-vertical {
        display: flex;
        flex-direction: column;
        gap: var(--form-row-gap);
      }

      &-grid {
        display: grid;
        grid-template-columns: repeat(var(--form-grid-cols), 1fr);
        row-gap: var(--form-row-gap);
        column-gap: var(--form-col-gap);
      }
    }
  }
</style>
