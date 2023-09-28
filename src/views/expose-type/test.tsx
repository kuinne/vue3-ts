import { defineComponent, ref } from "vue";
import { Input as AInput } from "ant-design-vue";

export const Test = defineComponent({
  expose: ["validate"],
  methods: {
    validate(...args: any) {
      return this.$.exposed?._validate?.(...args);
    },
  },
  setup(props, { expose }) {
    const value = ref("hello");
    expose({
      _validate(msg) {
        alert(msg);
      },
    });
    return () => <div>ssss</div>;
  },
});
export default defineComponent({
  setup() {
    const testRef = ref<InstanceType<typeof Test>>();
    const inputRef = ref<InstanceType<typeof Test>>();

    const validate = () => {
      testRef.value?.validate("hello world");
    };
    return () => (
      <>
        <Test ref={testRef} />
        <button onClick={validate}>click</button>
        <AInput ref={inputRef} />
      </>
    );
  },
});
