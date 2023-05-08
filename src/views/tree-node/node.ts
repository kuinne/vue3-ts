import { ParseArgs, ParsedArgs } from "./type.d";
import { Model } from "./type";
import WalkStrategy from "./walk-strategy";

class Node<T> {
  model: Model<T>;
  children: Node<T>[];
  parent?: Node<T>;
  walkStrategy: WalkStrategy<T>;
  constructor(model: Model<T>) {
    this.model = model;
    this.children = [];
    this.walkStrategy = new WalkStrategy();
  }

  private _addChild(self: Node<T>, child: Node<T>, insertIndex?: number) {
    child.parent = self;
    self.model.children = self.model.children ?? [];
    if (insertIndex == null) {
      self.model.children.push(child.model);
      self.children.push(child);
      return child;
    }
    if (insertIndex < 0 || insertIndex > self.children.length) {
      throw new Error("Invalid index");
    }
    self.model.children.splice(insertIndex, 0, child.model);
    self.children.splice(insertIndex, 0, child);
    return child;
  }

  addChild(child: Node<T>): Node<T> {
    return this._addChild(this, child);
  }
  addChildAtIndex(child: Node<T>, index: number): Node<T> {
    return this._addChild(this, child, index);
  }

  private _parseArgs<T>(...args: any): ParsedArgs<T> {
    let parsedArgs: ParsedArgs<T>;
    if (typeof args[0] === "function") {
      parsedArgs = {
        fn: args[0],
        options: typeof args[1] === "object" ? args[1] : { strategy: "pre" },
      };
    } else {
        parsedArgs = {
            fn: typeof args[1] === 'function' ? args[1] : () => true,
            options: args[0] ?? {strategy: {'pre'}}
        }
    }
    return parsedArgs
  }
}

export default Node;
