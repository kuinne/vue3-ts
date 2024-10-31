import { defineComponent } from "vue";
import { usePageInject } from "../state";

export default defineComponent({
  setup() {
    const { deleteCount } = usePageInject();

    const handleDelete = () => {
      deleteCount();
    };
    return () => <button onClick={handleDelete}>Delete</button>;
  },
});
