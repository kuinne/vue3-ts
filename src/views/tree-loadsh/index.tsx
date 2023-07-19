import { defineComponent } from "vue";
import { filter, find, foreach, map, toArray } from "./lib";
import type { Tree } from "./lib/types";

export default defineComponent({
  setup() {
    const tree: Tree<"child"> = {
      id: "1",
      child: [
        {
          id: "1-1",
          child: [
            {
              id: "1-1-1",
            },
          ],
        },
        {
          id: "1-2",
          child: [
            {
              id: "1-2-1",
            },
          ],
        },
      ],
    };
    console.groupCollapsed("foreach");
    foreach(
      tree,
      (treeItem, { parents, depth }) => {
        console.log("treeItem", treeItem, parents, depth);
      },
      {
        childrenKey: "child",
        strategy: "post",
      }
    );
    console.groupEnd();

    console.groupCollapsed("map");
    const mapRes = map(
      tree,
      (treeItem, { parents, depth }) => {
        return {
          ...treeItem,
          name: treeItem.id,
        };
      },
      {
        childrenKey: "child",
        strategy: "breadth",
      }
    );
    console.log("mapRes", mapRes);

    console.groupEnd();

    console.groupCollapsed("filter");
    const filterRes = filter(
      tree,
      (treeItem, { parents, depth }) => {
        return !treeItem.id.includes("2");
      },
      {
        childrenKey: "child",
        strategy: "breadth",
      }
    );
    console.log("filterRes", filterRes);

    console.groupEnd();

    console.groupCollapsed("find");
    const findRes = find(
      tree,
      (treeItem, { parents, depth }) => {
        return treeItem.id === "1-1";
      },
      {
        childrenKey: "child",
        strategy: "post",
      }
    );
    console.log("findRes", findRes);

    console.groupEnd();

    console.groupCollapsed("toArray");
    const toArrayRes = toArray(tree, {
      childrenKey: "child",
      strategy: "post",
    });

    console.log("toArrayRes", toArrayRes);
    console.groupEnd();
    return () => <div></div>;
  },
});
