import { defineComponent, ref } from "vue";
import styles from "./style.module.scss";
export default defineComponent({
  setup() {
    const textContainer = ref<HTMLDivElement | null>(null);

    const textContent = ref(
      "在上例中，selObj.toString() 会在传递到 window.alert()时自动调用。然而，当你试图在 Selection 对象上使用一个 JavaScript 的String 对象上的属性或者方法时（如 String.prototype.length 或者 String.prototype.substr()），会导致错误（如果没有相应的属性或方法时）或返回不是期望的结果（如果存在相应的属性或方法）。如果想要将 Selection 对象作为一个字符串使用，请直接调用 toString() 方法："
    );

    const handleMouseUp = () => {
      if (!textContainer.value) return;
      const selObj = window.getSelection();
      console.log(selObj);
      //   console.log(selObj.toString());
      //   console.log(selObj.getRangeAt(0));
      console.log(selObj.focusNode?.nodeValue);
    };
    return () => (
      <div
        class={styles["text-marker"]}
        onMouseup={handleMouseUp}
        ref={textContainer}
      >
        {textContent.value}
      </div>
    );
  },
});
