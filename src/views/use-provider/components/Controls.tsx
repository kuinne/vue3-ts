import { defineComponent } from "vue";
import AddButton from "./AddButton";
import DelButton from "./DelButton";
export default defineComponent({
  setup() {
    return () => (
      <div style="display: flex; align-items: center; gap: 10px">
        <AddButton />
        |
        <DelButton />
      </div>
    );
  },
});
