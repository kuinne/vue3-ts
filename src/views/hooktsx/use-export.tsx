import { ElButton } from "element-plus";
import { defineComponent } from "vue";

export function useExport() {
  const render = () => <div>hello</div>;
  return {
    render,
  };
}
