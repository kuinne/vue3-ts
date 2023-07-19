import { defineComponent, ref } from "vue";
import Layout from "./layout";
export default defineComponent({
  setup() {
    const isSub = ref(false);
    const toggle = () => {
      isSub.value = !isSub.value;
    };
    return () => {
      return (
        <>
          <button onClick={toggle}>toggle</button>
          {isSub.value ? (
            <Layout.SubLayout>222</Layout.SubLayout>
          ) : (
            <Layout.MainLayout>111</Layout.MainLayout>
          )}
        </>
      );
    };
  },
});
