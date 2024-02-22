import { defineComponent, ref, watch } from "vue";

class RectFactory {
  ctx!: CanvasRenderingContext2D;
  startX!: number;
  startY!: number;
  endX!: number;
  endY!: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    this.ctx = ctx;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  get minX() {
    return Math.min(this.startX, this.endX);
  }

  get maxX() {
    return Math.max(this.startX, this.endX);
  }

  get minY() {
    return Math.min(this.startY, this.endY);
  }

  get maxY() {
    return Math.max(this.startY, this.endY);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.minX, this.minY);
    this.ctx.lineTo(this.maxX, this.minY);
    this.ctx.lineTo(this.maxX, this.maxY);
    this.ctx.lineTo(this.minX, this.maxY);
    this.ctx.lineTo(this.minX, this.minY);
    this.ctx.fillStyle = "#ffb60f";
    this.ctx.fill();
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineCap = "square";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  // 判断当前点击位置是否在图形内部
  isInside(x: number, y: number) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }
}

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement>();

    const w = 1200,
      h = 800;

    const shapeCollection = ref<RectFactory[]>([]);

    // 鼠标点击canvas， 查看是否点击到了已绘制的路线，若是，则返回相关线的对象
    const getRect = (x: number, y: number) => {
      for (let i = shapeCollection.value.length - 1; i >= 0; i--) {
        const element = shapeCollection.value[i];
        if (element.isInside(x, y)) {
          return element;
        }
      }
      return null;
    };

    const drawRect = (
      e: MouseEvent,
      clickX: number,
      clickY: number,
      rect: DOMRect,
      ctx: CanvasRenderingContext2D
    ) => {
      const shape = new RectFactory(ctx, clickX, clickY);
      shapeCollection.value.push(shape);

      window.onmousemove = (evt) => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        shape.endX = evt.clientX - rect.left;
        shape.endY = evt.clientY - rect.top;
      };
    };

    const moveRect = (
      e: MouseEvent,
      clickX: number,
      clickY: number,
      rect: DOMRect,
      shape: RectFactory,
      ctx: CanvasRenderingContext2D
    ) => {
      const { startX, startY, endX, endY } = shape;
      window.onmousemove = (evt) => {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        const distanceX = evt.clientX - rect.left - clickX;
        const distanceY = evt.clientY - rect.top - clickY;
        shape.startX = startX + distanceX;
        shape.startY = startY + distanceY;
        shape.endX = endX + distanceX;
        shape.endY = endY + distanceY;
      };
    };

    const draw = () => {
      requestAnimationFrame(draw);
      for (const pp of shapeCollection.value) {
        pp.draw();
      }
    };

    watch(canvas, () => {
      if (!canvas.value) return;

      const ctx = canvas.value.getContext("2d");

      canvas.value.width = w * devicePixelRatio;
      canvas.value.height = h * devicePixelRatio;

      canvas.value.onmousedown = (e) => {
        const rect = canvas.value.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const shape = getRect(clickX, clickY);

        if (shape) {
          moveRect(e, clickX, clickY, rect, shape, ctx);
        } else {
          drawRect(e, clickX, clickY, rect, ctx);
        }
      };

      canvas.value.onmouseup = () => {
        window.onmousemove = null;
      };

      draw();
    });
    return () => (
      <div>
        <canvas ref={canvas} style="background-color: #94e8ea"></canvas>
      </div>
    );
  },
});
