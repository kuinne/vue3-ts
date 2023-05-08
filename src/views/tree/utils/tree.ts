export class TreeNode {
  key: PropertyKey;
  value: any;
  parent: TreeNode | null;
  level: number;
  children: TreeNode[];
  constructor(key: PropertyKey, value = key, parent: TreeNode | null = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
    if (this.parent) {
      this.level = this.parent.level + 1;
    } else {
      this.level = 0;
    }
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }

  get isRoot() {
    return !this.parent;
  }

  get path() {
    const path: TreeNode[] = [];
    (function addToPath(node: TreeNode) {
      path.unshift(node);
      if (!node.isRoot) {
        addToPath(node.parent!);
      }
    })(this);
    return path;
  }

  get index() {
    if (this.isRoot) {
      return 0;
    }
    return this.parent?.children.indexOf(this);
  }

  addChild(node: TreeNode) {
    this.children.push(node);
  }

  addChildAtIndex(node: TreeNode, index: number) {
    this.children.splice(index, 0, node);
  }

  // TODO
  getPath() {}
}

export class Tree {
  root: TreeNode;
  constructor(key: PropertyKey, value = key) {
    this.root = new TreeNode(key, value);
  }

  *preOrderTraversal(node = this.root): Generator<TreeNode> {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root): Generator<TreeNode> {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(parentNodeKey: PropertyKey, key: PropertyKey, value = key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, value, node));
      }
    }
  }

  remove(key: PropertyKey) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key: PropertyKey) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }

  static flatten(node: TreeNode) {
    const flattenNodes: TreeNode[] = [];
    const nodes: TreeNode[] = [node];
    function traverse() {
      const stack: TreeNode[] = [];

      for (let i = nodes.length - 1; i >= 0; --i) {
        stack.push(nodes[i]);
      }
      while (stack.length) {
        const node = stack.pop();
        if (!node) continue;
        flattenNodes.push(node);
        const children = node.children;
        if (children) {
          const length = children.length;
          for (let i = length - 1; i >= 0; --i) {
            stack.push(children[i]);
          }
        }
      }
    }

    traverse();
    return flattenNodes;
  }
}

type Model = Record<PropertyKey, any>;

type TreeModelConfig = {
  children?: string;
  value?: string;
  key?: string;
};

export class TreeModel {
  config = {
    children: "children",
    value: "value",
    key: "key",
  };
  constructor(config: TreeModelConfig) {
    this.config = Object.assign(this.config, config);
  }
  addChildToNode(node: TreeNode, child: TreeNode) {
    child.parent = node;
    node.addChild(child);
    return child;
  }
  parse(model: Model) {
    const node = new TreeNode(model[this.config.key], model[this.config.value]);
    if (model[this.config.children]) {
      for (let child of model[this.config.children]) {
        this.addChildToNode(node, this.parse(child));
      }
    }
    return node;
  }
}

type WalkCallbackFn = (node: TreeNode) => boolean;

export class WalkStrategies {
  static pre(callback: WalkCallbackFn, node: TreeNode) {
    let keepGoing = callback.call(node, node);
    for (let child of node.children) {
      if (!keepGoing) return false;
      keepGoing = WalkStrategies.pre(callback, child);
    }
    return keepGoing;
  }

  static post(callback: WalkCallbackFn, node: TreeNode) {
    let keepGoing = true;
    for (let child of node.children) {
      keepGoing = WalkStrategies.post(callback, child);
      if (!keepGoing) return false;
    }
    keepGoing = callback.call(node, node);
    return keepGoing;
  }

  static breadth(callback: WalkCallbackFn, node: TreeNode) {
    const queue: TreeNode[] = [node];
    (function processQueue() {
      if (queue.length === 0) {
        return;
      }
      const node = queue.shift();
      if (node?.children) {
        for (let child of node.children) {
          queue.push(child);
        }
        if (callback.call(node, node)) {
          processQueue();
        }
      }
    })();
  }
}
