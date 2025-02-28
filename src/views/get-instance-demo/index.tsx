import { defineComponent, getCurrentInstance, ref } from "vue";

const Child = defineComponent({
  props: {
    msg: {
      type: String,
      default: "hello world",
    },
  },
  emits: ["change"],
  setup(props, { emit, slots }) {
    const title = ref("yes");
    const handleChange = (evt: Event) => {
      emit("change", evt.target);
    };

    const instance = getCurrentInstance();

    const test = () => {
      console.log("instance", instance);
      console.log("slots", instance?.slots);
      console.log("subTree", instance?.subTree);
      console.log("effects", instance?.effect);

      console.log("proxy", instance?.proxy);
    };

    return () => (
      <div>
        {props.msg}
        <input onChange={handleChange}></input>
        {slots.default?.()}
        <button onClick={test}>test</button>
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    return () => (
      <Child msg="hello vue3">
        <p>world</p>
      </Child>
    );
  },
});
