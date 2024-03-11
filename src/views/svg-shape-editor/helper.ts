import { ISizeCoordinate, ISprite } from "./type.d";

/**
 * 计算选中所有精灵的矩形区域
 * @param activeSpriteList 精灵列表
 */
export const getActiveSpriteRect = (activeSpriteList: ISprite[]) => {
  const posMap = {
    minX: Infinity,
    minY: Infinity,
    maxX: 0,
    maxY: 0,
  };

  activeSpriteList.forEach((sprite) => {
    const { size, coordinate } = sprite.attrs;
    const { width = 0, height = 0 } = size;
    const { x = 0, y = 0 } = coordinate;

    if (x < posMap.minX) {
      posMap.minX = x;
    }
    if (y < posMap.minY) {
      posMap.minY = y;
    }

    if (x + width > posMap.maxX) {
      posMap.maxX = x + width;
    }

    if (y + height > posMap.maxY) {
      posMap.maxY = y + height;
    }
  });
  return {
    width: posMap.maxX - posMap.minX,
    height: posMap.maxY - posMap.minY,
    x: posMap.minX,
    y: posMap.maxY,
  } as ISizeCoordinate;
};

/**
 * 根据类名寻找父元素
 * @param dom dom元素
 * @param className 类名
 * @return dom | null
 */
export function findParentByClass(
  dom: NonNullable<Element>,
  className: string
) {
  if (!dom || dom.tagName === "BODY") {
    return null;
  }
  if (dom.classList.contains(className)) {
    return dom;
  }
  return findParentByClass(dom.parentElement, className);
}

/**
 * 是否正在输入
 */
export function isInputting() {
  const ele = document.activeElement;
  const inputTags = ["input", "textarea"];
  if (ele) {
    const contentEditable = ele.getAttribute("contenteditable") === "true";
    const tagName = ele.tagName.toLocaleLowerCase() || "";
    if (inputTags.includes(tagName) || contentEditable) {
      return true;
    }
  }
  return false;
}
