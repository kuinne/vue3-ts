import { defineComponent } from "vue";
import { usePageInject } from "../state";

export default defineComponent({
  setup() {
    const { addCount } = usePageInject();

    const handleAdd = () => {
      addCount();
    };
    return () => <button onClick={handleAdd}>Add</button>;
  },
});
