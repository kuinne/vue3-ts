import {
  InjectionKey,
  reactive,
  readonly as defineReadonly,
  provide,
  ShallowUnwrapRef,
  inject,
} from 'vue'

export interface CreateContextOptions {
  readonly?: boolean
  createProvider?: boolean
  native?: boolean
}

export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {}
) {
  const { readonly = true, createProvider = true, native = false } = options

  const state = reactive(context)
  const provideData = readonly ? defineReadonly(state) : state

  createProvider && provide(key, native ? context : provideData)

  return {
    state,
  }
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T
export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any
): ShallowUnwrapRef<T> {
  return inject(key, defaultValue || {})
}
