export function functionSandbox(code: string) {
  const sandbox = {};

  const script = new Function("sandbox", `with(sandbox){${code}}`);

  return function () {
    script(sandbox);
  };
}
