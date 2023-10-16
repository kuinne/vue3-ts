import type { BaseCallbackMeta, BaseOptions, ChildrenKey, Tree } from "./types";

export type FindOptions<T extends ChildrenKey> = BaseOptions<T>;

export type FindCallbackMeta<T extends ChildrenKey> = BaseCallbackMeta<T>;

export type FindCallback<T extends ChildrenKey> = (
  treeItem: Tree<T>,
  meta: FindCallbackMeta<T>
) => any;

type FindInnerOption<T extends ChildrenKey> = {
  childrenKey: ChildrenKey;
  parents: Tree<T>[];
  depth: number;
};

type FindImpl<T extends ChildrenKey> = (
  treeItem: Tree<T>,
  callback: FindCallback<T>,
  options: FindInnerOption<T>
) => Tree<T> | undefined;

// 前置遍历
const preImpl: FindImpl<ChildrenKey> = (treeItem, callback, options) => {
  const res = callback(treeItem, options);
  if (res) {
    return treeItem;
  }
  const children = treeItem[options.childrenKey];
  if (!children || !Array.isArray(children)) {
    return undefined;
  }

  if (children && Array.isArray(children)) {
    return children.find((childItem) => {
      return preImpl(childItem, callback, {
        ...options,
        parents: [...options.parents, treeItem],
        depth: options.depth + 1,
      });
    });
  }
};

// 后置遍历
const postImpl: FindImpl<ChildrenKey> = (treeItem, callback, options) => {
  const children = treeItem[options.childrenKey];

  if (children && Array.isArray(children)) {
    const findOne = children.find((childItem) => {
      return postImpl(childItem, callback, {
        ...options,
        parents: [...options.parents, treeItem],
        depth: options.depth + 1,
      });
    });

    if (findOne) return findOne;
  }
  const res = callback(treeItem, options);
  if (res) {
    return treeItem;
  }
  return undefined;
};

type QueueItem = {
  tree: Tree<ChildrenKey>;
  options: FindInnerOption<ChildrenKey>;
};

function genNewNoChildrenNode<T extends ChildrenKey>(
  node: Tree<T>,
  childrenKey: T
) {
  const newNode = {
    ...node,
  };
  delete newNode[childrenKey];
  return newNode;
}

// 广度优先遍历
const breadthImpl: FindImpl<ChildrenKey> = (treeItem, callback, options) => {
  const queue: QueueItem[] = [
    {
      tree: treeItem,
      options,
    },
  ];

  const runQueue = (): Tree<ChildrenKey> | undefined => {
    if (queue.length === 0) {
      return undefined;
    }
    const queueItem = queue.shift() as QueueItem;
    const treeItem = queueItem.tree;
    if (
      treeItem[options.childrenKey] &&
      Array.isArray(treeItem[options.childrenKey])
    ) {
      const subQueueItems = treeItem[options.childrenKey].map(
        (subTree: Tree) => ({
          tree: subTree,
          options: {
            ...queueItem.options,
            parents: [...queueItem.options.parents, treeItem],
            depth: queueItem.options.depth + 1,
          },
        })
      );
      queue.push(...subQueueItems);
    }

    const res = callback(treeItem, queueItem.options);
    if (res) {
      return treeItem;
    }
    return runQueue();
  };
  return runQueue();
};

const strategies = {
  pre: preImpl,
  post: postImpl,
  breadth: breadthImpl,
};

function find<T extends ChildrenKey>(
  tree: Tree<T> | Tree<T>[],
  callback: FindCallback<T>,
  options?: FindOptions<T>
): Tree<T> | undefined {
  const childrenKey = options?.childrenKey ?? "children";
  const strategy = options?.strategy ?? "pre";
  const isForest = Array.isArray(tree);
  const method = strategies[strategy];
  const innerOptions = {
    childrenKey,
    depth: 0,
    parents: [] as Tree[],
  };
  return isForest
    ? tree.find((tree) => {
        return method(tree, callback, innerOptions);
      })
    : method(tree, callback, innerOptions);
}

export default find;
