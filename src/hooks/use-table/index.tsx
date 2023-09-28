import { computed, defineComponent, ref } from 'vue'

const Table = defineComponent({
  props: {
    data: {
      type: Array,
    },
  },
  setup() {
    return <div></div>
  },
})
type TableProps = InstanceType<typeof Table>['props']
export function useTable<T>({ tableProps }: { tableProps: TableProps }) {
  const data = ref<T[]>([])
  const selectionRows = ref<T[]>([])
  const currentPage = ref(0)
  const pageSize = ref(20)
  const clearSelection = () => {
    selectionRows.value = []
  }
  const getSelectionRows = computed(() => selectionRows.value)

  const Table = () => <Table {...tableProps} data={data.value}></Table>
}
