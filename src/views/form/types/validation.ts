import type { ComputedRef } from 'vue'

// 验证规则接口
export interface ValidationRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change'
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | Promise<boolean>
}

// FormItem 组件上下文
export interface FormItemContext {
  validate: () => Promise<boolean>
  clearValidate: () => void
}

// Form 组件上下文
export interface FormContext {
  model: Record<string, any>
  rules?: Record<string, ValidationRule[]>
  labelPosition: ComputedRef<'left' | 'right' | 'top'>
  labelWidth: ComputedRef<string | number>
  labelSuffix: ComputedRef<string>
  labelAlign: ComputedRef<'left' | 'right'>
  labelEllipsis: ComputedRef<boolean>
  inline: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  size: ComputedRef<'small' | 'default' | 'large'>
  gridCols: ComputedRef<number>
  gridColSpan: ComputedRef<number>
  gridRowSpan: ComputedRef<number>
  validate: () => Promise<boolean>
  resetFields: () => void
  clearValidate: (props?: string | string[]) => void
  validateField: (
    value: any,
    rules: ValidationRule[],
    label?: string
  ) => Promise<{ valid: boolean; message: string }>
  registerFormItem: (formItem: FormItemContext) => void
  unregisterFormItem: (formItem: FormItemContext) => void
}
