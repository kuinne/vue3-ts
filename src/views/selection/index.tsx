import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  setup() {
    const target = ref<HTMLDivElement | null>(null);
    const target2 = ref<HTMLDivElement | null>(null);
    const target3 = ref<HTMLInputElement | null>(null);
    const preview = ref<HTMLDivElement | null>(null);
    const start = ref(0);
    const end = ref(2);
    const range = ref<Range>();
    const setRange = () => {
      if (!target.value) return;
      range.value = new Range();
      range.value.setStart(target.value, start.value);
      range.value.setEnd(target.value, end.value);
      //   range.collapse(true);
      //   range.selectNode(target.value);
      //   range.selectNodeContents(target.value);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range.value);
    };

    const deleteContents = () => {
      if (!range.value) return;
      range.value.deleteContents();
    };

    const extractContents = () => {
      if (!range.value || !preview.value) return;
      let content = range.value.extractContents();
      preview.value.innerHTML = "";
      preview.value.append("extracted:", content);
    };
    const cloneContents = () => {
      if (!range.value || !preview.value) return;
      let content = range.value.cloneContents();
      preview.value.innerHTML = "";
      preview.value.append("extracted:", content);
    };
    const insertNode = () => {
      if (!range.value || !preview.value) return;
      let newNode = document.createElement("u");
      newNode.innerHTML = "NEW NODE";
      range.value.insertNode(newNode);
    };
    const surroundContents = () => {
      if (!range.value || !preview.value) return;
      let newNode = document.createElement("u");
      try {
        range.value.surroundContents(newNode);
      } catch (error) {}
    };

    const setBaseAndExtent = () => {
      console.log("setBaseAndExtent");

      //   document
      //     .getSelection()
      //     .setBaseAndExtent(
      //       target.value,
      //       0,
      //       target.value,
      //       target.value.childNodes.length
      //     );

      const range = new Range();
      range.selectNodeContents(target.value);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);
    };

    const onSelect = (e: InputEvent) => {
      console.log("onSelect", e.target.selectionStart, e.target.selectionEnd);
    };

    const onFocus = () => {
      // 设置零延迟 setTimeout 以在浏览器 "focus" 行为完成后运行
      setTimeout(() => {
        if (!target3.value) return;

        target3.value.selectionStart = target3.value.selectionEnd = 5;
      });
    };

    const replaceSelection = () => {
      if (!target3.value) return;
      if (target3.value.selectionStart == target3.value.selectionEnd) {
        return; // 什么都没选
      }
      const selected = target3.value.value.slice(
        target3.value.selectionStart,
        target3.value.selectionEnd
      );
      target3.value.setRangeText(`*${selected}*`);
    };

    const insertAtSelection = () => {
      if (!target3.value) return;
      target3.value.setRangeText(
        "HELLO",
        target3.value.selectionStart,
        target3.value.selectionEnd,
        "end"
      );
    };

    onMounted(() => {
      //   document.onselectionchange = function () {
      //     const selection = document.getSelection();
      //     const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
      //     console.log(
      //       "onselectionchange anchorNode",
      //       anchorNode?.data,
      //       anchorOffset
      //     );
      //     console.log(
      //       "onselectionchange focusNode",
      //       focusNode?.data,
      //       focusOffset
      //     );
      //     preview.value.innerHTML = "";
      //     for (let i = 0; i < selection.rangeCount; i++) {
      //       preview.value.append(selection.getRangeAt(i).cloneContents());
      //     }
      //   };
    });

    return () => (
      <div>
        From:<input v-model={start.value}></input>
        -TO:<input v-model={end.value}></input>
        <br />
        <button onClick={setRange}>getRange</button>
        <br />
        <button onClick={deleteContents}>deleteContents</button>
        <br />
        <br />
        <button onClick={extractContents}>extractContents</button>
        <br />
        <button onClick={cloneContents}>cloneContents</button>
        <br />
        <button onClick={insertNode}>insertNode</button>
        <br />
        <button onClick={surroundContents}>surroundContents</button>
        <br />
        <button onClick={setBaseAndExtent}>setBaseAndExtent</button>
        <br />
        <button onClick={replaceSelection}>replaceSelection</button>
        <br />
        <button onClick={insertAtSelection}>insertAtSelection</button>
        <br />
        <div ref={target}>
          Example: <i>italic</i> and <b>bold</b>
        </div>
        <div ref={target2}>hello</div>
        <div ref={preview}></div>
        <textarea
          ref={target3}
          style="width:80%; height: 60px"
          onFocus={onFocus}
        >
          Focus on me, the cursor will be at position 5.
        </textarea>
      </div>
    );
  },
});
