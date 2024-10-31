import { defineComponent } from "vue";
import { usePageInject } from "../state";

export default defineComponent({
  setup() {
    const { count } = usePageInject();
    return () => <div>count: {count.value}</div>;
  },
});
