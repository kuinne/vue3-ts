import {
  defineComponent,
  effectScope,
  onScopeDispose,
  onUnmounted,
  ref,
  watch,
} from "vue";

function useCustomEffect() {
  const scope = effectScope();
  const data = ref(0);
  const status = ref("inactive");

  scope.run(() => {
    watch(data, (newVal) => {
      if (newVal > 5) {
        status.value = "active";
      } else {
        status.value = "inactive";
      }
    });
  });
  const increment = () => {
    data.value++;
  };

  const stop = () => {
    console.log("stop", stop);

    scope.stop();
  };

  onScopeDispose(() => {
    console.log("onScopeDispose");
  });

  onUnmounted(() => {
    console.log("onMounted");
  });
  return {
    data,
    status,
    increment,
    stop,
  };
}

export default defineComponent({
  setup() {
    const { data, status, increment, stop } = useCustomEffect();
    return () => (
      <div>
        <div onClick={stop}>stop</div>
        <div onClick={increment}>
          {data.value}:{status.value}
        </div>
      </div>
    );
  },
});
