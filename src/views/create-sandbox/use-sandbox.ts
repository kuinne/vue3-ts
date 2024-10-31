import { onMounted, onUnmounted, ref, watch } from "vue";

export interface SandboxResult {
  success: boolean;
  result: any;
}

export function useSandbox() {
  const iframeRef = ref<HTMLIFrameElement | null>(null);

  const allowedOrigin = ref<string>(window.location.origin);

  const createIframe = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts", "allow-same-origin"); // 允许脚本运行和同源请求 allow-same-origin: 允许 iframe 中的内容与同源的内容交互。这对于使用 postMessage 和 MessageChannel 是必要的。
    iframe.srcdoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Sandbox</title>
        </head>
        <body>
            <script>
                const TIMEOUT = 5000; // 5秒超时

                const safeEval = (code) => {
                    const iframe = document.createElement('iframe')
                    document.body.appendChild(iframe);

                    const iframeWindow = iframe.contentWindow;
                    const result = iframeWindow.eval(code);

                    document.body.removeChild(iframe)
                    return result;
                }

                window.addEventListener('message', (event) => {
                    const { code } = event.data;

                    let result;
                    let success = true;
                    const start = Date.now();

                    try {
                        result = safeEval(code);

                        // 检查代码是否超时
                        if (Date.now() - start > TIMEOUT) {
                            throw new Error('Execution timeout');
                        }
                    } catch (error) {
                        success = false;
                        result = error.message
                    }

                    event.ports[0].postMessage({ success, result });
                })
            </script>
        </body>
        </html/>
        `;
    document.body.appendChild(iframe);
    return iframe;
  };

  const iframeRefLoaded = ref(false);

  const untilIframeLoaded = () => {
    if (!iframeRef.value) return false;
    return new Promise<boolean>((resolve) => {
      iframeRef.value!.onload = () => {
        resolve(true);
      };
      iframeRef.value!.onerror = () => {
        resolve(false);
      };
    });
  };

  const executeCode = (code: string): Promise<SandboxResult> => {
    return new Promise(async (resolve) => {
      if (!iframeRef.value) {
        iframeRef.value = createIframe();
      }
      if (!iframeRefLoaded.value) {
        iframeRefLoaded.value = await untilIframeLoaded();
      }
      const messageChannel = new MessageChannel(); // 使用 messageChannel 确保通信的安全性和专用性

      const handleMessage = (event: MessageEvent) => {
        if (event.origin === allowedOrigin.value && event.data) {
          messageChannel.port1.removeEventListener("message", handleMessage);
          resolve(event.data);
        }
      };

      messageChannel.port1.addEventListener("message", handleMessage);
      const sendMessage = () => {
        const iframeWindow = iframeRef.value!.contentWindow;
        if (iframeWindow) {
          iframeWindow.postMessage({ code }, allowedOrigin.value, [
            messageChannel.port2,
          ]);
        }
      };

      if (iframeRef.value.contentWindow?.document.readyState === "complete") {
        sendMessage();
      } else {
        // 否则等待 iframe 加载完成后发送消息
        iframeRef.value!.onload = () => {
          sendMessage();
          iframeRef.value!.onload = null; // 清理 onload 事件监听器
        };
      }
    });
  };

  onUnmounted(() => {
    if (iframeRef.value) {
      document.body.removeChild(iframeRef.value);
    }
  });

  return {
    executeCode,
  };
}
