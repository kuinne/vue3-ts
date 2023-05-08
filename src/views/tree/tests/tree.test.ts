import { Tree } from "../utils/tree";

const tree = new Tree(1, "AB");

tree.insert(1, 11, "AC");

tree.insert(1, 12, "BC");

tree.insert(12, 121, "BG");

console.log([...tree.preOrderTraversal()].map((x) => x.value));

console.log(tree.root.value);

console.log(tree.root.hasChildren);

console.log(tree.find(12)?.isLeaf);

console.log(tree.find(121)?.isLeaf);

console.log(tree.find(121)?.parent?.value);

console.log(tree.remove(12));

console.log([...tree.postOrderTraversal()].map((x) => x.value));

//flatten

console.log(Tree.flatten(tree.root));
