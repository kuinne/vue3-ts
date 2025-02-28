import { defineComponent, SetupContext, SlotsType, PropType, ref } from "vue";

interface IProps<T> {
  dataSource: Array<T>;
  columns: { title: string; dataIndex: string; key: string }[];
}
interface IEmits {
  fatherHandler(name: string): void;
  click(e: MouseEvent): any;
  "update:modelValue": (value: string) => void;
}
interface ISlots {
  default: { name: string };
  header: { name: string };
  footer: { name: string };
}

/*
1.泛型语法与tsx语法重复，因此不能单独写<T>,要么写 <T,> 要么写 <T extends xxx>
2.onClick需要在自定义组件上的emits中进行声明，否则类型校验有问题
*/
export default defineComponent(
  // Vue3.3+ defineComponent备用函数签名，可以使用泛型
  <T extends any>(
    props: IProps<T>,
    { attrs, slots, emit, expose }: SetupContext<IEmits, SlotsType<ISlots>>
  ) => {
    function childMethod() {
      console.log("childMethod");
    }

    function triggerVModel(e: any) {
      emit("update:modelValue", e.target.value);
    }

    const testVif = ref(true);

    expose({ childMethod });

    console.log({ attrs, props });

    return () => (
      <>
        {/* props, emitted events, event handlers, v-if v-model v-for*/}
        <div {...attrs}>
          {slots.header && slots.header({ name: "header" })}
          {slots.default && slots.default({ name: "default" })}
          {slots.footer && slots.footer({ name: "footer" })}

          <button onClick={() => emit("fatherHandler", "123")}>
            trigger emits
          </button>

          {testVif.value ? <div>v-if</div> : <div>v-else</div>}

          <ul>
            {props.dataSource.map((item: T) => {
              return <li>{item}</li>;
            })}
          </ul>
        </div>
      </>
    );
  },
  {
    props: {
      dataSource: Array as PropType<any[]>,
      columns: Array as PropType<
        { title: string; dataIndex: string; key: string }[]
      >,
    },
    slots: Object as SlotsType<ISlots>,
    emits: ["fatherHandler", "click", "update:modelValue"],
  }
);
