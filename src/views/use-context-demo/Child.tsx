import { defineComponent } from "vue";
import { usePageContext } from "./hooks/use-page-context";

export default defineComponent({
  setup() {
    const { contentHeight, setPageHeight } = usePageContext();

    return () => (
      <div>
        <div>child: {contentHeight.value}</div>
        <input onInput={(e) => setPageHeight(e.target.value)}></input>
        <button
          onClick={() => {
            contentHeight.value = Date.now();
          }}
        ></button>
      </div>
    );
  },
});
