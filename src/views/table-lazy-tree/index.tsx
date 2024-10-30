import { ElTable, ElTableV2, ElTableColumn, ElTree } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { calculateMaxNodes, findClosestConfig, genTree } from './utils'

interface User {
  id: String
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

const level = 3
const n = 6

export default defineComponent({
  setup() {
    const data = ref<any[]>([])

    const selectionRows = ref<User[]>([])

    const load = (
      row: User,
      treeNode: unknown,
      resolve: (data: User[]) => void
    ) => {
      setTimeout(() => {
        resolve(
          Array.from({ length: 10 })
            .fill(0)
            .map((item, index) => ({
              id: `${row.id}-${index + 1}`,
              date: '2016-05-02',
              name: `${row.name} - ${index + 1}`,
              address: 'No. 189, Grove St, Los Angeles',
              hasChildren: index % 2 === 0,
            }))
        )
      }, 1000)
    }

    const columns = ref([{}])

    const getData = () => {
      data.value = []
      let total = calculateMaxNodes(level, n)
      console.log('total', total)

      if (total >= 600) return
      data.value = genTree(level, n, (node) => node)
    }

    const handleSelectionChange = (selections: User[]) => {
      selectionRows.value = selections

      console.log('selectionRows', selectionRows.value.length)
    }

    // console.log(calculateMaxNodes(level, n))

    console.log(findClosestConfig(300))

    getData()

    return () => (
      <div style="height: 500px">
        <ElTable
          data={data.value}
          rowKey="id"
          // lazy
          // load={load}
          treeProps={{
            children: 'children',
            hasChildren: 'leaf',
            checkStrictly: false,
          }}
          height="100%"
          onSelectionChange={handleSelectionChange}
        >
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn prop="name" label="Name" />
          <ElTableColumn prop="date" label="Date" />

          <ElTableColumn prop="address" label="Address" />
        </ElTable>
        <ElTree data={data.value} />
        {/* <ElTableV2
          data={data.value}
          rowKey="id"
          height={400}
        >
        </ElTableV2> */}
      </div>
    )
  },
})
