export type FormLayout = 'horizontal' | 'vertical' | 'grid' | 'inline'
export type LabelAlign = 'left' | 'right'
export type LabelPosition = 'inline' | 'top'
export type FormItemType = 'input' | 'select' | 'checkbox' | 'radio' | 'switch' | 'textarea' | 'date' | 'number'

export interface FormItem {
  name: string
  label: string
  type: 'input' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'time' | 'datetime' | 'switch' | 'slider' | 'rate' | 'color' | 'upload' | 'cascader' | 'tree' | 'transfer' | 'autocomplete' | 'input-number' | 'time-picker' | 'date-picker' | 'datetime-picker' | 'month-picker' | 'year-picker' | 'week-picker' | 'quarter-picker' | 'range-picker' | 'range-time-picker' | 'range-date-picker' | 'range-datetime-picker' | 'range-month-picker' | 'range-year-picker' | 'range-week-picker' | 'range-quarter-picker'
  options?: any[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rules?: any[]
  labelWidth?: string | number
  labelEllipsis?: boolean
  labelAlign?: LabelAlign
  labelPosition?: LabelPosition
  gridColSpan?: number
  gridRowSpan?: number
}

export interface FormProps<T extends Record<string, any>> {
  model: T
  items: FormItem[]
  layout?: 'horizontal' | 'vertical' | 'grid' | 'inline'
  labelWidth?: string | number
  labelAlign?: 'left' | 'right'
  labelPosition?: 'inline' | 'top'
  inline?: boolean
  disabled?: boolean
  gridCols?: number
  gridColSpan?: number
  gridRowSpan?: number
}

export interface FormInstance {
  validate: () => Promise<boolean>
  resetFields: () => void
  clearValidate: () => void
} 