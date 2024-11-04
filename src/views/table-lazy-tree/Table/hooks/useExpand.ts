import { useVModel } from '@vueuse/core'
import { TableV2Props } from '../type'
import { ref } from 'vue'

export function useExpand(
  props: TableV2Props,
  emit: any,
  allKeys: string[],
  intData: any
) {
  const expandedRowKeys = useVModel(props, 'expandedRowKeys', emit)

  let loadingKeys = ref<Set<string>>(new Set([]))

  const load = async (rowData: any) => {
    if (props.load && !rowData.children?.length) {
      loadingKeys.value.add(rowData[props.rowKey])
      if (!rowData.children) {
        rowData.children = []
      }
      const res = await props.load(rowData)
      rowData.children.push(...res)

      intData()

      loadingKeys.value.delete(rowData[props.rowKey])
    }
  }

  const expand = (rowData: any, expanded: boolean) => {
    if (expanded) {
      expandedRowKeys.value.push(rowData[props.rowKey])
      load(rowData)
    } else {
      const index = expandedRowKeys.value.findIndex(
        (i) => i === rowData[props.rowKey]
      )

      if (index > -1) {
        expandedRowKeys.value.splice(index, 1)
      }
    }
  }

  const expandAll = () => {
    console.log('expandAll', allKeys)

    expandedRowKeys.value = allKeys
  }

  return {
    expandedRowKeys,

    loadingKeys,
    load,
    expand,
    expandAll,
  }
}
