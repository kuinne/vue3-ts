import { defineComponent, onMounted } from "vue";
import { usePageInject, usePageProvide } from "./state";
import Controls from "./components/Controls";
import Main from "./components/Main";
const Page = defineComponent({
  setup() {
    const { setCount } = usePageInject();
    onMounted(() => {
      setTimeout(() => {
        setCount(Date.now());
      }, 3000);
    });
    return () => (
      <div>
        <Controls />
        <Main />
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    usePageProvide({ type: "double" });
    return () => <Page />;
  },
});
