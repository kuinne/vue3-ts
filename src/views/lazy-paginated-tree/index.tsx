import { defineComponent, ref } from "vue";
import { ElTree } from "element-plus";
import { genTreeMap, page } from "./utils";
import type Node from "element-plus/es/components/tree/src/model/node";
import styles from "./style.module.scss";
import { onMounted } from "vue";
type Data = {
  id: string;
  parentId: string | null;
  label: string;
  leaf: boolean;
  children: Data[];
  pageIndex: number;
};

const treeMap: Data[] = genTreeMap(
  { level: 3, num: 100, childrenKey: "children" },
  (data) => data
);

function getTree({
  parentId,
  pageIndex,
  pageSize,
}: {
  parentId?: string;
  pageIndex: number;
  pageSize: number;
}): Promise<{ data: Data[] }> {
  console.log("getTree", { parentId, pageIndex, pageSize });

  return new Promise((resolve) => {
    setTimeout(() => {
      if (!parentId || parentId === "0") {
        resolve({
          data: page(
            Object.values(treeMap).filter((i) => !i.parentId),
            pageIndex,
            pageSize
          ),
        });
      } else {
        resolve({
          data: page(
            treeMap[parentId as any]?.children || [],
            pageIndex,
            pageSize
          ),
        });
      }
    }, 300);
  });
}

const isTouchBottom = (e: any) => {
  const target = e.target!;
  const { scrollTop, scrollHeight, offsetHeight, clientHeight } = target;

  const touchOffset = 50;

  return scrollHeight - (scrollTop + clientHeight) <= touchOffset;
};

const rootNode: Data = {
  id: "0",
  parentId: null,
  leaf: false,
  label: "",
  children: [],
  pageIndex: 1,
};

export default defineComponent({
  setup() {
    const treeData = ref<Data[]>([]);

    const checkedData = ref<Data>();
    const loadData = async (
      parentId: string = rootNode.id,
      data: Data = rootNode,
      pageIndex: number = 1
    ) => {
      const res = await getTree({
        parentId,
        pageIndex,
        pageSize: 20,
      });
      console.log("res", res);

      if (parentId === rootNode.id) {
        treeData.value = res.data || [];
        checkedData.value = rootNode;
      } else {
        data.children = data.children.concat(res.data || []);
      }
      console.log("treeData", treeData.value.length);
    };

    onMounted(() => {
      loadData();
    });

    let scrollTimer: any;

    const handleScroll = (e: any) => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (isTouchBottom(e)) {
          if (!checkedData.value) return;
          checkedData.value.pageIndex += 1;
          loadData(
            checkedData.value?.id,
            checkedData.value,
            checkedData.value?.pageIndex
          );
        } else {
        }
      }, 300);
    };

    return () => (
      <div class={styles["tree-container"]} onScroll={handleScroll}>
        <ElTree props={{ isLeaf: "leaf" }} lazy data={treeData.value} />
      </div>
    );
  },
});
