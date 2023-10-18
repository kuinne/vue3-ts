import { computed, defineComponent, ref } from "vue";
import { ElInput, ElButton } from "element-plus";
import { useVModel } from "./hooks/use-vmodel";

// 子组件
const Child = defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // const form = computed({
    //   get() {
    //     return new Proxy(props.modelValue, {
    //       get(target, key) {
    //         return Reflect.get(target, key);
    //       },
    //       set(target, key, value, receiver) {
    //         emit("update:modelValue", {
    //           ...target,
    //           [key]: value,
    //         });
    //         return true;
    //       },
    //     });
    //   },
    //   set(newValue) {
    //     emit("update:modelValue", newValue);
    //   },
    // });

    const form = useVModel(props, "modelValue", emit);
    return () => (
      <div>
        <ElButton
          onClick={() => {
            // 为了保证这里有更新
            console.log("form", form.value);
          }}
        >
          child test
        </ElButton>
        <ElInput v-model={form.value.name}></ElInput>
        <ElInput v-model={form.value.age}></ElInput>
        <ElInput v-model={form.value.sex}></ElInput>
      </div>
    );
  },
});

// 父组件
export default defineComponent({
  setup() {
    const form = ref({
      name: "张三",
      age: 18,
      sex: "man",
    });
    return () => (
      <div>
        <ElButton
          onClick={() => {
            console.log("form", form.value);
          }}
        >
          test
        </ElButton>
        <Child v-model={form.value} />
      </div>
    );
  },
});
