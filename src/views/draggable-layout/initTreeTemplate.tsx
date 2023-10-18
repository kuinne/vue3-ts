import { nanoid } from "nanoid";
import { defineComponent, h, toRefs } from "vue";
import { ElImage } from "element-plus";
/**
 * @description 动态创建3d模型组件的方法
 * @param config 组件参数配置信息
 */
export function createTreeDComponent(config: any) {
  const elementId = "answer" + nanoid();
  return defineComponent({
    props: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { width, height } = toRefs(props);

      if (width.value && height.value) {
        return () => (
          <div
            id={elementId}
            style={{
              width: width.value - 10 + "px",
              height: height.value - 10 + "px",
              pointerEvents: "none",
            }}
          >
            <ElImage src={props.icon} fit="scale-down"></ElImage>
          </div>
        );
      } else {
        return () => (
          <div style={{ width: "100%", height: "100%" }} id={elementId}>
            <ElImage src={props.icon} fit="scale-down"></ElImage>
          </div>
        );
      }
    },
  });
}
