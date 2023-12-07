import { defineComponent, onMounted, ref, watch } from "vue";
import styles from "./style.module.scss";

const getPadding = (el: HTMLElement) => {
  const _style = window.getComputedStyle(el, null);
  const paddingLeft = Number.parseInt(_style.paddingLeft, 10) || 0;
  const paddingRight = Number.parseInt(_style.paddingRight, 10) || 0;
  const paddingTop = Number.parseInt(_style.paddingTop, 10) || 0;
  const paddingBottom = Number.parseInt(_style.paddingBottom, 10) || 0;
  return {
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
    bottom: paddingBottom,
  };
};

export default defineComponent({
  setup() {
    const box = ref<HTMLDivElement | null>(null);
    const result = ref();

    const checkEllipsis = (boxEle: HTMLDivElement) => {
      const range = document.createRange();
      range.setStart(boxEle, 0);
      range.setEnd(boxEle, boxEle.childNodes.length);

      window.getSelection().addRange(range);

      let rangeWidth = range.getBoundingClientRect().width;
      let rangeHeight = range.getBoundingClientRect().height;
      const contentWidth = rangeWidth - Math.floor(rangeWidth);
      const { left: pLeft, right: pRight } = getPadding(boxEle);
      const horizontalPadding = pLeft + pRight;

      if (rangeWidth + horizontalPadding > boxEle.clientWidth) {
        result.value = "存在省略号";
      } else {
        result.value = "容器宽度足够，没有省略号了";
      }
    };

    watch(box, () => {
      if (!box.value) return;

      box.value.addEventListener("animationiteration", () => {
        const event = new CustomEvent("resize");
        box.value.dispatchEvent(event);
      });

      box.value.addEventListener("resize", () => {
        if (!box.value) return;
        checkEllipsis(box.value);
      });
    });

    return () => (
      <>
        <div class={[styles["ellipsis"], styles["box"]]} ref={box}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          <span style="font-size: large;">hello world</span>
          <span style="letter-spacing: 20px">hello world</span>
        </div>
        <div>{result.value}</div>
      </>
    );
  },
});
