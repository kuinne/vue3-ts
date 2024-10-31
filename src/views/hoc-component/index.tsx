import {
  Component,
  DefineComponent,
  defineComponent,
  h,
  nextTick,
  ref,
  toRefs,
} from "vue";

const Child = defineComponent({
  props: {
    count: {
      type: Number,
      required: false,
    },
  },
  emits: ["reload", "change"],
  setup(props, { emit }) {
    const count = ref(props.count || 0);
    const add = () => {
      count.value += 1;
      emit("change", count.value);
    };

    const reload = () => {
      emit("reload");
    };
    return () => (
      <div>
        count: {count.value}
        <button onClick={add}>add</button>
        <button onClick={reload}>reload</button>
      </div>
    );
  },
});

function withReload<T extends Component | DefineComponent>(
  WrapperComponent: T
): T {
  return defineComponent({
    name: "withReload",
    setup(props, { slots }) {
      const show = ref(true);

      const handleReload = () => {
        show.value = false;
        nextTick(() => {
          show.value = true;
        });
      };
      return () =>
        show.value
          ? h(
              WrapperComponent,
              {
                ...props,
                onReload: handleReload,
              },
              slots
            )
          : null;
    },
  }) as T;
}

const ChildHOC = withReload(Child);

// export default defineComponent({
//   setup() {
//     const handleChange = (val) => {
//       console.log("zzzzchange", val);
//     };
//     return () => <ChildHOC count={123} onChange={handleChange} />;
//   },
// });

export default withReload(Child);
