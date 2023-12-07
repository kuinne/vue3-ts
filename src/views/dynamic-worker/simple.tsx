import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    const response = `onmessage = (e) => {
  console.log('Message received **from** main script');
  const {method, data} = e.data;
  if (data && method === 'format') {
    postMessage({
      data: {
        'res': 'I am a customized result string.',
      }
    });
  }
  console.log('Posting message back to main script');
}`;

    const blob = new Blob([response], {
      type: "application/javascript",
    });

    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (e) => {
      alert(`Response: ${e.data.data.res}`);
    };
    const send = () => {
      worker.postMessage({
        method: "format",
        data: [],
      });
    };

    return () => <div onClick={send}>s</div>;
  },
});
