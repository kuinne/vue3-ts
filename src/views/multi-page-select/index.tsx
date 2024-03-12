import { defineComponent, onMounted, ref } from "vue";
import { useMultiPageSelect } from "./hooks/useMultiPageSelect";
import {
  ElButton,
  ElCheckbox,
  ElInput,
  ElLoadingDirective,
  ElPagination,
} from "element-plus";
import { Close } from "@element-plus/icons-vue";

type Data = {
  id: string;
  name: string;
};

const mockData = Array.from({ length: 200 }).map((index, i) => ({
  id: i + "",
  name: i + "",
}));

const fetchData = ({
  name,
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
  name: string;
}) => {
  return new Promise<{ record: Data[]; total: number }>((resolve) => {
    setTimeout(() => {
      const _data = mockData.filter((i) => {
        if (name) {
          return i.name.includes(name);
        }
        return true;
      });
      resolve({
        record: _data.slice(
          (pageIndex - 1) * pageSize,
          (pageIndex - 1) * pageSize + pageSize
        ),
        total: _data.length,
      });
      console.log("mock fetchData:", {
        record: _data.slice(
          (pageIndex - 1) * pageSize,
          (pageIndex - 1) * pageSize + pageSize
        ),
        total: _data.length,
      });
    }, 300);
  });
};

const fetchAllIds = (name: string, lastId?: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const filterData = mockData.filter((i) => {
      if (name) {
        return i.name.includes(name);
      }
      return true;
    });
    setTimeout(() => {
      if (lastId) {
        const index = filterData.findIndex((i) => i.id === lastId);
        resolve(filterData.slice(index + 1, index + 1 + 100).map((i) => i.id));
      } else {
        resolve(filterData.slice(0, 100).map((i) => i.id));
      }
    }, 300);
  });
};

const deleteItem = (id: string) => {
  const index = mockData.findIndex((i) => i.id === id);
  if (index > -1) {
    mockData.splice(index, 1);
  }
};

const addItem = (payload: Data) => {
  mockData.unshift(payload);
};

export default defineComponent({
  setup() {
    const data = ref<Data[]>([]);
    const total = ref(0);
    const name = ref("");
    const pageIndex = ref(1);
    const pageSize = ref(10);

    const {
      isSelected,
      handleSelect,
      render: MultiPageSelect,
      loading,
      getCurrentIds,
      clearCachedSelected,
    } = useMultiPageSelect({
      total,
      getAllId(lastId) {
        return fetchAllIds(name.value, lastId);
      },
    });

    const getData = async () => {
      loading.value = true;
      const res = await fetchData({
        name: name.value,
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
      });

      data.value = res.record;
      total.value = res.total;
      if (pageIndex.value === 1) {
        await getCurrentIds();
      }
      loading.value = false;
    };
    const handleSearch = async () => {
      pageIndex.value = 1;
      await getData();
    };

    const handleCurrentChange = () => {
      getData();
    };

    const handleDelete = async (id: string) => {
      loading.value = true;
      await deleteItem(id);
      pageIndex.value = 1;
      name.value = "";
      clearCachedSelected();
      await getData();
      loading.value = false;
    };

    const handleAdd = async () => {
      loading.value = true;
      const id = Math.random().toString().substring(2, 8);
      await addItem({
        id,
        name: id,
      });
      pageIndex.value = 1;
      name.value = "";
      await getData();
      loading.value = false;
    };
    onMounted(() => {
      getData();
    });
    return () => (
      <div v-loading={loading.value}>
        <MultiPageSelect />
        <ElPagination
          total={total.value}
          v-model:pageSize={pageSize.value}
          v-model:currentPage={pageIndex.value}
          onCurrent-change={handleCurrentChange}
        ></ElPagination>
        <ElInput
          style="width: 200px"
          v-model={name.value}
          onChange={handleSearch}
          clearable
        ></ElInput>
        <ElButton onClick={handleAdd}>新增</ElButton>

        <div>
          {data.value.map((item) => (
            <div key={item.id}>
              <ElCheckbox
                modelValue={isSelected(item.id)}
                onChange={() => handleSelect(item.id)}
              >
                {" "}
                {item.name}
              </ElCheckbox>
              <ElButton
                icon={Close}
                size="small"
                circle
                onClick={() => handleDelete(item.id)}
              ></ElButton>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
