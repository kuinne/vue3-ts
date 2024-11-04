import Table from './index.tsx'
import { ExtractPropTypes, PropType, Ref } from 'vue'
import { Column, ElTableV2 } from 'element-plus'
export type TableInstanceType = InstanceType<typeof Table> & {
  elTableRef: Ref<InstanceType<typeof ElTableV2>>
  scrollToRow: (targetKey: string) => Promise<void>
  expandAll: () => void
  selectAll: (checked: boolean) => void
}

export const tableV2Props = {
  data: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  expandedRowKeys: {
    type: Array as PropType<string[]>,
    default: [],
  },
  rowHeight: {
    type: Boolean,
  },
  selection: {
    type: Boolean,
  },
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  load: {
    type: Function as PropType<(rowData: any) => Promise<any[]>>,
  },

  expandColumnKey: {
    type: String,
  },
}
export type TableV2Props = ExtractPropTypes<typeof tableV2Props>
