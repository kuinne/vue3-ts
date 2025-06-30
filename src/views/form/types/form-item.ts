import type { Component } from 'vue'

export type FormItemType = 'input' | 'select' | 'checkbox' | 'radio' | 'switch' | 'textarea' | 'date' | 'number' | 'custom'

export interface ValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  validator?: (value: any) => boolean | Promise<boolean>
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  trigger?: 'blur' | 'change' | 'both'
}

export interface BaseFormItemProps {
  type: FormItemType
  modelValue: any
  name: string
  label?: string
  disabled?: boolean
  required?: boolean
  rules?: ValidationRule[]
  gridColSpan?: number
  gridRowSpan?: number
}

export interface CustomProps extends BaseFormItemProps {
  type: 'custom'
  component: Component
  props?: Record<string, any>
}

export interface InputProps extends BaseFormItemProps {
  type: 'input'
  placeholder?: string
  clearable?: boolean
  maxlength?: number
  showWordLimit?: boolean
}

export interface TextareaProps extends BaseFormItemProps {
  type: 'textarea'
  placeholder?: string
  clearable?: boolean
  maxlength?: number
  showWordLimit?: boolean
  rows?: number
}

export interface SelectProps extends BaseFormItemProps {
  type: 'select'
  placeholder?: string
  clearable?: boolean
  multiple?: boolean
  filterable?: boolean
  options: Array<{
    label: string
    value: any
    disabled?: boolean
  }>
}

export interface DateProps extends BaseFormItemProps {
  type: 'date'
  placeholder?: string
  clearable?: boolean
  format?: string
  valueFormat?: string
  dateType?: 'date' | 'datetime' | 'daterange' | 'datetimerange'
}

export interface NumberProps extends BaseFormItemProps {
  type: 'number'
  placeholder?: string
  min?: number
  max?: number
  step?: number
  precision?: number
}

export interface SwitchProps extends BaseFormItemProps {
  type: 'switch'
  activeText?: string
  inactiveText?: string
}

export interface CheckboxProps extends BaseFormItemProps {
  type: 'checkbox'
  options: Array<{
    label: string
    value: any
    disabled?: boolean
  }>
}

export interface RadioProps extends BaseFormItemProps {
  type: 'radio'
  options: Array<{
    label: string
    value: any
    disabled?: boolean
  }>
}

export type FormItemProps = 
  | CustomProps 
  | InputProps 
  | TextareaProps 
  | SelectProps 
  | DateProps 
  | NumberProps 
  | SwitchProps 
  | CheckboxProps 
  | RadioProps 