<template>
  <div
    class="form-item"
    :class="[
      { 'form-item--required': required },
      { 'form-item--disabled': disabled },
      { 'form-item--error': error },
      `form-item--label-position-${formContext.labelPosition.value}`
    ]"
    :style="{
      gridColumn: `span ${gridColSpan ?? formContext.gridColSpan.value}`,
      gridRow: `span ${gridRowSpan ?? formContext.gridRowSpan.value}`
    }"
  >
    <FormLabel
      :label="label"
      :label-width="formContext.labelWidth.value"
      :label-align="formContext.labelAlign.value"
      :label-position="formContext.labelPosition.value"
      :label-ellipsis="formContext.labelEllipsis.value"
      :required="required"
    />
    <div class="form-item__content">
      <component
        :is="getComponent(type)"
        v-model="modelValue"
        v-bind="componentProps"
        :disabled="disabled"
        :size="formContext.size.value"
        width="100%"
        @blur="handleBlur"
        @change="handleChange"
      >
        <template v-if="type === 'custom'">
          <slot></slot>
        </template>
      </component>
      <div v-if="error" class="form-item__error">{{ error }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, nextTick, watch, inject } from 'vue'
  import type { FormItemProps, FormItemType, CustomProps, ValidationRule } from './types'
  import { useFormContext } from './hooks/useFormContext'
  import FormLabel from './FormLabel.vue'

  // 使用泛型来定义 props 类型
  const props = withDefaults(defineProps<FormItemProps>(), {
    disabled: false,
    required: false,
    gridColSpan: 1,
    gridRowSpan: 1,
    rules: () => []
  }) as FormItemProps

  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'validate', value: any, rules: ValidationRule[]): void
  }>()

  const formContext = useFormContext()

  const labelRef = ref<HTMLElement>()
  const isLabelOverflow = ref(false)
  const error = ref('')

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
  watch(
    () => formContext.labelWidth.value,
    () => {
      checkLabelOverflow()
    }
  )

  // 监听标签内容变化
  watch(
    () => props.label,
    () => {
      checkLabelOverflow()
    }
  )

  const modelValue = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
  })

  // 校验方法
  const validate = async (value: any = modelValue.value) => {
    if (!props.rules || props.rules.length === 0) {
      error.value = ''
      return true
    }

    for (const rule of props.rules) {
      // 必填校验
      if (rule.required) {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          error.value = rule.message || `${props.label}不能为空`
          return false
        }
      }

      // 如果值为空且不是必填，则跳过其他校验
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        continue
      }

      // 正则校验
      if (rule.pattern && !rule.pattern.test(String(value))) {
        error.value = rule.message || `${props.label}格式不正确`
        return false
      }

      // 自定义校验函数
      if (rule.validator) {
        try {
          const result = rule.validator(value)

          if (result instanceof Promise) {
            const isValid = await result
            if (!isValid) {
              error.value = rule.message || `${props.label}验证失败`
              return false
            }
          } else if (!result) {
            error.value = rule.message || `${props.label}验证失败`

            return false
          }
        } catch (err) {
          error.value = err instanceof Error ? err.message : `${props.label}验证失败`
          return false
        }
      }

      // 数字范围校验
      if (typeof value === 'number' || !isNaN(Number(value))) {
        const num = Number(value)
        if (rule.min !== undefined && num < rule.min) {
          error.value = rule.message || `${props.label}不能小于${rule.min}`
          return false
        }
        if (rule.max !== undefined && num > rule.max) {
          error.value = rule.message || `${props.label}不能大于${rule.max}`
          return false
        }
      }

      // 字符串长度校验
      if (typeof value === 'string' || Array.isArray(value)) {
        const length = value.length
        if (rule.minLength !== undefined && length < rule.minLength) {
          error.value = rule.message || `${props.label}长度不能小于${rule.minLength}`
          return false
        }
        if (rule.maxLength !== undefined && length > rule.maxLength) {
          error.value = rule.message || `${props.label}长度不能大于${rule.maxLength}`
          return false
        }
      }
    }

    error.value = ''
    return true
  }

  // 处理失焦事件
  const handleBlur = () => {
    if (props.rules?.some(rule => rule.trigger === 'blur' || !rule.trigger)) {
      validate()
    }
  }

  // 处理值变化事件
  const handleChange = () => {
    if (props.rules?.some(rule => rule.trigger === 'change' || !rule.trigger)) {
      validate()
    }
  }

  // 监听值变化
  watch(
    () => props.modelValue,
    () => {
      if (props.rules?.some(rule => rule.trigger === 'change' || !rule.trigger)) {
        validate()
      }
    },
    { immediate: true }
  )

  // 暴露校验方法
  defineExpose({
    validate,
    clearValidate: () => {
      error.value = ''
    }
  })

  // 定义组件映射
  const components: Record<FormItemType, string> = {
    input: 'el-input',
    select: 'el-select',
    checkbox: 'el-checkbox',
    radio: 'el-radio',
    switch: 'el-switch',
    textarea: 'el-input',
    date: 'el-date-picker',
    number: 'el-input-number',
    custom: 'custom' // 自定义组件占位
  }

  // 获取组件名称
  const getComponent = (type: FormItemType) => {
    if (type === 'custom' && 'component' in props) {
      return props.component
    }
    return components[type] || 'el-input'
  }

  // 根据 type 获取对应的组件属性
  const componentProps = computed(() => {
    const { type, modelValue, ...rest } = props
    if (type === 'custom') {
      return (rest as CustomProps).props || {}
    }
    switch (type) {
      case 'input':
        return {
          type: 'text',
          ...rest
        }
      case 'textarea':
        return {
          type: 'textarea',
          ...rest
        }
      case 'date':
        const { dateType, ...dateRest } = rest as any
        return {
          type: dateType || 'date',
          ...dateRest
        }
      case 'number':
        return {
          type: 'number',
          ...rest
        }
      default:
        return rest
    }
  })
</script>

<style lang="scss" scoped>
  .form-item {
    // 颜色变量
    --form-error-color: #f56c6c;
    --form-text-color: #333;

    // 间距变量
    --form-spacing-xs: 4px;
    --form-spacing-sm: 8px;
    --form-spacing-md: 12px;

    // 字体大小
    --form-font-size-sm: 12px;
    --form-font-size-base: 14px;

    // 组件尺寸
    --form-component-height: 32px;
    display: flex;
    flex-wrap: wrap;

    &--required {
      .label-text::before {
        content: '*';
        color: var(--form-error-color);
        margin-right: var(--form-spacing-xs);
      }
    }

    &--label-position-inline {
      flex-direction: row;
    }

    &--label-position-top {
      flex-direction: column;
      .form-item__label {
        width: 100%;
      }
    }

    &__label {
      padding-right: var(--form-spacing-md);
      flex-shrink: 0;
      min-width: 0;
      margin-right: var(--form-spacing-sm);

      &--ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &--left {
        text-align: left;
      }
      &--right {
        text-align: right;
      }
    }

    &__content {
      position: relative;
      min-width: 0;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
    }

    &--error {
      .el-input__wrapper,
      .el-textarea__wrapper,
      .el-select__wrapper {
        box-shadow: 0 0 0 1px var(--form-error-color) inset;
      }
    }

    &__error {
      color: var(--form-error-color);
      font-size: var(--form-font-size-sm);
      line-height: 1;
      padding-top: var(--form-spacing-xs);
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: var(--form-spacing-xs);
      display: flex;
      align-items: center;
    }
  }

  .label-text {
    display: inline-block;
    width: 100%;
    height: var(--form-component-height);
    line-height: var(--form-component-height);

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
      gap: var(--form-spacing-sm);

      .form-item__label {
        width: 100%;
        padding-right: 0;
      }
    }
  }
</style>
