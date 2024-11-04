import { ElButton, ElInput } from 'element-plus'
import { defineComponent, ref, computed } from 'vue'
import { calculateMaxNodes, genTree, findClosestConfig } from './utils'

import Table from './Table'
import { TableInstanceType } from './Table/type'
interface User {
  id: String
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

const level = 8
const n = 3

export default defineComponent({
  setup() {
    const loading = ref(false)
    const tableRef = ref<TableInstanceType>()
    const treeData = ref<any[]>([])

    const keyword = ref('')

    const expandedRowKeys = ref<string[]>([])

    const columns = computed(() => [
      {
        dataKey: 'name',
        key: 'name',
        title: '部门',
        width: '20%',
      },
      {
        dataKey: 'code',
        key: 'code',
        title: '部门编号',
        width: '20%',
      },
      {
        dataKey: 'personCount',
        key: 'personCount',
        title: '人员数',
        width: '10%',
      },
      {
        dataKey: 'createBy',
        key: 'createBy',
        title: '创建人',
        width: '15%',
      },
      {
        dataKey: 'createTime',
        key: 'createTime',
        title: '创建时间',
        width: '15%',
      },
      {
        dataKey: 'state',
        key: 'state',
        title: '启用',
        width: '10%',
      },
    ])

    const getData = async () => {
      loading.value = true
      treeData.value = []
      let total = calculateMaxNodes(level, n)
      console.log('total', total)

      // const res = genTree(level, n, (node) => ({
      //   ...node,
      // }));

      const res = [
        {
          id: '1',
          name: '1',
          depth: 1,
          leaf: false,
          level: 1,
          path: '1',
          parentId: null,
          code: '132321313',
          // children: Array.from({ length: 100 }).map((item, index) => ({
          //   id: `1_${index + 1}`,
          //   name: `1_${index + 1}`,
          //   depth: 1 + (index + 1),
          //   leaf: true,
          //   level: 2,
          //   path: `1/1_${index + 1}`,
          //   parentId: '1',
          // })),
          children: [
            {
              id: '1_1',
              name: '1_1',
              depth: 2,
              level: 2,
              code: '1323424324321313',
              parentId: '1',
              children: [
                {
                  id: '1_1_1',
                  name: '1_1_1',
                  depth: 3,
                  level: 3,
                  code: '1323424324321313',
                  parentId: '1_1',
                  children: [
                    {
                      id: '1_1_1_1',
                      name: '1_1_1_1',
                      depth: 4,
                      level: 4,
                      leaf: true,
                      parentId: '1_1_1',
                    },
                  ],
                },
              ],
            },
            {
              id: '1_2',
              name: '1_2',
              depth: 5,
              level: 2,
              parentId: '1',
            },
          ],
        },
        {
          id: '2',
          name: '2',
          depth: 200,
          leaf: true,
          level: 1,
          path: '2',
          parentId: null,
          // children: [
          //   {
          //     id: '2_1',
          //     name: '2_1',
          //     depth: 7,
          //     children: [
          //       {
          //         id: '2_1_1',
          //         name: '2_1_1',
          //         depth: 8,
          //       },
          //     ],
          //   },
          // ],
        },
      ]

      // const res = await fetch(
      //   "http://172.168.70.114:8081/api/admin/basic-application/department/v1/tree"
      // ).then((res) => res.json());

      console.log('item', res[0])

      treeData.value = res

      loading.value = false
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

    console.log(findClosestConfig(100000))

    getData()

    const reset = () => {
      treeData.value = []
      getData()
    }

    const selectAll = () => {
      tableRef.value?.selectAll(true)
    }

    const expandAll = () => {
      tableRef.value?.expandAll()
    }

    const deleteRows = () => {}

    const expandLast = () => {
      // tableRef.value?.scrollToRow("6_4_3_4_5_1");
      tableRef.value?.scrollToRow('1_10')
    }

    const load = (rowData: any) => {
      console.log('load rowData', rowData)
      return new Promise((resolve) => {
        setTimeout(() => {
          if (rowData.id === '1') {
            resolve(
              Array.from({ length: 100 }).map((item, index) => ({
                id: `1_${index + 1}`,
                name: `1_${index + 1}`,
                depth: 1 + (index + 1),
                leaf: true,
                level: 2,
                path: `1/1_${index + 1}`,
                parentId: '1',
              }))
            )
          } else {
            resolve([])
          }
        }, 1000)
      })
    }

    return () =>
      loading.value ? (
        <div>loading.....</div>
      ) : (
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
            <Table
              ref={tableRef}
              rowKey="id"
              data={treeData.value}
              columns={columns.value}
              selection
              v-model:expandedRowKeys={expandedRowKeys.value}
              rowHeight={50}
              onRowExpand={handleRowExpand}
              load={load}
              expandColumnKey="name"
            />
          </div>
        </div>
      )
  },
})
