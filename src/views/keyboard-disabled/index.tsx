import { defineComponent, onMounted, ref, watch } from "vue";
import styles from "./style.module.scss";

export default defineComponent({
  setup() {
    const editableDivRef = ref<HTMLDivElement | null>(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(window.getSelection());

      if (e.key !== "Backspace") {
        e.preventDefault();
        return false;
      }
    };

    const handleInput = (e: InputEvent) => {
      return false;
    };

    const oldValue = ref("<span>hello, world</span>");

    const handleCompositionstart = (e) => {
      oldValue.value = editableDivRef.value.innerText;
    };
    const handleCompositionend = (e) => {
      editableDivRef.value.innerText = oldValue.value;
      return false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      console.log(e);
    };

    return () => (
      <div>
        <textarea
          ref={editableDivRef}
          class={styles["box"]}
          //   contenteditable={true}
          onKeydown={handleKeyDown}
          //   onInput={handleInput}
          onCompositionstart={handleCompositionstart}
          onCompositionend={handleCompositionend}
          onMousedown={handleMouseDown}
        ></textarea>
      </div>
    );
  },
});
