import { Directive, ref } from "vue";
import styles from "./style.module.scss";

const isTruncated = (el: HTMLDivElement) => {
  return el.scrollHeight > el.clientHeight;
};

const ellipsisStyle = styles["multiple-ellipsis"];

let timeId: any;

const id = "tooltip";

const tooltipInstanceTotal = ref(0);

const getTooltipEle = () => {
  return document.getElementById(id);
};

const removeTooltip = () => {
  timeId = setTimeout(() => {
    let tooltipEle = getTooltipEle();
    tooltipEle && document.body.removeChild(tooltipEle);
    timeId = null;
  }, 200);
};

const handleWheel = (evt: WheelEvent) => {
  const tooltipEle = getTooltipEle();
  if (tooltipEle) {
    const { top, left, right, bottom } = tooltipEle.getBoundingClientRect();
    const isInTooltip =
      left < evt.clientX &&
      right > evt.clientX &&
      top < evt.clientY &&
      bottom > evt.clientY;
    if (isInTooltip) {
      // 为了保证tooltip内部有滚动条时可以正常滚动
      return;
    }
  }
  removeTooltip();
};

const vTextTooltip: Directive<HTMLDivElement, { line?: number } | undefined> = {
  mounted(el, binding, vnode) {
    const { line = 3 } = binding.value || {};

    if (!el.classList.contains(ellipsisStyle)) {
      el.classList.add(ellipsisStyle);
    }
    el.style.webkitLineClamp = String(line);

    const handleMouseenter = (evt: MouseEvent) => {
      if (isTruncated(el)) {
        setTimeout(() => {
          let tooltipEle = document.getElementById(id);
          if (!tooltipEle) {
            tooltipEle = document.createElement("div");
            tooltipEle.setAttribute("id", id);
            tooltipEle.classList.add(styles["tooltip"]);

            const tooltipInnerEle = document.createElement("div");
            tooltipInnerEle.classList.add(styles["tooltip-inner"]);
            tooltipEle.appendChild(tooltipInnerEle);

            tooltipEle.style.left = `${evt.clientX - evt.offsetX}px`;
            document.body.appendChild(tooltipEle);
          }
          tooltipEle.firstElementChild!.innerHTML = el.innerHTML;
          tooltipEle.style.top = `${
            evt.clientY - evt.offsetY - tooltipEle.offsetHeight - 10
          }px`;
          tooltipEle.addEventListener("mouseenter", () => {
            if (timeId) {
              clearTimeout(timeId);
            }
          });
          tooltipEle.addEventListener("mouseleave", () => {
            removeTooltip();
          });
        }, 200);
      }
    };

    const handleMouseleave = (evt: MouseEvent) => {
      removeTooltip();
    };

    if (tooltipInstanceTotal.value === 0) {
      window.addEventListener("wheel", handleWheel);
    }
    el.addEventListener("mouseenter", handleMouseenter);
    el.addEventListener("mouseleave", handleMouseleave);
    tooltipInstanceTotal.value += 1;
  },
  unmounted() {
    tooltipInstanceTotal.value -= 1;
    if (tooltipInstanceTotal.value === 0) {
      window.removeEventListener("wheel", handleWheel);
    }
    removeTooltip();
  },
};

export default vTextTooltip;
