import { defineComponent, onMounted, ref, watch } from "vue";
import styles from "./style.module.scss";

class RangeHandler {
  selection: Selection;
  dom: HTMLElement;
  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.selection = getSelection()!;
  }

  removeAllRanges() {
    this.selection?.removeAllRanges();
  }

  createRange() {
    this.removeAllRanges();
    const range = document.createRange();
    this.selection.addRange(range);
    return range;
  }

  getCurrentRange() {
    return this.selection.getRangeAt(0);
  }

  getText() {
    return this.getCurrentRange()?.toString();
  }

  extractContent() {
    return this.getCurrentRange()?.extractContents();
  }

  cloneContent() {
    return this.getCurrentRange()?.cloneContents();
  }

  insertText(text: string) {
    this.getCurrentRange().insertNode(document.createTextNode(text));
  }

  insertNode(node: Node) {
    this.getCurrentRange().insertNode(node);
  }
  deleteText() {
    this.getCurrentRange().deleteContents();
  }

  setRange(start: number, end: number) {
    const range = this.createRange();
    range.setStart(this.dom.firstChild!, start);
    range.setEnd(this.dom.firstChild!, end);
  }

  addRange(range: Range) {
    this.removeAllRanges();
    this.selection.addRange(range);
  }

  setAllRange() {
    this.createRange().selectNode(this.dom);
  }

  addBold() {
    const boldElement = document.createElement("b");
    this.getCurrentRange()?.surroundContents(boldElement);
  }

  addColor(color: string) {
    const spanElement = document.createElement("span");
    spanElement.style.color = color;
    this.getCurrentRange()?.surroundContents(spanElement);
  }

  collapse(toStart: boolean) {
    this.getCurrentRange().collapse(toStart);
  }
}

export default defineComponent({
  setup() {
    const contentRef = ref<HTMLDivElement | null>(null);
    const handleMousedown = (event: MouseEvent) => {};

    const handleMousemove = (event: MouseEvent) => {};
    let rangeHandler: RangeHandler | undefined;

    const waitContainerRendered = () =>
      new Promise((resolve) => {
        watch(
          contentRef,
          () => {
            if (contentRef.value) {
              resolve(contentRef.value);
            }
          },
          {
            immediate: true,
          }
        );
      });
    watch(contentRef, () => {
      if (contentRef.value) {
        rangeHandler = new RangeHandler(contentRef.value);
      }
    });
    const getRange = () => {
      const selection = getSelection();
      console.log("选中的文本：", selection?.toString());
    };

    const clearSelection = () => {
      rangeHandler?.removeAllRanges();
    };

    const getRangeDetail = () => {
      console.log("获取选区详情：", rangeHandler?.getCurrentRange());
    };

    const editRange = () => {
      rangeHandler?.insertText("新的内容");
    };

    const addBold = () => {
      rangeHandler?.addBold();
    };

    const addColor = () => {
      rangeHandler?.addColor("red");
    };

    const extractContent = () => {
      console.log("截取选区内容：", rangeHandler?.extractContent());
    };
    const cloneRangeContent = () => {
      console.log("克隆选区内容：", rangeHandler?.cloneContent());
    };

    const deleteRangeContents = () => {
      rangeHandler?.deleteText();
    };

    const insertNodeBeforeRange = () => {
      const button = document.createElement("button");
      button.innerText = "按钮";
      rangeHandler?.insertNode(button);
    };

    const setRange = () => {
      rangeHandler?.setRange(0, 5);
    };
    const setAnchor = () => {
      const range = rangeHandler?.createRange();
      if (!range) return;
      // 定位到特定节点

      range.setStart(contentRef.value?.firstChild!, 4); // 设置起点在第5个字符

      range.collapse(true); // 折叠到起点位置
      rangeHandler?.addRange(range);
    };

    const selectAllText = () => {
      rangeHandler?.setAllRange();
    };

    /** 高亮选区 */
    const highlightRange = (range: Range) => {
      // 检查 Range 是否完全包含可包裹的内容

      if (range.startContainer === range.endContainer) {
        const span = document.createElement("span");
        span.className = styles.highlight;

        try {
          // 直接包裹内容
          range.surroundContents(span);
        } catch (e) {
          console.error("无法之际包裹内容：", e);
        }
      } else {
        // 部分选中非文本节点，使用替代方案处理
        wrapRangeWithSpan(range);
      }
    };

    // 替代方案：将 Range 的内容拆分并包裹
    const wrapRangeWithSpan = (range: Range) => {
      const span = document.createElement("span");
      span.className = styles.highlight;

      // 创建 DocumentFragment 来保存选区内容
      const fragment = range.extractContents();

      // 将选区内容放入高亮容器
      span.appendChild(fragment);

      // 将高亮内容插入到选区原始位置
      range.insertNode(span);

      console.log("sssssssss", range);

      getSelection()?.removeAllRanges();
    };

    /** 缓存选区 */
    const cacheHighlight = (range: Range) => {
      console.log("cache range", range);

      const highlights = JSON.parse(localStorage.getItem("highlights") || "[]");

      const highlight = {
        startContainerPath: getNodePath(range.startContainer),
        startOffset: range.startOffset,
        endContainerPath: getNodePath(range.endContainer),
        endOffset: range.endOffset,
      };
      highlights.push(highlight);
      localStorage.setItem("highlights", JSON.stringify(highlights));
    };

    const applyHighlights = async () => {
      await waitContainerRendered();
      const savedHighlights = JSON.parse(
        localStorage.getItem("highlights") || "[]"
      );

      savedHighlights.forEach(applyHighlightFromCache);
    };

    // 根据缓存数据应用高亮
    const applyHighlightFromCache = (highlight: any) => {
      const startNode = getNodeByPath(highlight.startContainerPath);

      const endNode = getNodeByPath(highlight.endContainerPath);

      if (startNode && endNode) {
        const range = document.createRange();

        const startOffset = Math.min(
          highlight.startOffset,
          getMaxOffset(startNode)
        );
        const endOffset = Math.min(highlight.endOffset, getMaxOffset(endNode));
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        console.log("range", range);

        highlightRange(range);
      }
    };

    // 获取节点的最大偏移量
    const getMaxOffset = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.length || 0;
      } else {
        return node.childNodes.length;
      }
    };

    // 获取节点路径
    const getNodePath = (node: Node | null) => {
      const path: number[] = [];
      while (node && node !== contentRef.value) {
        const index = Array.from(node.parentNode?.childNodes!).indexOf(
          node as ChildNode
        );
        path.unshift(index);
        node = node.parentNode;
      }
      return path;
    };

    // 根据路径获取节点
    const getNodeByPath = (path: number[]) => {
      let node = contentRef.value;
      for (const index of path) {
        node = node?.childNodes[index];
        if (!node) break;
      }
      return node;
    };

    const handleMouseup = () => {
      const selection = getSelection();
      if (selection && selection?.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        highlightRange(range);
        cacheHighlight(range);
      }
    };

    const clearHighlights = () => {
      const highlights = document.querySelectorAll(`.${styles.highlight}`);
      highlights.forEach((span) => {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent?.insertBefore(span.firstChild, span);
        }
        parent?.removeChild(span);
      });
    };

    const clearCachedHighlights = () => {
      clearHighlights();
      localStorage.removeItem("highlights");
    };

    onMounted(async () => {
      applyHighlights();
    });

    return () => (
      <div>
        <div>
          <button onClick={setRange}>选中文本</button>
          <button onClick={getRange}>获取选中的文本</button>
          <button onClick={getRangeDetail}>获取选中详情</button>
          <button onClick={editRange}>修改选中的文本</button>
          <button onClick={addBold}>加粗</button>
          <button onClick={addColor}>高亮</button>
          <button onClick={extractContent}>截取选区内容</button>
          <button onClick={cloneRangeContent}>
            克隆选区范围内的内容（不影响原内容）
          </button>
          <button onClick={deleteRangeContents}>删除选区内容</button>
          <button onClick={insertNodeBeforeRange}>
            在选区起点插入一个新的节点
          </button>

          <button onClick={selectAllText}>选中整个</button>
          <button onClick={setAnchor}>移动光标</button>
          <button onClick={clearSelection}>清除选中</button>
          <button onClick={clearHighlights}>清除高亮</button>
          <button onClick={clearCachedHighlights}>清除缓存高亮</button>
          <button onClick={applyHighlights}>回显高亮</button>
        </div>
        <p
          ref={contentRef}
          contenteditable
          onMousedown={handleMousedown}
          onMousemove={handleMousemove}
          onMouseup={handleMouseup}
        >
          Lorem
        </p>
      </div>
    );
  },
});
