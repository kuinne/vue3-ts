import { ElButton } from "element-plus";
import { cloneDeep } from "lodash";
import { Ref, computed, ref } from "vue";

type Data<T> = T extends { id: string } ? T : never;
interface Options<T> {
  getAllId: (lastId?: string) => Promise<string[]>;

  total: Ref<number>;
}

export function useMultiPageSelect<T>({ getAllId, total }: Options<T>) {
  const loading = ref(false);
  const cachedSelectedIds = ref<string[]>([]);

  const currentIds = ref<string[]>([]);
  const currentSelectedNum = computed(
    () =>
      currentIds.value.filter((i) => cachedSelectedIds.value.includes(i)).length
  );

  const isSelectedAll = computed(
    () => total.value && currentSelectedNum.value === total.value
  );

  async function fetchAllIds() {
    loading.value = true;
    let currentTotal = 0;
    let lastId = "";
    const result: string[] = [];

    while (currentTotal < total.value) {
      try {
        const ids = await getAllId(lastId);

        result.push(...ids);
        lastId = ids[ids.length - 1];
        if (result.length >= total.value) {
          break;
        }
      } catch (error) {
        loading.value = false;
        return result;
      }
    }

    loading.value = false;
    return result;
  }

  async function getCurrentIds() {
    currentIds.value = await fetchAllIds();
  }

  function handleSelectAllToggle() {
    isSelectedAll.value ? unselectAll() : selectAll();
    async function selectAll() {
      const allIds = await fetchAllIds();
      cachedSelectedIds.value = [
        ...new Set([...cachedSelectedIds.value, ...allIds]),
      ];
    }

    function unselectAll() {
      cachedSelectedIds.value = cachedSelectedIds.value.filter(
        (i) => !currentIds.value.includes(i)
      );
    }
  }

  function handleSelect(id: string) {
    const isSelected = cachedSelectedIds.value.includes(id);
    isSelected ? unselect(id) : select(id);

    function select(id: string) {
      cachedSelectedIds.value.push(id);
    }

    function unselect(id: string) {
      const index = cachedSelectedIds.value.findIndex((i) => i === id);
      cachedSelectedIds.value.splice(index, 1);
    }
  }

  function isSelected(id: string) {
    return cachedSelectedIds.value.includes(id);
  }

  function clearCachedSelected() {
    cachedSelectedIds.value = [];
  }

  const render = () => (
    <div>
      <span>{`已选${currentSelectedNum.value}条数据，共${total.value}条`}</span>
      <ElButton
        type="text"
        onClick={handleSelectAllToggle}
        disabled={!total.value}
      >
        {isSelectedAll.value ? "取消全部" : "选择全部"}
      </ElButton>
    </div>
  );

  return {
    render,
    handleSelect,
    isSelected,
    loading,
    getCurrentIds,
    clearCachedSelected,
  };
}
