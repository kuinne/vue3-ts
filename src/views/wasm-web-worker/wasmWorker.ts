import workerUrl from "./worker?url";
export function wasmWorker(modulePath: string) {
  // Create an object to later interact with
  const proxy = {};

  let id = 0;
  let idPromises = {};

  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl);
    worker.postMessage({ eventType: "INITIALISE", eventData: modulePath });
    worker.addEventListener("message", function (event: any) {
      {
        const { eventType, eventData, eventId } = event.data;

        if (eventType === "INITIALISED") {
          const methods = event.data.eventData;

          methods.forEach((method) => {
            proxy[method] = function () {
              return new Promise((resolve, reject) => {
                worker.postMessage(
                  JSON.parse(
                    JSON.stringify({
                      eventType: "CALL",
                      eventData: {
                        method: method,
                        arguments: Array.from(arguments),
                      },
                      eventId: id,
                    })
                  )
                );
                idPromises[id] = { resolve, reject };
                id++;
              });
            };
          });
          resolve(proxy);
          return;
        } else if (eventType === "RESULT") {
          if (eventId !== undefined && idPromises[eventId]) {
            idPromises[eventId].resolve(eventData);
            delete idPromises[eventId];
          }
        } else if (eventType === "ERROR") {
          if (eventId !== undefined && idPromises[eventId]) {
            idPromises[eventId].reject(event.data.eventData);
            delete idPromises[eventId];
          }
        }
      }
    });
    worker.addEventListener("error", function (error) {
      reject(error);
    });
  });
}
