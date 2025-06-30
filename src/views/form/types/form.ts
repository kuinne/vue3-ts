import type { LabelAlign, LabelPosition, FormSize } from './index'

export type FormLayout = 'horizontal' | 'vertical' | 'grid' | 'inline'

export interface FormProps {
  layout?: 'horizontal' | 'vertical' | 'grid'
  labelAlign?: LabelAlign
  labelPosition?: LabelPosition
  labelWidth?: string | number
  labelEllipsis?: boolean
  disabled?: boolean
  gridCols?: number
  gridColSpan?: number
  gridRowSpan?: number
  rowGap?: string
  colGap?: string
  size?: FormSize
}

export interface FormInstance {
  validate: () => Promise<boolean>
  resetFields: () => void
  clearValidate: () => void
}
