export function flattenTree(tree: any[], childrenKey = "children") {
  const result = [];
  const stack = tree.slice(0);

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node);

    // Check for children and push them onto the stack in reverse order
    if (node[childrenKey]) {
      stack.push(...node[childrenKey].reverse());
    }
  }

  return result;
}
export function flattenTreeToMap<T = any>(
  tree: T[],
  idKey = "id",
  childrenKey = "children"
) {
  const resultMap = new Map(); // 创建一个 Map 存储结果
  const stack = [...tree].reverse(); // 初始化栈
  let depth = 0;

  while (stack.length > 0) {
    const node = stack.pop(); // 弹出栈顶节点和深度

    if (node) {
      // 给节点增加 d 属性
      node.depth = depth++;
      //   console.log('zz', node.id, node.d)
      resultMap.set(node[idKey], node); // 将节点添加到结果 Map

      // 将子节点反向推入栈中，并递增深度
      if (node[childrenKey]) {
        for (let i = node[childrenKey].length - 1; i >= 0; i--) {
          stack.push(node[childrenKey][i]);
        }
      }
    }
  }

  return resultMap;
}

export function getNodeAndDescendantIdsFromFlat(
  flatTree: any[],
  targetId: string,
  idKey = "id",
  parentIdKey = "parentId"
) {
  // Step 1: Build a map of parentId -> child nodes
  const parentMap = new Map();

  for (const node of flatTree) {
    const parentId = node[parentIdKey];
    if (!parentMap.has(parentId)) {
      parentMap.set(parentId, []);
    }
    parentMap.get(parentId).push(node[idKey]);
  }

  // Step 2: Collect target node and descendants using BFS
  const result = [];
  const queue = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    result.push(currentId);

    // Add children of the current node to the queue
    if (parentMap.has(currentId)) {
      queue.push(...parentMap.get(currentId));
    }
  }

  return result;
}

export function getNodeAndDescendantIdsFromMap(
  flatTreeMap: Map<string, any>,
  targetId: string,
  idKey = "id",
  parentIdKey = "parentId"
) {
  // Step 1: Build a parent-child map from the Map-based flat tree
  const parentMap = new Map();

  for (const [nodeId, node] of flatTreeMap.entries()) {
    const parentId = node[parentIdKey];
    if (!parentMap.has(parentId)) {
      parentMap.set(parentId, []);
    }
    parentMap.get(parentId).push(nodeId);
  }

  // Step 2: Collect target node and descendants using BFS
  const result: string[] = [];
  const queue = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift() as string;
    result.push(currentId);

    // Add children of the current node to the queue
    if (parentMap.has(currentId)) {
      queue.push(...parentMap.get(currentId));
    }
  }

  return result;
}

export function getPathToRootFromArray(
  flatTree: any[],
  targetId: string,
  idKey = "id",
  parentIdKey = "parentId"
) {
  // Step 1: Build a Map for quick lookup of nodes by id
  const nodeMap = new Map(flatTree.map((node) => [node[idKey], node]));

  // Step 2: Collect path from target node to the root
  const path = [];
  let currentId = targetId;

  while (nodeMap.has(currentId)) {
    const node = nodeMap.get(currentId);
    path.push(node[idKey]);

    // Move up to the parent node
    currentId = node[parentIdKey];

    // Stop if we've reached a root node (parentId is null or undefined)
    if (currentId == null) break;
  }

  return path;
}

export function getPathToRootFromMap(
  flatTreeMap: Map<string, any>,
  targetId: string,
  idKey = "id",
  parentIdKey = "parentId"
) {
  const path = [];
  let currentId = targetId;

  while (flatTreeMap.has(currentId)) {
    const node = flatTreeMap.get(currentId);
    path.push(node[idKey]);

    // Move up to the parent node
    currentId = node[parentIdKey];

    // Stop if we've reached a root node (parentId is null or undefined)
    if (currentId == null) break;
  }

  return path;
}
