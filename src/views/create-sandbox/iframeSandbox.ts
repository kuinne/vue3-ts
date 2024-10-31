export function iframeSandbox(code: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-same-origin"); // 允许与包含文档同源的文档交互。

  frame.onload = function (e) {};
  frame.contentWindow?.addEventListener("message", function (e) {
    const func = new frame.contentWindow.Function("dataInframe", code);
    parent.postMessage(func(e.data));

    window.postMessage(func(e.data));
  });
  document.body.appendChild(frame);
  window.addEventListener(
    "message",
    function (e) {
      console.log("parent - message from iframe: ", e.data);
    },
    false
  );
}
