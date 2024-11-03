import {
  ElTableV2,
  ElCheckbox,
  ElAutoResizer,
  Column,
  CheckboxValueType,
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
  },
  emits: ["update:expandedRowKeys"],
  setup(props, { emit, expose, attrs }) {
    const elTableRef = ref<InstanceType<typeof ElTableV2>>();
    const data = useVModel(props, "data", emit);
    const expandedRowKeys = useVModel(props, "expandedRowKeys", emit);
    const selectedKeys = ref<Set<string>>(new Set([]));
    let flattenTreeMap: Map<string, any> = new Map();
    let allKeys: string[] = [];

    watch(
      data,
      () => {
        flattenTreeMap = flattenTreeToMap(data.value);
        allKeys = Array.from(flattenTreeMap.keys());
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

    const expandAll = () => {
      console.log("expandAll", allKeys);

      expandedRowKeys.value = allKeys;
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
            ></ElTableV2>
          ),
        }}
      </ElAutoResizer>
    );
  },
});
