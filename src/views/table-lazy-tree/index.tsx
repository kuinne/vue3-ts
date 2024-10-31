import {
  ElTable,
  ElTableV2,
  ElTableColumn,
  ElTree,
  ElCheckbox,
  ElAutoResizer,
  ElButton,
  ElInput,
} from "element-plus";
import { defineComponent, ref, unref, computed, watch } from "vue";
import {
  calculateMaxNodes,
  findClosestConfig,
  genTree,
  treeToList,
} from "./utils";
import { FunctionalComponent, nextTick } from "vue";

import type { CheckboxValueType, Column } from "element-plus";
interface User {
  id: String;
  date: string;
  name: string;
  address: string;
  hasChildren?: boolean;
  children?: User[];
}

type SelectionCellProps = {
  value: boolean;
  intermediate?: boolean;
  onChange: (value: CheckboxValueType) => void;
};

const level = 6;
const n = 6;

const checkStrictly = true;

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
  );
};

export default defineComponent({
  setup() {
    const tableRef = ref<any>();
    const data = ref<any[]>([]);
    const keyword = ref("");
    // const selectionIds.value = ref<string[]>([]);
    const selectionIds = ref<string[]>([]);

    let allIds: string[] = [];

    const expandedRowKeys = ref<string[]>([]);

    watch(
      expandedRowKeys,
      () => {
        console.log("expandedRowKeys", expandedRowKeys.value);
      },
      {
        deep: true,
      }
    );

    watch(
      selectionIds.value,
      () => {
        console.log("selectionIds.value", selectionIds.value);
      },
      {
        deep: true,
      }
    );

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
              date: "2016-05-02",
              name: `${row.name} - ${index + 1}`,
              address: "No. 189, Grove St, Los Angeles",
              hasChildren: index % 2 === 0,
            }))
        );
      }, 1000);
    };

    const deepChecked = (row: any, checked: boolean) => {
      row.checked = checked;
      if (checked) {
        if (!selectionIds.value.includes(row.id)) {
          selectionIds.value.push(row.id);
        }
      } else {
        const index = selectionIds.value.findIndex((i) => i === row.id);

        if (index > -1) {
          selectionIds.value.splice(index, 1);
        }
      }

      if (!checkStrictly) return;

      for (let item of row.children || []) {
        deepChecked(item, checked);
      }
    };

    const isAllChecked = (list: any[]): boolean => {
      return list.every(
        (i) => selectionIds.value.includes(i.id) && isAllChecked(i.children)
      );
    };

    const columns = computed(() => [
      {
        key: "selection",
        width: 50,
        cellRenderer: ({ rowData }) => {
          const onChange = (value: CheckboxValueType) => {
            deepChecked(rowData, value);
          };
          return <SelectionCell value={rowData.checked} onChange={onChange} />;
        },

        headerCellRenderer: () => {
          const onChange = (value: CheckboxValueType) => {
            data.value.map((i) => deepChecked(i, value));
          };
          const allSelected = isAllChecked(data.value);
          const containsChecked = selectionIds.value.length > 0;

          return (
            <SelectionCell
              value={allSelected}
              intermediate={containsChecked && !allSelected}
              onChange={onChange}
            />
          );
        },
      },
      {
        dataKey: "name",
        key: "name",
        title: "name",
        width: 150,
        // cellRenderer: ({ rowData }) => {
        //   return (
        //     <div>
        //       {!rowData.leaf ? (
        //         <el-icon>
        //           <ArrowRight />
        //         </el-icon>
        //       ) : null}
        //       {rowData.name}
        //     </div>
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
      data.value = [];
      let total = calculateMaxNodes(level, n);
      console.log("total", total);

      // if (total >= 600) return;
      data.value = genTree(level, n, (node) => ({
        ...node,
        leaf: false,
      }));
      allIds = treeToList(data.value).map((i) => i.id);
      // console.log("data", data.value);
    };

    const handleSelectionChange = (selections: User[]) => {
      // selectionRows.value = selections;
      // console.log("selectionRows", selectionRows.value.length);
    };

    const handleRowExpand = (expanded: boolean, rowKey: string) => {
      console.log("expanded", expanded, rowKey);
    };

    // console.log(calculateMaxNodes(level, n))

    console.log(findClosestConfig(5000));

    getData();

    const reset = () => {};

    const expandAll = () => {
      expandedRowKeys.value = allIds;
    };
    const selectAll = () => {};

    const deleteRows = () => {};

    const expandLast = () => {
      expandedRowKeys.value = ["1", "11", "111", "1118"];
      // console.log("tableRef", tableRef.value?.scrollToRow);
      nextTick(() => {
        tableRef.value?.scrollToRow("1118");
      });
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
          {/* <ElTable
          data={data.value}
          rowKey="id"
          // lazy
          // load={load}
          treeProps={{
            children: "children",
            hasChildren: "leaf",
            checkStrictly: false,
          }}
          height="100%"
          onSelectionChange={handleSelectionChange}
        >
          <ElTableColumn type="selection" width="55" />

          <ElTableColumn type="expand">
            {{
              default: (props: any) => <div>ssss</div>,
            }}
          </ElTableColumn>
          <ElTableColumn prop="name" label="Name" />
          <ElTableColumn prop="date" label="Date" />

          <ElTableColumn prop="address" label="Address" />
        </ElTable>
        <ElTree data={data.value} /> */}
          <ElAutoResizer>
            {{
              default: ({ height, width }: any) => (
                <ElTableV2
                  ref={tableRef}
                  columns={columns.value}
                  data={data.value}
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
    );
  },
});
