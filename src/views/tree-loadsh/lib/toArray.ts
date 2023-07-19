import { ChildrenKey, Tree } from "./types.d";
import foreach, { ForeachOptions } from "./foreach";

type ToArrayOptions<T extends ChildrenKey> = ForeachOptions<T>;

function toArray<T extends ChildrenKey>(
  tree: Tree<T> | Tree<T>[],
  options?: ToArrayOptions<T>
): Tree<T>[] {
  const results: Tree<T>[] = [];
  foreach(
    tree,
    (t: Tree<T>) => {
      results.push(t);
    },
    options
  );
  return results;
}

export default toArray;
