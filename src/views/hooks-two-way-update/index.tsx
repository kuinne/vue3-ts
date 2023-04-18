import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  Ref,
  ref,
  watch,
} from "vue";
import draggable from "vuedraggable";
import styles from "./style.module.scss";
import { ElTree, ElTable } from "element-plus";
import { cloneDeep } from "lodash";
import dayjs, { type Dayjs } from "dayjs";
const Draggable = defineComponent(draggable);

const sleep = () =>
  new Promise((r) =>
    setTimeout(() => {
      r("");
    }, 2000)
  );

const mockTableData = [
  {
    id: "1",
    name: "1",
  },
  {
    id: "1-1",
    name: "1-1",
  },
  {
    id: "1-1-1",
    name: "1-1-1",
  },
];

const mockTreeData = [
  {
    label: "1",
    id: "1",
    children: [
      {
        label: "1-1",
        id: "1-1",
        children: [
          {
            label: "1-1-1",
            id: "1-1-1",
          },
        ],
      },
    ],
  },
];

const mockFormData = {
  list: ["1-1-1", "1", "1-1"],
};

const useDatePicker = () => {
  const timeRange = ref<Date[]>([]);
  watch(timeRange, () => {
    console.log("timeRange", timeRange.value);
  });

  const DatePicker = () => (
    <el-date-picker v-model={timeRange.value} type="daterange" />
  );
  onMounted(async () => {
    await sleep();
    timeRange.value = [new Date(), new Date()];
  });
  return {
    timeRange,
    DatePicker,
  };
};

const useTree = () => {
  const elTreeRef = ref<InstanceType<typeof ElTree>>();
  const data = ref<any[]>([]);

  const defaultProps = {
    children: "children",
    label: "label",
  };

  const checkedKeys = ref<string[]>([]);

  const defaultCheckedKeys = ref<string[]>([]);

  const checkedNodes = ref<any[]>([]);

  const handleCheck = (
    data: any,
    { checkedKeys: _checkedKeys, checkedNodes: _checkedNodes }: any
  ) => {
    checkedKeys.value = _checkedKeys;
    checkedNodes.value = _checkedNodes;
  };

  const Tree = () => (
    <el-tree
      ref={elTreeRef}
      data={data.value}
      props={defaultProps}
      showCheckbox
      default-expand-all
      check-strictly
      nodeKey="id"
      defaultCheckedKeys={defaultCheckedKeys.value}
      onCheck={handleCheck}
    />
  );

  const fetchData = async () => {
    await sleep();
    data.value = mockTreeData;
    checkedKeys.value = defaultCheckedKeys.value = [mockTreeData[0].id];
    checkedNodes.value = [mockTreeData[0]];
  };

  onMounted(() => {
    fetchData();
  });

  return {
    Tree,
    checkedKeys,
  };
};

const useTable = ({
  filterKeys,
  defaultSelectionKeys,
  timeRange,
}: {
  filterKeys: Ref<string[]>;
  defaultSelectionKeys: Ref<string[]>;
  timeRange: Ref<Date[]>;
}) => {
  const elTableRef = ref<InstanceType<typeof ElTable>>();
  const data = ref<any[]>([]);

  const selectionRows = ref<any[]>([]);

  const handleSelectionChange = (val: any[]) => {
    selectionRows.value = val;
  };

  const setSelectionRows = () => {
    const defaultSelectionRows = defaultSelectionKeys.value
      .map((key) => data.value.find((item) => item.id === key))
      .filter((item) => !!item);

    defaultSelectionRows.forEach((row) =>
      elTableRef?.value?.toggleRowSelection(row, true)
    );
  };

  const fetchData = async () => {
    console.log("=============fetch table data===============");

    await sleep();
    if (filterKeys.value.length === 0) {
      data.value = mockTableData;
    } else {
      data.value = mockTableData.filter((item) =>
        filterKeys.value.includes(item.id)
      );
    }
  };

  const init = async () => {
    await fetchData();
    nextTick(() => {
      setSelectionRows();
    });
  };

  const Table = () => (
    <el-table
      ref={elTableRef}
      data={data.value}
      onSelectionChange={handleSelectionChange}
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="name" />
    </el-table>
  );

  watch([filterKeys, timeRange], (val, oldVal) => {
    if (timeRange.value.length > 0 && filterKeys.value.length > 0) {
      fetchData();
    }
  });

  watch(
    () => defaultSelectionKeys.value,
    () => {
      // init();
    }
  );

  return {
    Table,
    selectionRows,
  };
};

const useList = ({ list }: { list: Ref<any[]> }) => {
  const data = ref<any[]>([]);

  const sort = () => {
    const old = data.value;
    list.value.sort((a, b) => {
      const aIndex = old.findIndex((item) => item.id === a.id);
      const bIndex = old.findIndex((item) => item.id === b.id);
      if (aIndex > -1 && bIndex > -1) {
        return aIndex - bIndex;
      } else if (aIndex > -1) {
        return -1;
      } else {
        return 1;
      }
    });
    return list.value;
  };

  watch(
    () => list.value,
    () => {
      data.value = sort();
    },
    {
      immediate: true,
    }
  );

  const List = () => (
    <Draggable v-model={data.value} ghost-class={styles["ghost"]}>
      {{
        item: ({ element }: any) => (
          <div class={styles["list-group-item"]}>{element.name}</div>
        ),
      }}
    </Draggable>
  );

  return {
    List,
    orderedList: data,
  };
};

const videos = [
  {
    device: {},
    timeRange: [],
    playState: {
      paused: false,
      speed: 1,
    },
  },
];

const currentIndex = 1;

const replace = (newDevice) => {
  const old = videos[currentIndex];
  if (old) {
    old.device = newDevice;
  } else {
    videos[currentIndex] = {
      device: newDevice,
      timeRange: [],
      playState: {
        paused: false,
        speed: 1,
      },
    };
  }
};

export default defineComponent({
  name: "TreeTableList",
  setup() {
    const formData = ref<any>({
      list: [],
    });

    const { DatePicker, timeRange } = useDatePicker();

    const { Tree, checkedKeys } = useTree();
    const { Table, selectionRows } = useTable({
      filterKeys: checkedKeys,
      defaultSelectionKeys: computed(() => formData.value.list),
      timeRange,
    });
    const { List, orderedList } = useList({
      list: selectionRows,
    });

    setTimeout(() => {
      formData.value = cloneDeep(mockFormData);
    }, 1000);
    return () => (
      <div class={styles["container"]}>
        <DatePicker />
        <Tree />
        <Table />
        <List />
      </div>
    );
  },
});
