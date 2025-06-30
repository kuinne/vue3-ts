import { computed, inject, provide, ref, type ComputedRef } from 'vue'
import type { LabelAlign, LabelPosition, FormSize } from '../types'

export interface FormContext {
  labelWidth: ComputedRef<string | number>
  labelEllipsis: ComputedRef<boolean>
  labelAlign: ComputedRef<LabelAlign>
  labelPosition: ComputedRef<LabelPosition>
  gridCols: ComputedRef<number>
  gridColSpan: ComputedRef<number>
  gridRowSpan: ComputedRef<number>
  size: ComputedRef<FormSize>
}

const formContextKey = Symbol('formContext')

export function useProvideFormContext(context: FormContext) {
  provide(formContextKey, context)
}

export function useFormContext() {
  const context = inject<FormContext>(formContextKey, {
    labelWidth: computed(() => '100px'),
    labelEllipsis: computed(() => false),
    labelAlign: computed(() => 'right'),
    labelPosition: computed(() => 'inline'),
    gridCols: computed(() => 3),
    gridColSpan: computed(() => 1),
    gridRowSpan: computed(() => 1),
    size: computed(() => 'default')
  })

  return context
} 