import {
  computed,
  defineComponent,
  onRenderTracked,
  onRenderTriggered,
  ref,
  watch,
  watchEffect,
} from "vue";

const Child = defineComponent({
  setup() {
    return () => <div>Child</div>;
  },
});

export default defineComponent({
  setup() {
    const count = ref(0);

    const doubleCount = computed(() => count.value * 2, {
      onTrack(e) {
        debugger;
      },
      onTrigger(e) {
        debugger;
      },
    });

    const add = () => {
      console.log("add");

      count.value += 1;
    };
    onRenderTracked((event) => {
      debugger;
    });

    onRenderTriggered((event) => {
      debugger;
    });

    watch(count, () => {}, {
      onTrack(event) {
        debugger;
      },
      onTrigger(event) {
        debugger;
      },
    });
    watchEffect(
      () => {
        console.log("count: ", count.value);
        console.log("doubleCount:", doubleCount.value);
      },
      {
        onTrack(event) {
          debugger;
        },
        onTrigger(event) {
          debugger;
        },
      }
    );
    return () => (
      <div>
        <div onClick={add}>add</div>
        <div>
          {count.value}
          {doubleCount.value}
        </div>
      </div>
    );
  },
});
