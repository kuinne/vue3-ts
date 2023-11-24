import { PropType, computed, defineComponent, ref, watch } from "vue";
import styles from "./style.module.scss";
import url from "./img.jpeg";
import { onMounted } from "vue";
const borderWidth = 2;
const ImgZoom = defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
    zoomUrl: {
      type: String,
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    scale: {
      type: Number,
      default: 2.5,
    },
    fitMode: {
      type: String as PropType<
        "contain" | "cover" | "fill" | "none" | "scale-down"
      >,
      default: "contain",
    },
    target: {
      type: Object as PropType<{
        top: number;
        left: number;
        width: number;
        height: number;
      }>,
    },
  },
  setup(props) {
    const zoomUrl = computed(() => props.zoomUrl || props.url);
    const boxStyle = computed(() => ({
      width: props.width + "px",
      height: props.height + "px",
      border: `${borderWidth}px solid #ccc`,
    }));

    const targetBoxVisible = computed(() => props.target);
    const targetBoxStyle = computed(() => ({
      top: (props.target?.top || 0) + "px",
      left: (props.target?.left || 0) + "px",
      width: (props.target?.width || 0) + "px",
      height: (props.target?.height || 0) + "px",
    }));

    const imgStyle = computed(() => ({
      objectFit: props.fitMode,
    }));
    const boxRef = ref<HTMLDivElement | null>(null);
    const maskRef = ref<HTMLDivElement | null>(null);
    const imgRef = ref<HTMLImageElement | null>(null);
    const targetBoxRef = ref<HTMLImageElement | null>(null);
    const maskStyle = computed(() => ({
      width: (props.width - 2 * borderWidth) / props.scale + "px",
      height: (props.height - 2 * borderWidth) / props.scale + "px",
    }));

    const maskVisible = ref(true);

    const renderMask = (x: number, y: number) => {
      if (!maskRef.value || !imgRef.value) return;

      const contentWidth = props.width - 2 * borderWidth;
      const contentHeight = props.height - 2 * borderWidth;

      const maskWidth = parseFloat(maskStyle.value.width);
      const maskHeight = parseFloat(maskStyle.value.height);
      // 将获取到的鼠标的值给遮罩层（减去一半是因为让鼠标在遮罩层中间）
      let maskLeft = x - maskWidth / 2;
      let maskTop = y - maskHeight / 2;

      // 控制 mask移动的范围
      maskLeft = Math.min(Math.max(maskLeft, 0), contentWidth - maskWidth);
      maskTop = Math.min(Math.max(maskTop, 0), contentHeight - maskHeight);

      maskRef.value.style.left = maskLeft + "px";
      maskRef.value.style.top = maskTop + "px";
      imgRef.value.style.transform = `scale(${props.scale},${props.scale})`;
      imgRef.value.style.top = `-${maskTop * props.scale}px`;
      imgRef.value.style.left = `-${maskLeft * props.scale}px`;
    };

    const initStyle = () => {
      if (!boxRef.value || !maskRef.value || !targetBoxRef.value) return;

      const { offsetWidth, offsetHeight, offsetLeft, offsetTop } =
        targetBoxRef.value;

      const x = offsetLeft + offsetWidth / 2;
      const y = offsetTop + offsetHeight / 2;
      renderMask(x, y);
    };

    const handleMouseover = (e: MouseEvent) => {
      maskVisible.value = true;
    };

    const handleMousemove = (e: MouseEvent) => {
      if (!boxRef.value || !maskRef.value || !imgRef.value) return;
      const { pageX, pageY } = e;
      // 得到的x和 y 是鼠标在盒子内的左边
      const x = pageX - boxRef.value.offsetLeft;
      const y = pageY - boxRef.value.offsetTop;

      renderMask(x, y);
    };

    const handleMouseout = (e: MouseEvent) => {
      if (!imgRef.value) return;
    };

    onMounted(() => {
      initStyle();
    });

    return () => (
      <div class={styles["container"]}>
        <div
          class={styles["box"]}
          style={boxStyle.value}
          onMouseover={handleMouseover}
          onMousemove={handleMousemove}
          onMouseout={handleMouseout}
          ref={boxRef}
        >
          <img src={props.url} style={imgStyle.value} />
          <div
            class={styles["mask"]}
            ref={maskRef}
            style={maskStyle.value}
          ></div>
          <div
            class={styles["target-box"]}
            v-show={targetBoxVisible.value}
            style={targetBoxStyle.value}
            ref={targetBoxRef}
          ></div>
        </div>
        <div class={[styles["box"], styles["big"]]} style={boxStyle.value}>
          <img src={zoomUrl.value} ref={imgRef} style={imgStyle.value} />
        </div>
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    return () => (
      <>
        <ImgZoom
          url={
            "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg"
          }
          fitMode="fill"
          width={400}
          height={400}
          target={{
            top: 100,
            left: 180,
            width: 110,
            height: 100,
          }}
        />
      </>
    );
  },
});
