import { pick } from "lodash";
import {
  MaybeRef,
  Ref,
  computed,
  defineComponent,
  ref,
  unref,
  watch,
} from "vue";

export function refPick<T extends object, K extends keyof T>(
  value: MaybeRef<T>,
  ...keys: K[]
): Ref<{ [S in K]: T[S] }> {
  return computed({
    get() {
      return pick(unref(value), keys);
    },
    set(newVal) {
      Object.assign(unref(value), newVal);
    },
  });
}

export default defineComponent({
  setup() {
    const obj1 = ref({ a: "a", b: 1, c: "c" });

    const obj2 = refPick(obj1, "a", "b");

    const change = () => {
      obj2.value = {
        a: "a1",
        b: 2,
      };
    };

    watch(
      obj1,
      () => {
        console.log("obj1", obj1.value);
        console.log("obj2", obj2.value);
      },
      {
        deep: true,
      }
    );
    return () => <div onClick={change}>change</div>;
  },
});
