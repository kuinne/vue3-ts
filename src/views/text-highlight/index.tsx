import { defineComponent, ref, watch } from "vue";
import styles from "./style.module.scss";

type Highlight = {
  startContainerPath: number[];
  startOffset: number;
  endContainerPath: number[];
  endOffset: number;
};
export default defineComponent({
  setup() {
    const contentRef = ref<HTMLDivElement | null>(null);

    const waitContentRefLoaded = () =>
      new Promise((resolve) =>
        watch(contentRef, () => {
          if (contentRef.value) {
            resolve(contentRef.value);
          }
        })
      );

    const highlightRange = (range: Range) => {
      debugger;
      let { startContainer, endContainer, startOffset, endOffset } = range;

      // 如果起始和结束在同一个节点
      if (startContainer === endContainer) {
        highlightSingleNode(
          startContainer,
          startOffset,
          endOffset,
          styles.highlight
        );
      } else {
        if (startContainer.nodeType === Node.TEXT_NODE) {
          // 高亮起始部分
          highlightSingleNode(
            startContainer,
            startOffset,
            startContainer.textContent?.length || 0,
            styles.highlight
          );
        }
        // 高亮中间的完整节点;
        let currentNode: Node | null = startContainer;
        while (currentNode !== endContainer) {
          currentNode = getNextNode(currentNode);
          if (
            currentNode &&
            currentNode.nodeType === Node.TEXT_NODE &&
            currentNode !== endContainer
          ) {
            highlightSingleNode(
              currentNode,
              0,
              currentNode.textContent?.length || 0,
              styles.highlight
            );
          }
        }
        // 高亮结束部分
        if (endContainer.nodeType === Node.TEXT_NODE) {
          highlightSingleNode(endContainer, 0, endOffset, styles.highlight);
        }
      }
    };

    // 高亮单个节点的选区部分
    const highlightSingleNode = (
      node: Node,
      start: number,
      end: number,
      highlightClass: string
    ) => {
      const text = node.textContent || "";

      const before = text.slice(0, start);
      const highlightText = text.slice(start, end);
      const after = text.slice(end);

      const parent = node.parentNode;
      // 创建高亮节点
      const span = document.createElement("span");
      span.className = highlightClass;
      span.textContent = highlightText;

      // 替换节点内容
      const fragment = document.createDocumentFragment();
      if (before) fragment.appendChild(document.createTextNode(before));
      fragment.appendChild(span);
      if (after) fragment.appendChild(document.createTextNode(after));

      // 在下一个宏任务改变DOM，以避免影响当前选区的startContainer和endContainer
      setTimeout(() => {
        parent?.replaceChild(fragment, node);
      }, 0);
    };

    const cacheHighlight = (range: Range) => {
      if (!contentRef.value) return;
      const highlight: Highlight = {
        startContainerPath: getNodePath(range.startContainer, contentRef.value),
        startOffset: range.startOffset,
        endContainerPath: getNodePath(range.endContainer, contentRef.value),
        endOffset: range.endOffset,
      };
      const cachedHighlights = JSON.parse(
        localStorage.getItem("highlights") || "[]"
      ) as Highlight[];
      cachedHighlights.push(highlight);
      localStorage.setItem("highlights", JSON.stringify(cachedHighlights));
    };

    const applyHighlight = (highLight: Highlight) => {
      if (!contentRef.value) return;
      const { startContainerPath, startOffset, endContainerPath, endOffset } =
        highLight;
      const startContainer = getNodeByPath(
        startContainerPath,
        contentRef.value
      );
      const endContainer = getNodeByPath(endContainerPath, contentRef.value);

      console.log("applyHighlight", {
        startContainer,
        startOffset,
        endContainer,
        endOffset,
      });
      debugger;
      if (startContainer && endContainer) {
        debugger;
        const range = document.createRange();
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        const selection = getSelection();
        if (selection) {
          if (selection.rangeCount > 0) {
            selection.removeAllRanges();
          }

          selection.addRange(range);
          console.log("selection.rangeCount ", selection.rangeCount);
        }
        highlightRange(range);
      }
    };

    const applyHighlights = () => {
      const highlights = JSON.parse(
        localStorage.getItem("highlights") || "[]"
      ) as Highlight[];
      highlights.forEach((highlight) => {
        applyHighlight(highlight);
      });
      localStorage.removeItem("highlights");
    };

    const clearHightLights = () => {
      if (!contentRef.value) return;
      const highlightNodes = contentRef.value?.querySelectorAll(
        `.${styles.highlight}`
      );

      highlightNodes?.forEach((node) => {
        const parentNode = node.parentNode;
        while (node.firstChild) {
          parentNode?.insertBefore(node.firstChild, node);
        }
        parentNode?.removeChild(node);
      });

      mergeAdjacentTextNodes(contentRef.value);
    };

    const handleMouseUp = () => {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        console.log("handleMouseUp", range);

        cacheHighlight(range);
        highlightRange(range);
      }
    };

    return () => (
      <div>
        <button onClick={clearHightLights}>清除高亮</button>
        <button onClick={applyHighlights}>回显高亮</button>
        <p ref={contentRef} contenteditable onMouseup={handleMouseUp}>
          Lo<b>re</b>m ipsum dolor sit amet consectetur adipisicing elit. Nisi,
          dolorem! Iste veritatis quo amet commodi. Eligendi omnis maxime ad,
          officia enim adipisci, facilis vitae ratione illum, cumque
          exercitationem ipsa voluptatum.
        </p>
      </div>
    );
  },
});

// 查找节点的下一个子节点或兄弟节点
function getNextNode(node: Node | null) {
  if (!node) return null;

  // 1. 有子节点，则返回第一个子节点
  if (node.firstChild) return node.firstChild;

  // 2. 如果没有子节点，查找下一个兄弟节点
  while (node) {
    if (node.nextSibling) return node.nextSibling;

    // 3. 如果没有兄弟节点，向上回溯
    node = node.parentNode;
  }

  // 如果没有找到下一个节点，返回 null
  return null;
}

function getNodePath(node: Node, root: Node) {
  const path: number[] = [];
  let currentNode: Node | null = node;
  while (currentNode && currentNode !== root) {
    const index = Array.from(node.parentNode?.childNodes ?? []).indexOf(
      currentNode as ChildNode
    );
    path.unshift(index);
    currentNode = currentNode.parentNode;
  }

  return path;
}

function getNodeByPath(path: number[], root: Node) {
  let currentNode: Node | null = root;
  for (const index of path) {
    if (currentNode) {
      currentNode = currentNode.childNodes[index];
    }
  }
  return currentNode;
}

function mergeAdjacentTextNodes(node: Node) {
  // 获取节点的子节点
  const childNodes = Array.from(node.childNodes);

  // 用来存放合并后的子节点
  const mergedNodes = [];

  let currentText = "";

  childNodes.forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      // 如果是文本节点，合并它的内容
      currentText += childNode.textContent;
    } else {
      // 如果遇到非文本节点，将之前的文本节点合并为一个文本节点
      if (currentText) {
        mergedNodes.push(document.createTextNode(currentText));
        currentText = ""; // 重置文本内容
      }
      // 将非文本节点直接加入到结果数组
      mergedNodes.push(childNode);
    }
  });

  // 如果最后有未合并的文本节点，加入到结果数组
  if (currentText) {
    mergedNodes.push(document.createTextNode(currentText));
  }

  // 清空原节点的所有子节点
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  // 将合并后的节点重新添加到父节点中
  mergedNodes.forEach((mergedNode) => {
    node.appendChild(mergedNode);
  });

  return node; // 返回合并后的节点
}
