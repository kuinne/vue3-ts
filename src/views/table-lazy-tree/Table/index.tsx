import { ElTableV2, ElAutoResizer } from 'element-plus'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'

import styles from './style.module.scss'
import { ExpandedIcon, ExpandIcon, LoadingIcon } from './icons'
import { tableV2Props } from './type'
import { useData } from './hooks/useData'
import { useSelection } from './hooks/useSelection'
import { useExpand } from './hooks/useExpand'

export default defineComponent({
  props: tableV2Props,
  emits: ['update:expandedRowKeys'],
  setup(props, { emit, expose, attrs }) {
    const { data, flattenTreeMap, allKeys, intData } = useData(props, emit)

    const { selectAll, SelectionColumn } = useSelection(
      props,
      emit,
      flattenTreeMap,
      allKeys
    )

    const { expandedRowKeys, loadingKeys, expand, expandAll } = useExpand(
      props,
      emit,
      allKeys,
      intData
    )
    const elTableRef = ref<InstanceType<typeof ElTableV2>>()

    const containerWidth = ref(0)

    const columns = computed(() => {
      const res = []
      if (props.selection) {
        res.push(SelectionColumn.value)
      }
      res.push(...props.columns)
      return res.map((i) => ({
        ...i,
        width:
          typeof i.width === 'string'
            ? (parseFloat(i.width) / 100) * containerWidth.value
            : i.width,
      }))
    })

    const scrollToRow = async (targetKey: string) => {
      let rowHeight = props.rowHeight
      if (!rowHeight) return
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

      elTableRef.value?.scrollToTop(scrollTop)
    }

    const handleRowDbclick = (rowData: any) => {
      console.log('handleRowDbclick', rowData)
    }

    expose({
      elTableRef,
      scrollToRow,
      expandAll,
      selectAll,
    })

    const Cell = ({ column, rowData }: { column: any; rowData: any }) => {
      if (column.cellRenderer) {
        return (
          <div
            class="el-table-v2__row-cell"
            role="cell"
            style={{ width: `${column.width}px`, flex: '0 1 auto' }}
          >
            {column.cellRenderer({ rowData })}
          </div>
        )
      } else if (column.key === props.expandColumnKey) {
        return (
          <div
            class="el-table-v2__row-cell"
            role="cell"
            style={{
              width: `${column.width}px`,
              flex: '0 1 auto',
            }}
          >
            {loadingKeys.value.has(rowData[props.rowKey]) ? (
              <el-icon
                class={['el-table-v2__expand-icon', styles['is-loading']]}
                style={{
                  marginInlineStart: `${(rowData.level - 1) * 12}px`,

                  fontSize: '12px',
                }}
              >
                <LoadingIcon />
              </el-icon>
            ) : expandedRowKeys.value.includes(rowData[props.rowKey]) &&
              !rowData.leaf ? (
              <el-icon
                class="el-table-v2__expand-icon"
                style={{
                  marginInlineStart: `${(rowData.level - 1) * 12}px`,

                  fontSize: '12px',
                }}
                onClick={() => {
                  expand(rowData, false)
                }}
              >
                <ExpandedIcon />
              </el-icon>
            ) : rowData.leaf ? (
              <div
                style={{
                  marginInlineStart: `${(rowData.level - 1) * 12}px`,
                  width: '12px',
                  height: '12px',
                }}
              ></div>
            ) : (
              <el-icon
                class="el-table-v2__expand-icon"
                style={{
                  marginInlineStart: `${(rowData.level - 1) * 12}px`,
                  fontSize: '12px',
                }}
                onClick={() => {
                  expand(rowData, true)
                }}
              >
                <ExpandIcon />
              </el-icon>
            )}
            <div class="el-table-v2__cell-text" title={rowData[column.dataKey]}>
              {rowData[column.dataKey]}
            </div>
          </div>
        )
      } else {
        return (
          <div
            class="el-table-v2__row-cell"
            role="cell"
            style={{ width: `${column.width}px`, flex: '0 1 auto' }}
          >
            <div class="el-table-v2__cell-text" title={rowData[column.dataKey]}>
              {rowData[column.dataKey]}
            </div>
          </div>
        )
      }
    }

    const Row = ({ columns, rowData }: { columns: any[]; rowData: any }) => {
      return (
        <div
          style={{ display: 'flex', height: '100%', width: '100%' }}
          onDblclick={() => {
            handleRowDbclick(rowData)
          }}
        >
          {columns.map((column) => (
            <Cell column={column} rowData={rowData} />
          ))}
        </div>
      )
    }

    return () => (
      <ElAutoResizer>
        {{
          default: ({ height, width }: any) => {
            containerWidth.value = width
            return (
              <ElTableV2
                ref={elTableRef}
                {...attrs}
                columns={columns.value}
                data={data.value}
                rowKey={props.rowKey}
                width={width}
                height={height}
                expandColumnKey={props.expandColumnKey}
                v-model:expandedRowKeys={expandedRowKeys.value}
              >
                {{
                  row: ({
                    columns,
                    rowData,
                    data,
                    columnIndex,
                    rowIndex,
                  }: any) => <Row columns={columns} rowData={rowData} />,
                }}
              </ElTableV2>
            )
          },
        }}
      </ElAutoResizer>
    )
  },
})
