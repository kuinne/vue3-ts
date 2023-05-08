export class TreeNode {
  key: PropertyKey
  value: any
  parent: TreeNode | null
  children: TreeNode[]
  constructor(key: PropertyKey, value = key, parent: TreeNode | null = null) {
    this.key = key
    this.value = value
    this.parent = parent
    this.children = []
  }

  get level(): number {
    if (this.parent) return this.parent.level + 1
    return 0
  }

  get isLeaf() {
    return this.children.length === 0
  }

  get hasChildren() {
    return !this.isLeaf
  }

  get isRoot() {
    return !this.parent
  }

  get path() {
    const path: TreeNode[] = []
    ;(function addToPath(node: TreeNode) {
      path.unshift(node)
      if (!node.isRoot) {
        addToPath(node.parent!)
      }
    })(this)
    return path
  }

  get index() {
    if (this.isRoot) {
      return 0
    }
    return this.parent?.children.indexOf(this)
  }

  get nextSibling(): TreeNode | null {
    const parent = this.parent
    if (parent) {
      const index = parent.children.indexOf(this)
      if (index > -1) {
        return parent.children[index + 1]
      }
    }
    return null
  }

  get previousSibling(): TreeNode | null {
    const parent = this.parent
    if (parent) {
      const index = parent.children.indexOf(this)
      if (index > -1) {
        return index > 0 ? parent.children[index - 1] : null
      }
    }
    return null
  }

  appendChild(node: TreeNode) {
    this.children.push(node)
  }

  insertChild(node: TreeNode, index: number) {
    this.children.splice(index, 0, node)
  }

  remove(): void {
    const parent = this.parent
    if (parent) {
      parent.removeChild(this)
    }
  }

  removeChild(child: TreeNode): void {
    const index = this.children.indexOf(child)

    if (index > -1) {
      child.parent = null
      this.children.splice(index, 1)
    }
  }
}

export class Tree {
  root: TreeNode
  constructor(root: TreeNode) {
    this.root = root
  }

  get depth(): number {
    const getMaxDepth = (node: TreeNode): number => {
      return (
        1 +
        (node.hasChildren
          ? Math.max.apply(
              null,
              node.children.map((child) => getMaxDepth(child))
            )
          : 0)
      )
    }
    return getMaxDepth(this.root)
  }

  *preOrderTraversal(node = this.root): Generator<TreeNode> {
    yield node
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child)
      }
    }
  }

  *postOrderTraversal(node = this.root): Generator<TreeNode> {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child)
      }
    }
    yield node
  }

  insert(parentNodeKey: PropertyKey, child: TreeNode) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(child)
      }
    }
  }

  remove(key: PropertyKey) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c) => c.key !== key)
      if (filtered.length !== node.children.length) {
        node.children = filtered
        return true
      }
    }
    return false
  }

  find(key: PropertyKey) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node
    }
    return null
  }

  static flatten(node: TreeNode) {
    const flattenNodes: TreeNode[] = []
    const nodes: TreeNode[] = [node]
    function traverse() {
      const stack: TreeNode[] = []

      for (let i = nodes.length - 1; i >= 0; --i) {
        stack.push(nodes[i])
      }
      while (stack.length) {
        const node = stack.pop()
        if (!node) continue
        flattenNodes.push(node)
        const children = node.children
        if (children) {
          const length = children.length
          for (let i = length - 1; i >= 0; --i) {
            stack.push(children[i])
          }
        }
      }
    }

    traverse()
    return flattenNodes
  }
}

type Model = Record<PropertyKey, any>

type TreeModelConfig = {
  children?: string
  value?: string
  key?: string
}

export class TreeModel {
  config = {
    children: 'children',
    value: 'value',
    key: 'key',
  }
  constructor(config: TreeModelConfig) {
    this.config = Object.assign(this.config, config)
  }
  private addChildToNode(node: TreeNode, child: TreeNode) {
    child.parent = node
    node.appendChild(child)
    return child
  }
  parse(model: Model) {
    let node = new TreeNode(model[this.config.key], model[this.config.value])

    if (model[this.config.children]) {
      for (let child of model[this.config.children]) {
        this.addChildToNode(node, this.parse(child))
      }
    }

    return node
  }
}

type WalkCallbackFn = (node: TreeNode) => boolean

export class WalkStrategies {
  static pre(callback: WalkCallbackFn, node: TreeNode) {
    let keepGoing = callback.call(node, node)
    for (let child of node.children) {
      if (!keepGoing) return false
      keepGoing = WalkStrategies.pre(callback, child)
    }
    return keepGoing
  }

  static post(callback: WalkCallbackFn, node: TreeNode) {
    let keepGoing = true
    for (let child of node.children) {
      keepGoing = WalkStrategies.post(callback, child)
      if (!keepGoing) return false
    }
    keepGoing = callback.call(node, node)
    return keepGoing
  }

  static breadth(callback: WalkCallbackFn, node: TreeNode) {
    const queue: TreeNode[] = [node]
    ;(function processQueue() {
      if (queue.length === 0) {
        return
      }
      const node = queue.shift()
      if (node?.children) {
        for (let child of node.children) {
          queue.push(child)
        }
        if (callback.call(node, node)) {
          processQueue()
        }
      }
    })()
  }
  static bottomToUp(callback: WalkCallbackFn, node: TreeNode): boolean {
    let keepGoing = callback.call(node, node)
    if (keepGoing && node.parent) {
      keepGoing = WalkStrategies.bottomToUp(callback, node.parent)
    }
    return keepGoing
  }
}
