import { PropType, defineComponent, onMounted, ref, Ref } from "vue";

type Render<Params = any> = (...args: Params[]) => JSX.Element | null;
type Children = Render<{ parentMsg: string }>;
type AddRender = Render;
const Parent = defineComponent({
  props: {
    children: Function as PropType<Children>,
    addRender: Function as PropType<AddRender>,
  },
  setup(props) {
    const msg = ref("hello");
    onMounted(() => {
      setTimeout(() => {
        msg.value = "world";
      }, 1000);
    });
    return () => (
      <>
        {props.children?.({ parentMsg: msg.value })}
        {props.addRender?.()}
      </>
    );
  },
});

type ParentProps = InstanceType<typeof Parent>["$props"];

const useToggle = ({ defaultValue = false }: { defaultValue: boolean }) => {
  const target = ref(defaultValue);
  const toggle = () => {
    target.value = !target.value;
  };

  return {
    toggle,
    target,
  };
};

export default defineComponent({
  setup() {
    const { target: visible, toggle: toggleVisible } = useToggle({
      defaultValue: false,
    });
    const childrenRender: ParentProps["children"] = ({ parentMsg }) => (
      <div>{parentMsg}</div>
    );
    const addRender: ParentProps["addRender"] = () =>
      visible.value ? <div>add</div> : null;

    return () => (
      <>
        <el-button onClick={toggleVisible}>toggle</el-button>
        <Parent children={childrenRender} addRender={addRender} />
      </>
    );
  },
});
