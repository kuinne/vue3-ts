import {
  MaybeRef,
  UnwrapNestedRefs,
  UnwrapRef,
  computed,
  defineComponent,
  isRef,
  reactive,
  toRef,
  toRefs,
  toValue,
  unref,
} from "vue";

export function toReactive<T extends object>(
  objectRef: MaybeRef<T>
): UnwrapNestedRefs<T> {
  if (!isRef(objectRef)) {
    return reactive(objectRef);
  }
  const proxy = new Proxy(
    {},
    {
      get(_, p, receiver) {
        return unref(Reflect.get(objectRef.value, p, receiver));
      },
      set(_, p, value) {
        if (isRef((objectRef.value as any)[p]) && !isRef(value)) {
          (objectRef.value as any)[p].value = value;
        } else {
          (objectRef.value as any)[p] = value;
        }
        return true;
      },
      deleteProperty(_, p) {
        return Reflect.deleteProperty(objectRef.value, p);
      },
      has(_, p) {
        return Reflect.has(objectRef.value, p);
      },
      ownKeys() {
        return Object.keys(objectRef.value);
      },
      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    }
  );
  return reactive(proxy) as UnwrapNestedRefs<T>;
}

export type ReactivePickPredicate<T> = (
  value: T[keyof T],
  key: keyof T
) => boolean;

export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): { [S in K]: UnwrapRef<T[S]> };
export function reactivePick<T extends object>(
  obj: T,
  predicate: ReactivePickPredicate<T>
): { [S in keyof T]?: UnwrapRef<T[S]> };
export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): { [S in K]: UnwrapRef<T[S]> } {
  const flatKeys = keys.flat() as K[];
  const predicate = flatKeys[0] as unknown as ReactivePickPredicate<T>;
  return toReactive(
    computed(() =>
      typeof predicate === "function"
        ? Object.fromEntries(
            Object.entries(toRefs(obj)).filter(([k, v]) =>
              predicate(toValue(v) as T[K], k as K)
            )
          )
        : Object.fromEntries(flatKeys.map((k) => [k, toRef(obj, k)]))
    )
  ) as any;
}

export default defineComponent({
  setup() {},
});
