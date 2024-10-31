import {
  InjectionKey,
  MaybeRef,
  PropType,
  Ref,
  defineComponent,
  inject,
  provide,
  reactive,
  toRef,
  toRefs,
  unref,
} from "vue";

interface IState {
  count: Ref<number>;
}

interface IAction {
  addCount: () => void;
  deleteCount: () => void;
  setCount: (count: number) => void;
}

type PageContext = IState & IAction;

const contextKey: InjectionKey<PageContext> = Symbol("PageContext");

export const usePageProvide = ({
  type,
}: {
  type: MaybeRef<"single" | "double">;
}) => {
  const state = reactive({
    count: 0,
  });

  const addCount = () => {
    if (unref(type) === "single") {
      state.count += 1;
    } else {
      state.count += 2;
    }
  };
  const deleteCount = () => {
    if (unref(type) === "single") {
      state.count -= 1;
    } else {
      state.count -= 2;
    }
  };

  const setCount = (count: number) => {
    state.count = count;
  };

  provide(contextKey, {
    ...toRefs(state),
    addCount,
    deleteCount,
    setCount,
  });
};
export const usePageInject = () => {
  const context = inject(contextKey);

  if (!context) {
    throw new Error("usePageInject must be used after usePageProvide");
  }
  return context;
};

// export const PageProvider = defineComponent({
//   props: {
//     type: {
//       type: String as PropType<"single" | "double">,
//       default: "single",
//     },
//   },
//   setup(props, { slots }) {
//     const { type } = toRefs(props);

//     usePageProvide({ type });

//     return () => <>{slots.default?.()}</>;
//   },
// });
