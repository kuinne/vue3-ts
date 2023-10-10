import { defineComponent } from "vue";

export default defineComponent({
  props: {
    activeKey: {
      type: String,
    },
  },
  emits: ["update:activeKey"],
  setup(props, { emit }) {
    const activeKey = ref(props.activeKey);

    watch(
      () => props.activeKey,
      () => {
        activeKey.value = props.activeKey;
      },
      {
        deep: true,
      }
    );

    const setActiveKey = (key: string) => {
      activeKey.value = key;
      emit("update:activeKey", activeKey.value);
    };
    const onClickItem = (key: string) => {
      setActiveKey(key);
    };
    return () => <div></div>;
  },
});


