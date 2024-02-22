import { defineComponent, ref, watch } from "vue";
// https://www.w3cplus.com/canvas/understanding-linear-interpolation-in-ui-animations.html

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement>();

    watch(canvas, () => {
      if (!canvas.value) return;

      let context = canvas.value.getContext("2d");
      let width = (canvas.value.width = window.innerWidth);
      let height = (canvas.value.height = window.innerHeight);

      // PointA
      let startX = 50,
        startY = 50;

      // PointB
      let endX = 420,
        endY = 200;

      let x = startX,
        y = startY;

      update();

      window.addEventListener("click", (e) => {
        endX = e.pageX;
        endY = e.pageY;
      });

      function update() {
        context.clearRect(0, 0, width, height);
        drawBall(x, y, 30);
        x = lerp(x, endX, 0.1);
        y = lerp(y, endY, 0.1);
        requestAnimationFrame(update);
      }

      function drawBall(x: number, y: number, radius: number) {
        context.beginPath();
        context.fillStyle = "#66DA79";
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fill();
      }

      function lerp(min: number, max: number, fraction: number) {
        return (max - min) * fraction + min;
      }
    });
    return () => <canvas ref={canvas}></canvas>;
  },
});
