import { defineComponent, PropType, reactive, ref, toRefs } from "vue";
import type {
  ICoordinate,
  ISizeCoordinate,
  ISprite,
  ISpriteMeta,
  IStageApis,
  Line,
} from "../type";
import styles from "../style.module.scss";
import { transform } from "lodash";
import { getActiveSpriteRect } from "../helper";
import Move from "./Move";
interface IProps {
  scale: number;
  activeSpriteList: ISprite[];
  registerSpriteMetaMap: Record<string, ISpriteMeta>;
  stage: IStageApis;
  pressShift: boolean;
}
interface IState {
  mousePos: ICoordinate;
  auxiliaryLineList: Line[];
  ready: boolean;
  helpPoints: (ICoordinate & { color?: string })[];
}

const ActiveSpriteContainer = defineComponent({
  props: {
    scale: {
      type: Number,
      required: true,
    },
    activeSpriteList: {
      type: Object as PropType<IProps["activeSpriteList"]>,
      required: true,
    },
    registerSpriteMetaMap: {
      type: Object as PropType<IProps["registerSpriteMetaMap"]>,
      required: true,
    },
    stage: {
      type: Object as PropType<IProps["stage"]>,
      required: true,
    },
  },
  setup(props) {
    const state = reactive<IState>({
      mousePos: { x: 0, y: 0 },
      auxiliaryLineList: [],
      ready: false,
      helpPoints: [],
    });

    const activeRect = ref<ISizeCoordinate>({
      width: 0,
      height: 0,
      x: -10,
      y: 0,
    });

    const mousePointInStage = (e: MouseEvent) => {
      const { stage, scale = 1 } = props;
      const { pageX, pageY } = e;
      const { coordinate: statePos } = stage.store();
    };

    return () => {
      const { stage, activeSpriteList } = toRefs(props);
      const { ready, auxiliaryLineList } = toRefs(state);
      let info: ISizeCoordinate = { width: 0, height: 0, x: -10, y: 0 };
      const activeSingle = activeSpriteList.value.length === 1;
      const angle = activeSingle ? activeSpriteList.value[0].attrs.angle : 0;
      if (activeSpriteList.value.length > 0) {
        info = getActiveSpriteRect(activeSpriteList.value);
      }

      if (info.width < 0 || info.height < 0) {
        return null;
      }
      activeRect.value = { ...info };
      const { x, y, width, height } = info;
      const rotateStr = `rotate(${angle || 0}, ${x + width / 2} ${
        y + height / 2
      })`;

      return (
        <g class={styles["active-sprites-container"]} transform={rotateStr}>
          {/* 边框 */}
          <rect
            class={styles["active-sprites-content"]}
            x={info.x}
            y={info.y}
            width={info.width}
            height={info.height}
            stroke="#0076ed"
            fill="none"
          ></rect>
          {ready.value && (
            <Move
              info={info}
              angle={angle}
              stage={stage.value}
              activeSpriteList={activeSpriteList.value}
            />
          )}
        </g>
      );
    };
  },
});

export default ActiveSpriteContainer;
