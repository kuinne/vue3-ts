export function workerSandbox(code: string) {
  const blob = new Blob([code]);
  const worker = new Worker(window.URL.createObjectURL(blob));
}
