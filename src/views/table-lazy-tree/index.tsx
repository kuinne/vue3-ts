import {
  ElTable,
  ElTableV2,
  ElTableColumn,
  ElTree,
  ElCheckbox,
  ElAutoResizer,
  ElButton,
  ElInput,
} from 'element-plus'
import { defineComponent, ref, unref, computed, watch } from 'vue'
import {
  calculateMaxNodes,
  findClosestConfig,
  genTree,
  flattenTree,
  getNodeAndDescendantIdsFromFlat,
  getPathToRootFromArray,
  getPathToRootFromMap,
  flattenTreeToMap,
  getNodeAndDescendantIdsFromMap,
} from './utils'
import { FunctionalComponent, nextTick } from 'vue'

import type { CheckboxValueType, Column } from 'element-plus'
interface User {
  id: String
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const level = 6
const n = 6

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

export default defineComponent({
  setup() {
    const tableRef = ref<any>()
    const treeData = ref<any[]>([])
    let flattenTreeMap: Map<string, any> = new Map()
    const selectedKeys = ref<Set<string>>(new Set([]))

    const keyword = ref('')

    let allKeys: string[] = []

    const expandedRowKeys = ref<string[]>([])

    watch(
      expandedRowKeys,
      () => {
        console.log('expandedRowKeys', expandedRowKeys.value)
      },
      {
        deep: true,
      }
    )

    watch(
      selectedKeys.value,
      () => {
        console.log('selectedKeys.value', selectedKeys.value)
      },
      {
        deep: true,
      }
    )

    const select = (row: any, checked: boolean) => {
      const keys = getNodeAndDescendantIdsFromMap(flattenTreeMap, row.id)
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

    const columns = computed(() => [
      {
        key: 'selection',
        width: 50,
        cellRenderer: ({ rowData }) => {
          const onChange = (value: CheckboxValueType) => {
            select(rowData, value)
          }
          return (
            <SelectionCell
              value={!!selectedKeys.value.has(rowData.id)}
              onChange={onChange}
            />
          )
        },

        headerCellRenderer: () => {
          const onChange = (value: CheckboxValueType) => {
            selectAll(value)
          }

          const allSelected = !!(allKeys.length === selectedKeys.value.size)
          const containsChecked = selectedKeys.value.size > 0

          return (
            <SelectionCell
              value={allSelected}
              intermediate={containsChecked && !allSelected}
              onChange={onChange}
            />
          )
        },
      },
      {
        dataKey: 'name',
        key: 'name',
        title: 'name',
        width: 150,
        // cellRenderer: ({ rowData }) => {
        //   return (
        //     <span id={rowData.id}>
        //       {rowData.name}
        //     </span>
        //   );
        // },
      },
      {
        dataKey: 'date',
        key: 'date',
        title: 'date',
        width: 150,
      },
    ])

    const getData = () => {
      treeData.value = []
      let total = calculateMaxNodes(level, n)
      console.log('total', total)

      const res = genTree(level, n, (node) => ({
        ...node,
      }))

      // const res = [
      //   {
      //     id: '1',
      //     name: '1',
      //     depth: 1,
      //     children: [
      //       {
      //         id: '1_1',
      //         name: '1_1',
      //         depth: 2,
      //         children: [
      //           {
      //             id: '1_1_1',
      //             name: '1_1_1',
      //             depth: 3,
      //             children: [
      //               {
      //                 id: '1_1_1_1',
      //                 name: '1_1_1_1',
      //                 depth: 4,
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: '1_2',
      //         name: '1_2',
      //         depth: 5,
      //       },
      //     ],
      //   },
      //   {
      //     id: '2',
      //     name: '2',
      //     depth: 6,
      //     children: [
      //       {
      //         id: '2_1',
      //         name: '2_1',
      //         depth: 7,
      //         children: [
      //           {
      //             id: '2_1_1',
      //             name: '2_1_1',
      //             depth: 8,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ]
      treeData.value = res
      flattenTreeMap = flattenTreeToMap(res)
      console.log('flattenTreeMap', flattenTreeMap)

      allKeys = Array.from(flattenTreeMap.keys())
    }

    const handleRowExpand = ({
      expanded,
      rowKey,
    }: {
      expanded: boolean
      rowKey: string
    }) => {
      console.log('expanded', expanded, rowKey)
    }

    // console.log(findClosestConfig(5000));

    getData()

    const reset = () => {}

    const expandAll = () => {
      expandedRowKeys.value = allKeys
    }

    const deleteRows = () => {}

    const scrollToRow = async (targetKey: string) => {
      let rowHeight = 50
      let path = flattenTreeMap.get(targetKey).path.split('/')

      expandedRowKeys.value = [
        ...new Set([
          ...expandedRowKeys.value,
          ...path.slice(0, path.length - 1),
        ]),
      ]

      await nextTick()

      const target = flattenTreeMap.get(targetKey)
      const expandedRowKeysSet = new Set(expandedRowKeys.value)

      const isVisible = (node: any) => {
        return node.level === 1 || expandedRowKeysSet.has(node.parentId)
      }
      const visibleNodes = Array.from(flattenTreeMap.values()).filter(
        (i) => isVisible(i) && i.depth < target.depth
      )

      const scrollTop = visibleNodes.length * rowHeight

      tableRef.value?.scrollToTop(scrollTop)
    }

    const expandLast = () => {
      scrollToRow('6_4_3_1')
    }

    return () => (
      <div>
        <div style="display: flex; gap: 10px">
          <ElButton onClick={reset}>重置</ElButton>
          <ElButton onClick={expandAll}>展开所有</ElButton>
          <ElButton onClick={selectAll}>选择全部</ElButton>
          <ElButton onClick={deleteRows}>删除</ElButton>
          <ElButton onClick={expandLast}>展开最后一个</ElButton>
          <ElInput v-model={keyword.value} width={200} />
        </div>
        <div style="height: 500px; width: 900px; resize: both;overflow: scroll; border: 1px solid black;">
          <ElAutoResizer>
            {{
              default: ({ height, width }: any) => (
                <ElTableV2
                  ref={tableRef}
                  columns={columns.value}
                  data={treeData.value}
                  rowKey="id"
                  width={width}
                  height={height}
                  expandColumnKey="name"
                  onRowExpand={handleRowExpand}
                  v-model:expandedRowKeys={expandedRowKeys.value}
                ></ElTableV2>
              ),
            }}
          </ElAutoResizer>
        </div>
      </div>
    )
  },
})
