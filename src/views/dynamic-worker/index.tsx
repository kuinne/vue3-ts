import { defineComponent, onMounted } from "vue";

const BASE_DATASETS = "";
class DynamicWorker {
  worker: Worker;
  flagMapping = {};
  constructor(formatFunc: () => void) {
    /**
     * 依赖的全局变量声明
     * 如果 BASE_DATASETS 非字符串形式，可调用 JSON.stringify 等方法进行处理
     * 保证变量的正常声明
     */
    const CONSTS = `const base = ${BASE_DATASETS};`;

    /** 数据处理函数 */
    const formatFn = `const formatFn = ${formatFunc.toString()};`;

    /** 内部 onmessage 处理 */
    const onoMessageHandlerFn = `self.onmessage = (e) => {
  console.log('Message received **from** main script', e);
  const {method, data} = e.data.data;
  if (data && method === 'format') {
   self.postMessage({
    data: formatFn(data),
    flag: e.data.flag
   })
  }
  console.log('Posting message back to main script');
}`;

    /**
     * 返回结果
     * @param {*} param0
     */
    const handleResult = (e) => {
      console.log("handleResult", e);

      const {
        data: { data, flag },
      } = e;

      const resolve = this.flagMapping[flag];
      if (resolve) {
        resolve(data);
        delete this.flagMapping[flag];
      }
    };

    const blob = new Blob([`(()=>{${formatFn}${onoMessageHandlerFn}})()`], {
      type: "text/javascript",
    });

    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener("message", handleResult);

    URL.revokeObjectURL(blob);
  }

  send(data) {
    const flag = new Date().toString();
    this.worker?.postMessage({
      data,
      flag,
    });
    return new Promise((res) => {
      this.flagMapping[flag] = res;
    });
  }

  close() {}
}

export default defineComponent({
  setup() {
    const test = 1;
    const formatFunc = (e) => {
      console.log("formatFunc", e);

      return {
        res: "I am a customized result string.",
      };
    };
    const result = [];

    const worker = new DynamicWorker(formatFunc);

    const send = () => {
      worker
        .send({
          method: "format",
          data: result,
        })
        .then((e) => {
          console.log("zzzzz", e);
        });
    };
    return () => <div onClick={send}>s</div>;
  },
});
