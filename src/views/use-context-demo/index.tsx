import { computed, defineComponent, onMounted, ref, unref, watch } from "vue";
import { createPageContext, usePageContext } from "./hooks/use-page-context";
import Child from "./Child";

export default defineComponent({
  setup() {
    const contentHeight = ref(window.innerHeight);
    const pageHeight = ref(window.innerHeight);
    const getViewHeight = computed(() => {
      return unref(contentHeight);
    });

    const wrapRef = ref<HTMLDivElement | null>(null);

    const show = ref(false);

    watch(wrapRef, () => {
      if (wrapRef.value) {
        contentHeight.value = wrapRef.value?.clientHeight;
      }
    });

    async function setPageHeight(height: number) {
      console.log("setPageHeight", height);

      contentHeight.value = height;
    }

    onMounted(() => {
      setTimeout(() => {
        show.value = true;
      }, 1000);
    });

    createPageContext({
      contentHeight: getViewHeight,
      pageHeight,
      setPageHeight,
    });
    return () => <div ref={wrapRef}>{show.value ? <Child /> : null}</div>;
  },
});
