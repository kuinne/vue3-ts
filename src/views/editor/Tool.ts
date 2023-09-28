import { Editor } from "./Editor";
import { EventEmitter } from "./EventEmitter";

/**
 * 工具类
 */
export interface ITool {
  type: string;
  active: () => void;
  inactive: () => void;

  start: (event: PointerEvent) => void;
  drag: (event: PointerEvent) => void;
  end: (event: PointerEvent) => void;
  moveExcludeDrag: (event: PointerEvent) => void;
}

class DrawRectTool implements ITool {}

class DrawEllipseTool implements ITool {}

class SelectTool implements ITool {}

class DragCanvasTool implements ITool {}

class ToolManager {
  toolMap = new Map<string, ITool>();
  currentTool: ITool | null = null;
  eventEmitter: EventEmitter;
  _unbindEvent: () => void;

  constructor(private editor: Editor) {
    this.eventEmitter = new EventEmitter();

    // 绑定 tool
    this.toolMap.set(DrawRectTool.type, new DrawRectTool(editor));
    this.toolMap.set(DrawEllipseTool.type, new DrawEllipseTool(editor));
    this.toolMap.set(SelectTool.type, new SelectTool(editor));
    this.toolMap.set(DragCanvasTool.type, new DragCanvasTool(editor));
  }

  setTool(toolName: string) {
    const prevTool = this.currentTool;
    const currentTool = (this.currentTool = this.toolMap.get(toolName) || null);
    if (!currentTool) {
      throw new Error(`没有 ${toolName} 对应的工具对象`);
    }
    prevTool && prevTool.inactive();
    currentTool.active();

    this.eventEmitter.emit("change", currentTool.type);
  }
}
