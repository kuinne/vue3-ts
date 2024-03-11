import { defineComponent, onMounted, ref, watch, withDirectives } from "vue";
import styles from "./style.module.scss";
import vTextTooltip from "./directive";
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
    const content = ref(
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem earum impedit numquam, sint tenetur non placeat nulla rerum, sunt distinctio dicta ratione nesciunt quam, minima sequi maxime expedita nostrum illum."
    );
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

    const checkMultipleEllipsis = (el: HTMLDivElement) => {
      const isTruncated = (el) => {
        return el.scrollHeight > el.clientHeight;
      };

      if (isTruncated(el)) {
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
        // checkEllipsis(box.value);
        checkMultipleEllipsis(box.value);
      });
    });

    return () => (
      <div class={styles["page"]}>
        <div class={styles["wrapper"]}>
          {/* <div class={[styles["ellipsis"], styles["box"]]} ref={box}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          <span style="font-size: large;">hello world</span>
          <span style="letter-spacing: 20px">hello world</span>
        </div> */}
          {/* <div class={[styles["multiple-ellipsis"], styles["box"]]} ref={box}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem earum
          impedit numquam, sint tenetur non placeat nulla rerum, sunt distinctio
          dicta ratione nesciunt quam, minima sequi maxime expedita nostrum
          illum.
        </div> */}
          {withDirectives(
            <div class={[styles["box"]]} ref={box}>
              {content.value}
            </div>,
            [[vTextTooltip, { line: 4 }]]
          )}
          <textarea v-model={content.value}></textarea>

          <div>{result.value}</div>
        </div>
      </div>
    );
  },
});
