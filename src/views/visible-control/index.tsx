import {
  Directive,
  DirectiveBinding,
  VNode,
  defineComponent,
  ref,
  withDirectives,
} from "vue";

const vVisible: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    console.log("mounted value", value);
  },
  updated(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
    const { value } = binding;

    console.log("vNode", vNode);
  },
};

const Button = defineComponent({
  setup() {
    return () => <div>lllll</div>;
  },
});

export default defineComponent({
  setup() {
    const visible = ref(true);
    const toggle = () => {
      visible.value = !visible.value;
    };
    return () => (
      <div>
        <button onClick={toggle}>Toggle</button>
        {withDirectives(<Button />, [[vVisible, visible.value]])}
      </div>
    );
  },
});
