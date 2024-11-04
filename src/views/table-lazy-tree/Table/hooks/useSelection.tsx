import { computed, FunctionalComponent, ref } from 'vue'
import { TableV2Props } from '../type'
import { getNodeAndDescendantIdsFromMap } from '../utils'
import { ElCheckbox, CheckboxValueType } from 'element-plus'

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  onChange,
}) => {
  return (
    <ElCheckbox
      onChange={onChange}
      modelValue={value}
      indeterminate={intermediate}
    />
  )
}

export function useSelection(
  props: TableV2Props,
  emit: any,
  flattenTreeMap: Map<string, any>,
  allKeys: string[]
) {
  const selectedKeys = ref<Set<string>>(new Set([]))

  const SelectionColumn = computed(() => ({
    key: 'selection',
    width: 50,
    cellRenderer: ({ rowData }) => {
      const onChange = (value: CheckboxValueType) => {
        select(rowData, value)
      }
      return (
        <SelectionCell
          value={!!selectedKeys.value.has(rowData[props.rowKey])}
          onChange={onChange}
        />
      )
    },

    headerCellRenderer: () => {
      const onChange = (value: CheckboxValueType) => {
        selectAll(value)
      }

      const allSelected =
        !!(allKeys.length === selectedKeys.value.size) &&
        selectedKeys.value.size > 0
      const containsChecked = selectedKeys.value.size > 0

      return (
        <SelectionCell
          value={allSelected}
          intermediate={containsChecked && !allSelected}
          onChange={onChange}
        />
      )
    },
  }))

  const select = (row: any, checked: boolean) => {
    let keys: string[] = []
    if (props.checkStrictly) {
      keys = [row[props.rowKey]] as string[]
    } else {
      keys = getNodeAndDescendantIdsFromMap(flattenTreeMap, row[props.rowKey])
    }
    if (checked) {
      keys.forEach((key) => {
        selectedKeys.value.add(key)
      })
    } else {
      keys.forEach((key) => {
        selectedKeys.value.delete(key)
      })
    }
  }

  const selectAll = (checked: boolean) => {
    if (checked) {
      allKeys.forEach((key) => {
        selectedKeys.value.add(key)
      })
    } else {
      allKeys.forEach((key) => {
        selectedKeys.value.delete(key)
      })
    }
  }

  return {
    selectedKeys,
    select,
    selectAll,
    SelectionColumn,
  }
}
