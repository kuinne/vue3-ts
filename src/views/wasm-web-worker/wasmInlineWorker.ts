export function wasmWorkerInline(modulePath: string) {
  let worker: Worker;
  const proxy: Record<string, any> = {};
  let id = 0;
  let idPromises: Record<
    string,
    {
      resolve: (...args: any) => any;
      reject: (...args: any) => any;
    }
  > = {};

  // Polyfill instantiateStreaming for browsers missing it
  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }

  return new Promise((resolve, reject) => {
    worker = createInlineWorker(inlineWasmWorker, modulePath);
    worker.postMessage({ eventType: "INITIALISE", data: modulePath });
    worker.addEventListener("message", function (event: MessageEvent) {
      const { eventType, eventData, eventId } = event.data;

      switch (eventType) {
        case "INITIALISED":
          const props = eventData as any[];
          props.forEach((prop) => {
            proxy[prop] = function () {
              return new Promise((resolve, reject) => {
                worker.postMessage({
                  eventType: "CALL",
                  eventData: {
                    prop: prop,
                    arguments: Array.from(arguments),
                  },
                  eventId: id,
                });
                idPromises[id] = { resolve, reject };
                id++;
              });
            };
          });
          resolve(proxy);
          return;
        case "RESULT":
          if (eventId !== undefined && idPromises[eventId]) {
            idPromises[eventId].resolve(eventData);
            delete idPromises[eventId];
          }
        case "ERROR":
          if (eventId !== undefined && idPromises[eventId]) {
            idPromises[eventId].reject(eventData);
            delete idPromises[eventId];
          }
      }
    });
    worker.addEventListener("error", function (error) {
      reject(error);
    });
  });
}

function createInlineWorker(func: Function, wasmPath: string) {
  if (!wasmPath.startsWith("http")) {
    if (wasmPath.startsWith("/")) {
      wasmPath = location.origin + wasmPath;
    } else if (wasmPath.startsWith("./")) {
      wasmPath = location.origin + wasmPath.substring(1);
    }
  }
  // Make sure the wasm path is absolute and turn into IIFE

  const funcStr = `(${func
    .toString()
    .trim()
    .replace("WORKER_PATH", wasmPath)})()`;
  const objectUrl = URL.createObjectURL(
    new Blob([funcStr], { type: "text/javascript" })
  );
  const worker = new Worker(objectUrl);
  URL.revokeObjectURL(objectUrl);
  return worker;
}

function inlineWasmWorker() {
  let wasmResolve;
  const wasmReady = new Promise((resolve) => {
    wasmResolve = resolve;
  });

  self.addEventListener(
    "message",
    function (event: MessageEvent) {
      const { eventType, eventData, eventId } = event.data;

      switch (eventType) {
        case "INITIALISE":
          WebAssembly.instantiateStreaming(fetch("WORKER_PATH"), {})
            .then((instantiatedModule) => {
              const wasmExports = instantiatedModule.instance.exports;
              wasmResolve(wasmExports);
              self.postMessage({
                eventType: "INITIALISED",
                eventData: Object.keys(wasmExports),
              });
            })
            .catch((error) => {
              console.error(error);
            });
          break;
        case "CALL":
          wasmReady.then((wasmInstance) => {
            const prop = wasmInstance[eventData.prop];

            const result =
              typeof prop === "function"
                ? prop.apply(null, eventData.arguments)
                : prop;

            self.postMessage({
              eventType: "RESULT",
              eventData: result,
              eventId: eventId,
            });
          });
          break;
      }
    },
    false
  );
}
