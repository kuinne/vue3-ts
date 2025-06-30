import type { ValidationRule } from '../types'

export function useFormValidation() {
  // 统一的校验方法
  const validateField = async (value: any, rules: ValidationRule[], label?: string) => {
    if (!rules || rules.length === 0) {
      return { valid: true, message: '' }
    }

    for (const rule of rules) {
      // 必填校验
      if (rule.required) {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return { valid: false, message: rule.message || `${label || '字段'}不能为空` }
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
        return { valid: false, message: rule.message || `${label || '字段'}格式不正确` }
      }

      // 自定义校验函数
      if (rule.validator) {
        try {
          const result = rule.validator(value)

          if (result instanceof Promise) {
            const isValid = await result
            if (!isValid) {
              return { valid: false, message: rule.message || `${label || '字段'}验证失败` }
            }
          } else if (!result) {
            return { valid: false, message: rule.message || `${label || '字段'}验证失败` }
          }
        } catch (err) {
          return {
            valid: false,
            message: err instanceof Error ? err.message : `${label || '字段'}验证失败`
          }
        }
      }

      // 数字范围校验
      if (typeof value === 'number' || !isNaN(Number(value))) {
        const num = Number(value)
        if (rule.min !== undefined && num < rule.min) {
          return { valid: false, message: rule.message || `${label || '字段'}不能小于${rule.min}` }
        }
        if (rule.max !== undefined && num > rule.max) {
          return { valid: false, message: rule.message || `${label || '字段'}不能大于${rule.max}` }
        }
      }

      // 字符串长度校验
      if (typeof value === 'string' || Array.isArray(value)) {
        const length = value.length
        if (rule.minLength !== undefined && length < rule.minLength) {
          return {
            valid: false,
            message: rule.message || `${label || '字段'}长度不能小于${rule.minLength}`
          }
        }
        if (rule.maxLength !== undefined && length > rule.maxLength) {
          return {
            valid: false,
            message: rule.message || `${label || '字段'}长度不能大于${rule.maxLength}`
          }
        }
      }
    }

    return { valid: true, message: '' }
  }

  return {
    validateField
  }
}
