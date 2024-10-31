import {
  customRef,
  defineComponent,
  getCurrentInstance,
  ref,
  watchSyncEffect,
} from "vue";

function useModel<T, K extends keyof T>(props: T, name: K) {
  const i = getCurrentInstance();

  const res = customRef<T[K]>((track, trigger) => {
    let localValue: any;
    watchSyncEffect(() => {
      const propValue = props[name];
      if (localValue !== propValue) {
        localValue = propValue;
        trigger();
      }
    });

    return {
      get() {
        track();
        return localValue;
      },
      set(newValue) {
        if (newValue !== localValue) {
          localValue = newValue;
          trigger();
        }
        if (i) {
          i.emit(`update:${name as string}`, newValue);
        }
      },
    };
  });

  return res;
}

const Child = defineComponent({
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const count = useModel(props, "count");

    const add = () => {
      count.value += 1;
    };

    return () => (
      <div>
        <div>Child: {count.value}</div>
        <div onClick={add}>add</div>
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    const count = ref(0);
    const add = () => {
      count.value += 1;
    };

    return () => (
      <div>
        Parent: {count.value}
        <div onClick={add}>parent add</div>
        <Child v-model:count={count.value} />
      </div>
    );
  },
});
