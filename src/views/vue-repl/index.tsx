import { defineComponent, watch } from "vue";
import { Repl, useStore, useVueImportMap } from "@vue/repl";
import CodeMirror from "@vue/repl/codemirror-editor";
import Monaco from "@vue/repl/monaco-editor";
export default defineComponent({
  setup() {
    const store = useStore();

    watch(
      store,
      () => {
        console.log("store", store);
      },
      {
        deep: true,
      }
    );
    return () => (
      <Repl
        theme={"dark"}
        editor={Monaco}
        store={store}
        showCompileOutput
        clearConsole={false}
      />
    );
  },
});
