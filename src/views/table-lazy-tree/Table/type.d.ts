import Table from "./index.tsx";
import { Ref } from "vue";
import { ElTableV2 } from "element-plus";
export type TableInstanceType = InstanceType<typeof Table> & {
  elTableRef: Ref<InstanceType<typeof ElTableV2>>;
  scrollToRow: (targetKey: string) => Promise<void>;
  expandAll: () => void;
  selectAll: (checked: boolean) => void;
};
