import {
  ElTableV2,
  ElCheckbox,
  ElAutoResizer,
  Column,
  CheckboxValueType,
  RowSlotProps,
} from "element-plus";
import {
  FunctionalComponent,
  PropType,
  computed,
  defineComponent,
  nextTick,
  ref,
  watch,
} from "vue";
import { useVModel } from "@vueuse/core";
import { getNodeAndDescendantIdsFromMap, flattenTreeToMap } from "./utils.js";

import styles from "./style.module.scss";

type SelectionCellProps = {
  value: boolean;
  intermediate?: boolean;
  onChange: (value: CheckboxValueType) => void;
};

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

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
    <path
      fill="currentColor"
      d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
    ></path>
  </svg>
);

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: "id",
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
  },
  emits: ["update:expandedRowKeys"],
  setup(props, { emit, expose, attrs }) {
    const elTableRef = ref<InstanceType<typeof ElTableV2>>();
    const data = useVModel(props, "data", emit);
    const expandedRowKeys = useVModel(props, "expandedRowKeys", emit);
    const selectedKeys = ref<Set<string>>(new Set([]));
    let flattenTreeMap: Map<string, any> = new Map();
    let allKeys: string[] = [];
    let loadingKeys = ref<Set<string>>(new Set([]));

    watch(
      data,
      () => {
        console.time();
        flattenTreeMap = flattenTreeToMap(data.value);
        allKeys = Array.from(flattenTreeMap.keys());
        console.timeEnd();
      },
      {
        immediate: true,
      }
    );

    const SelectionColumn = computed(() => ({
      key: "selection",
      width: 50,
      cellRenderer: ({ rowData }) => {
        const onChange = (value: CheckboxValueType) => {
          select(rowData, value);
        };
        return (
          <SelectionCell
            value={!!selectedKeys.value.has(rowData[props.rowKey])}
            onChange={onChange}
          />
        );
      },

      headerCellRenderer: () => {
        const onChange = (value: CheckboxValueType) => {
          selectAll(value);
        };

        const allSelected =
          !!(allKeys.length === selectedKeys.value.size) &&
          selectedKeys.value.size > 0;
        const containsChecked = selectedKeys.value.size > 0;

        return (
          <SelectionCell
            value={allSelected}
            intermediate={containsChecked && !allSelected}
            onChange={onChange}
          />
        );
      },
    }));

    const columns = computed(() => {
      const res = [];
      if (props.selection) {
        res.push(SelectionColumn.value);
      }
      res.push(...props.columns);
      return res;
    });

    const select = (row: any, checked: boolean) => {
      let keys: string[] = [];
      if (props.checkStrictly) {
        keys = [row[props.rowKey]] as string[];
      } else {
        keys = getNodeAndDescendantIdsFromMap(
          flattenTreeMap,
          row[props.rowKey]
        );
      }
      if (checked) {
        keys.forEach((key) => {
          selectedKeys.value.add(key);
        });
      } else {
        keys.forEach((key) => {
          selectedKeys.value.delete(key);
        });
      }
    };

    const selectAll = (checked: boolean) => {
      if (checked) {
        allKeys.forEach((key) => {
          selectedKeys.value.add(key);
        });
      } else {
        allKeys.forEach((key) => {
          selectedKeys.value.delete(key);
        });
      }
    };
    const scrollToRow = async (targetKey: string) => {
      let rowHeight = props.rowHeight;
      if (!rowHeight) return;
      let path = flattenTreeMap.get(targetKey).path.split("/");

      expandedRowKeys.value = [
        ...new Set([
          ...expandedRowKeys.value,
          ...path.slice(0, path.length - 1),
        ]),
      ];

      await nextTick();

      const target = flattenTreeMap.get(targetKey);
      const expandedRowKeysSet = new Set(expandedRowKeys.value);

      const isVisible = (node: any) => {
        return node.level === 1 || expandedRowKeysSet.has(node.parentId);
      };
      const visibleNodes = Array.from(flattenTreeMap.values()).filter(
        (i) => isVisible(i) && i.depth < target.depth
      );

      const scrollTop = visibleNodes.length * rowHeight;

      elTableRef.value?.scrollToTop(scrollTop);
    };

    const load = async (rowData: any) => {
      if (props.load && !rowData.children?.length) {
        loadingKeys.value.add(rowData[props.rowKey]);
        if (!rowData.children) {
          rowData.children = [];
        }
        const res = await props.load(rowData);
        rowData.children.push(...res);

        flattenTreeMap = flattenTreeToMap(data.value, "id", "children");

        loadingKeys.value.delete(rowData[props.rowKey]);
      }
    };

    const expand = (rowData: any, expanded: boolean) => {
      if (expanded) {
        expandedRowKeys.value.push(rowData[props.rowKey]);
        load(rowData);
      } else {
        const index = expandedRowKeys.value.findIndex(
          (i) => i === rowData[props.rowKey]
        );

        if (index > -1) {
          expandedRowKeys.value.splice(index, 1);
        }
      }
    };

    const expandAll = () => {
      console.log("expandAll", allKeys);

      expandedRowKeys.value = allKeys;
    };

    const handleRowDbclick = (rowData: any) => {
      console.log("handleRowDbclick", rowData);
    };

    expose({
      elTableRef,
      scrollToRow,
      expandAll,
      selectAll,
    });

    return () => (
      <ElAutoResizer>
        {{
          default: ({ height, width }: any) => (
            <ElTableV2
              ref={elTableRef}
              {...attrs}
              columns={columns.value}
              data={data.value}
              rowKey={props.rowKey}
              width={width}
              height={height}
              expandColumnKey="name"
              v-model:expandedRowKeys={expandedRowKeys.value}
            >
              {{
                row: ({
                  columns,
                  rowData,
                  data,
                  columnIndex,
                  rowIndex,
                }: RowSlotProps) => {
                  return (
                    <div
                      style={{ display: "flex" }}
                      onDblclick={() => {
                        handleRowDbclick(rowData);
                      }}
                    >
                      {columns.map((column) => {
                        if (column.key === "selection") {
                          return (
                            <div style={{ width: `${column.width}px` }}>
                              {column.cellRenderer({ rowData })}
                            </div>
                          );
                        }
                        if (column.key === "name") {
                          return (
                            <div
                              style={{
                                width: `${column.width}px`,
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: `${rowData.level * 5}px`,
                              }}
                            >
                              <div style="width: 20px">
                                {loadingKeys.value.has(
                                  rowData[props.rowKey]
                                ) ? (
                                  <el-icon class={styles["is-loading"]}>
                                    <LoadingIcon />
                                  </el-icon>
                                ) : expandedRowKeys.value.includes(
                                    rowData[props.rowKey]
                                  ) && !rowData.leaf ? (
                                  <el-icon
                                    onClick={() => {
                                      expand(rowData, false);
                                    }}
                                  >
                                    <ArrowDown />
                                  </el-icon>
                                ) : rowData.leaf ? null : (
                                  <el-icon
                                    onClick={() => {
                                      expand(rowData, true);
                                    }}
                                  >
                                    <ArrowRight />
                                  </el-icon>
                                )}
                              </div>

                              {rowData[column.dataKey]}
                            </div>
                          );
                        }
                        return (
                          <div style={{ width: `${column.width}px` }}>
                            {rowData[column.dataKey]}
                          </div>
                        );
                      })}
                    </div>
                  );
                },
              }}
            </ElTableV2>
          ),
        }}
      </ElAutoResizer>
    );
  },
});
