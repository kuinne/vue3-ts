import { defineComponent } from "vue";
import { usePageProvide } from "./state";
import Controls from "./components/Controls";
import Main from "./components/Main";
export default defineComponent({
  setup() {
    usePageProvide({
      type: "double",
    });
    return () => (
      <div>
        <Controls />
        <Main />
      </div>
    );
  },
});
