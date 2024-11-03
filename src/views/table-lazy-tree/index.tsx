import { ElButton, ElInput } from "element-plus";
import { defineComponent, ref, computed } from "vue";
import { calculateMaxNodes, genTree } from "./utils";

import Table from "./Table";
import { TableInstanceType } from "./Table/type";
interface User {
  id: String;
  date: string;
  name: string;
  address: string;
  hasChildren?: boolean;
  children?: User[];
}

const level = 6;
const n = 6;

export default defineComponent({
  setup() {
    const tableRef = ref<TableInstanceType>();
    const treeData = ref<any[]>([]);

    const keyword = ref("");

    const expandedRowKeys = ref<string[]>([]);

    const columns = computed(() => [
      {
        dataKey: "name",
        key: "name",
        title: "name",
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
        dataKey: "date",
        key: "date",
        title: "date",
        width: 150,
      },
    ]);

    const getData = () => {
      treeData.value = [];
      let total = calculateMaxNodes(level, n);
      console.log("total", total);

      const res = genTree(level, n, (node) => ({
        ...node,
      }));

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
      treeData.value = res;
    };

    const handleRowExpand = ({
      expanded,
      rowKey,
    }: {
      expanded: boolean;
      rowKey: string;
    }) => {
      console.log("expanded", expanded, rowKey);
    };

    // console.log(findClosestConfig(5000));

    getData();

    const reset = () => {};

    const selectAll = () => {
      tableRef.value?.selectAll(true);
    };

    const expandAll = () => {
      tableRef.value?.expandAll();
    };

    const deleteRows = () => {};

    const expandLast = () => {
      tableRef.value?.scrollToRow("6_4_3_4_5_1");
    };

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
          <Table
            ref={tableRef}
            rowKey="id"
            data={treeData.value}
            columns={columns.value}
            selection
            v-model:expandedRowKeys={expandedRowKeys.value}
            rowHeight={50}
            onRowExpand={handleRowExpand}
          />
        </div>
      </div>
    );
  },
});
