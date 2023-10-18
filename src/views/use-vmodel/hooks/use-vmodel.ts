import { computed } from "vue";

export function useVModel<T>(props: T, propName: keyof T, emit) {
  return computed({
    get() {
      // @ts-ignore
      return new Proxy(props[propName], {
        get(target, key) {
          return Reflect.get(target, key);
        },
        set(target, key, newValue) {
          emit("update:" + propName, {
            ...target,
            [key]: newValue,
          });
        },
      });
    },
    set(value) {
      // @ts-ignore
      emit("update:" + propName, value);
    },
  });
}
