import type { BaseCallbackMeta, BaseOptions, ChildrenKey, Tree } from "./types";

export type FilterOptions<T extends ChildrenKey> = BaseOptions<T>;

export type FilterCallbackMeta<T extends ChildrenKey> = BaseCallbackMeta<T>;

export type FilterCallback<T extends ChildrenKey> = (
  treeItem: Tree<T>,
  meta: FilterCallbackMeta<T>
) => any;

type FilterInnerOption<T extends ChildrenKey> = {
  childrenKey: ChildrenKey;
  parents: Tree<T>[];
  depth: number;
};

type FilterImpl<T extends ChildrenKey> = (
  treeItem: Tree<T>,
  callback: FilterCallback<T>,
  options: FilterInnerOption<T>
) => Tree<T> | undefined;

// 前置遍历
const preImpl: FilterImpl<ChildrenKey> = (treeItem, callback, options) => {
  const res = callback(treeItem, options);
  if (!res) {
    return undefined;
  }
  const children = treeItem[options.childrenKey];
  let newChildren;
  if (children && Array.isArray(children)) {
    newChildren = children
      .map((childItem) => {
        return preImpl(childItem, callback, {
          ...options,
          parents: [...options.parents, treeItem],
          depth: options.depth + 1,
        });
      })
      .filter((t) => !!t);
  }
  return {
    ...treeItem,
    [options.childrenKey]: newChildren,
  };
};

// 后置遍历
const postImpl: FilterImpl<ChildrenKey> = (treeItem, callback, options) => {
  const children = treeItem[options.childrenKey];
  let newChildren;
  if (children && Array.isArray(children)) {
    newChildren = children
      .map((childItem) => {
        return postImpl(childItem, callback, {
          ...options,
          parents: [...options.parents, treeItem],
          depth: options.depth + 1,
        });
      })
      .filter((t) => !!t);
  }
  const res = callback(treeItem, options);
  if (!res) {
    return undefined;
  }
  return {
    ...treeItem,
    [options.childrenKey]: newChildren,
  };
};

type QueueItem = {
  tree: Tree<ChildrenKey>;
  options: FilterInnerOption<ChildrenKey>;
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
const breadthImpl: FilterImpl<ChildrenKey> = (treeItem, callback, options) => {
  const queue: QueueItem[] = [
    {
      tree: treeItem,
      options,
    },
  ];
  let result: Tree<ChildrenKey>;
  const resultCache = new WeakMap<any, boolean>();
  const newNodeCache = new WeakMap<any, Tree<ChildrenKey>>();
  const runQueue = (): Tree<ChildrenKey> | undefined => {
    if (queue.length === 0) {
      return result;
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
    const parent =
      queueItem.options.parents.length > 0
        ? queueItem.options.parents[queueItem.options.parents.length - 1]
        : undefined;
    const isTopNode = queueItem.options.depth === 0;
    const parentResult = parent && resultCache.get(parent);

    if (!isTopNode && !parentResult) {
      return runQueue();
    }
    const callbackResult = callback(treeItem, queueItem.options);
    if (isTopNode && !callbackResult) {
      return undefined;
    }
    let newNode = genNewNoChildrenNode(treeItem, queueItem.options.childrenKey);
    if (isTopNode) {
      result = newNode;
    }
    resultCache.set(queueItem.tree, callbackResult);
    newNodeCache.set(queueItem.tree, newNode);
    if (callbackResult) {
      const parentNewNode = newNodeCache.get(parent);
      if (parentNewNode && !parentNewNode[queueItem.options.childrenKey]) {
        parentNewNode[queueItem.options.childrenKey] = [];
      }
      parentNewNode?.[queueItem.options.childrenKey]?.push?.(newNode);
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

function filter<T extends ChildrenKey>(
  tree: Tree<T>,
  callback: FilterCallback<T>,
  options?: FilterOptions<T>
): Tree<T>;
function filter<T extends ChildrenKey>(
  tree: Tree<T>[],
  callback: FilterCallback<T>,
  options?: FilterOptions<T>
): Tree<T>[];
function filter<T extends ChildrenKey>(
  tree: Tree<T> | Tree<T>[],
  callback: FilterCallback<T>,
  options: FilterOptions<T> = {}
): Tree<T> | Tree<T>[] | undefined {
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
    ? (tree
        .map((tree) => {
          return method(tree, callback, innerOptions);
        })
        .filter((t) => !!t) as Tree<T>[])
    : method(tree, callback, innerOptions);
}

export default filter;
