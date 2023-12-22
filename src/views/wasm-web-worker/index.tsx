import { defineComponent } from "vue";
import { wasmWorker } from "./wasmWorker";
import { wasmWorkerInline } from "./wasmInlineWorker";
import calculatorWasm from "./calculator.wasm?url";

export default defineComponent({
  setup() {
    // wasmWorker(calculatorWasm)
    //   .then((wasmProxyInstance) => {
    //     wasmProxyInstance
    //       .add(2, 3)
    //       .then((result) => {
    //         console.log("add 2,3", result);
    //       })
    //       .catch((error) => {
    //         console.log("error", error);
    //       });
    //   })
    //   .catch((error1) => {
    //     console.log("error1", error1);
    //   });
    wasmWorkerInline(calculatorWasm)
      .then((wasmProxyInstance) => {
        wasmProxyInstance
          .add(2, 3)
          .then((result) => {
            console.log("add 2,3", result);
          })
          .catch((error) => {
            console.log("error", error);
          });
      })
      .catch((error1) => {
        console.log("error1", error1);
      });
    return () => <div></div>;
  },
});
