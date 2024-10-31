import { defineComponent, onMounted, ref } from "vue";
import { functionSandbox } from "./functionSandbox";
import { workerSandbox } from "./workerSandbox";
import { SandboxResult, useSandbox } from "./use-sandbox";

// export default defineComponent({
//   setup() {
//     onMounted(() => {
//       const sandboxedScript = functionSandbox(
//         'console.log("hello from the sandbox!"); var x = 10;'
//       );

//       sandboxedScript();

//       // @ts-ignore
//       console.log(typeof x);

//       workerSandbox("const a = 1; console.log('zz', a);");
//       // @ts-ignore
//       console.log("a", a);
//     });
//     return () => <div>hello</div>;
//   },
// });

export default defineComponent({
  setup() {
    const code = ref(
      "function test() { return 'hello' }; console.log(Date.now(), test())"
    );
    const sandboxResult = ref<SandboxResult | null>(null);

    const { executeCode } = useSandbox();

    const runCode = async () => {
      sandboxResult.value = await executeCode(code.value);
    };

    return () => (
      <div>
        <textarea
          v-model={code.value}
          placeholder="Enter JavasScript code here"
        ></textarea>
        <button onClick={runCode}>Run Code</button>
        {sandboxResult.value ? (
          <>
            {sandboxResult.value.success
              ? `Result: ${sandboxResult.value.result}`
              : `Error: ${sandboxResult.value.result}`}
          </>
        ) : null}
      </div>
    );
  },
});
