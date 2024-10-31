import { customRef, defineComponent, ref } from "vue";

function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: any;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}

function useTrackingRef<T>(initialValue: T) {
  let value = initialValue;
  let accessCount = ref(0);

  return {
    value: customRef((track, trigger) => {
      return {
        get() {
          track();
          accessCount.value++;
          return value;
        },
        set(newValue) {
          value = newValue;
          trigger();
        },
      };
    }),
    accessCount,
  };
}
export default defineComponent({
  setup() {
    const count = useDebouncedRef(0, 1000);

    const { value: trackedValue, accessCount } = useTrackingRef(0);

    return () => (
      <div>
        <div>{count.value}</div>
        <div>{trackedValue.value}</div>
        <div>{accessCount.value}</div>
        <div
          onClick={() => {
            count.value += 1;
            trackedValue.value = Date.now();
          }}
        >
          change
        </div>
      </div>
    );
  },
});
