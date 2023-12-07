import { PropType, computed, defineComponent, ref, watch } from "vue";
import styles from "./style.module.scss";
import url from "./img.jpeg";
import fullImageUrl from "./08_2023-11-27 16_23_38.jpeg";
import { onMounted } from "vue";
import { nextTick } from "vue";
const borderWidth = 2;
const ImgZoom = defineComponent({
  props: {
    url: {
      type: String,
      required: true,
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
    rect: {
      type: Object as PropType<{
        Left: number;
        Right: number;
        Top: number;
        Bottom: number;
      }>,
      required: true,
    },
  },
  setup(props) {
    const boxStyle = computed(() => ({
      width: props.width + "px",
      height: props.height + "px",
      border: `${borderWidth}px solid #ccc`,
    }));
    const targetBoxStyle = ref({
      top: 0 + "px",
      left: 0 + "px",
      width: 0 + "px",
      height: 0 + "px",
    });

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

    const initMaskStyle = async () => {
      if (!targetBoxRef.value) {
        await new Promise((r) => {
          watch(targetBoxRef, () => {
            if (targetBoxRef.value) {
              r("");
            }
          });
        });
      }

      const { offsetWidth, offsetHeight, offsetLeft, offsetTop } =
        targetBoxRef.value!;

      const x = offsetLeft + offsetWidth / 2;
      const y = offsetTop + offsetHeight / 2;

      renderMask(x, y);
    };
    const initTargetBoxStyle = (image: HTMLImageElement) => {
      const originRect = props.rect;
      const factor = 8192;

      const rect = {
        left: originRect.Left / factor,
        top: originRect.Top / factor,
        width: (originRect.Right - originRect.Left) / factor,
        height: (originRect.Bottom - originRect.Top) / factor,
      };
      const scale = image.naturalWidth / props.width;
      const imageWidth = image.naturalWidth / scale;
      const imageHeight = image.naturalHeight / scale;
      // @ts-ignore
      targetBoxStyle.value = Object.entries(rect).reduce(
        (acc, [key, value]) => {
          if (["top", "height"].includes(key)) {
            // @ts-ignore
            acc[key] = `${value * imageHeight}px`;
          }
          if (["left", "width"].includes(key)) {
            // @ts-ignore
            acc[key] = `${value * imageWidth}px`;
          }
          return acc;
        },
        {}
      );
    };

    const handleMouseover = (e: MouseEvent) => {};

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

    const getImageInfo = (): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          resolve(image);
        };
        image.src = props.url;
      });
    };

    watch(
      () => props.url,
      async () => {
        if (props.url) {
          const image = await getImageInfo();
          initTargetBoxStyle(image);
          await nextTick();
          initMaskStyle();
        }
      },
      {
        immediate: true,
      }
    );

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
            style={targetBoxStyle.value}
            ref={targetBoxRef}
          ></div>
        </div>
        <div class={[styles["box"], styles["big"]]} style={boxStyle.value}>
          <img src={props.url} ref={imgRef} style={imgStyle.value} />
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
          url={fullImageUrl}
          width={520}
          height={292.5}
          rect={{
            Left: 6528,
            Top: 3898,
            Right: 6946,
            Bottom: 4596,
          }}
        />
        <ImgZoom
          url={"http://172.168.70.9/v1/image/data?id=2390986&type=0"}
          width={520}
          height={292.5}
          rect={{
            Left: 913,
            Top: 2867,
            Right: 1143,
            Bottom: 3868,
          }}
        />
      </>
    );
  },
});
