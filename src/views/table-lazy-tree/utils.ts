export function calculateMaxNodes(level: number, n: number) {
  let maxNodes = 0

  for (let i = 0; i <= level; i++) {
    maxNodes += Math.pow(n, i)
  }

  return maxNodes - 1
}

export function genTree(level: number, n: number, cb: (node: any) => any) {
  const fn = (l: number, parent?: any) => {
    return Array.from({ length: n }).map((item, index) => {
      const node: any = {
        id: `${parent?.id || ''}${index + 1}`,
        name: `${parent?.id || ''}${index + 1}`,
        level: l,
        leaf: l === level,
      }
      node.children = l === level ? [] : fn(l + 1, node)
      return {
        ...node,
        ...cb(node),
      }
    })
  }

  return fn(1, null)
}

export function findClosestConfig(targetNodes: number) {
  let closestNodes = 0
  let closestLevel = 0
  let closestN = 0

  // 遍历可能的 level 和 n 值，范围设置为合理的猜测
  for (let level = 1; level <= 10; level++) {
    for (let n = 2; n <= 10; n++) {
      let maxNodes = 0

      for (let i = 0; i <= level; i++) {
        maxNodes += Math.pow(n, i)
      }

      // 检查是否更接近目标节点数
      if (
        Math.abs(targetNodes - maxNodes) < Math.abs(targetNodes - closestNodes)
      ) {
        closestNodes = maxNodes
        closestLevel = level
        closestN = n
      }

      // 如果已精确匹配目标节点数，则返回
      if (closestNodes === targetNodes) {
        return { closestLevel, closestN, closestNodes }
      }
    }
  }

  return { closestLevel, closestN, closestNodes }
}
