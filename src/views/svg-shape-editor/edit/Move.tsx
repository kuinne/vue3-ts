import {
  PropType,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { ICoordinate, ISizeCoordinate, ISprite, IStageApis } from "../type";
import { findParentByClass, isInputting } from "../helper";

interface IProps {
  info: ISizeCoordinate;
  angle?: number;
  stage: IStageApis;
  activeSpriteList: ISprite[];
  mousePointInState: (e: MouseEvent) => ICoordinate;
  getInitAttrMapData: () => any;
}

interface IState {
  moving: boolean;
}

const Move = defineComponent({
  props: {
    info: {
      type: Object as PropType<IProps["info"]>,
      required: true,
    },
    angle: {
      type: Number,
    },
    stage: {
      type: Object as PropType<IProps["stage"]>,
      required: true,
    },
    activeSpriteList: {
      type: Array as PropType<IProps["activeSpriteList"]>,
      required: true,
    },
    mousePointInState: {
      type: Function as PropType<IProps["mousePointInState"]>,
      required: true,
    },
    getInitAttrMapData: {
      type: Function as PropType<IProps["getInitAttrMapData"]>,
      required: true,
    },
  },
  setup(props) {
    const {} = toRefs(props);

    const state = reactive<IState>({
      moving: false,
    });

    const initData = ref<any>({});

    const handleMoveAdsorbent = (mousePoint: ICoordinate) => {
      const { initMousePos } = props.getInitAttrMapData();
      const move = {
        x: mousePoint.x - initMousePos.x,
        y: mousePoint.y - initMousePos.y,
      };
      return move;
    };

    const move_mouseDown = (e: any) => {
      initData.value = props.getInitAttrMapData();
      const spriteDom = findParentByClass(e.target, "sprite-container");
      if (!spriteDom || isInputting()) {
        return;
      }
      addEventListener("pointermove", move_mouseMove, false);
      addEventListener("pointerup", move_mouseUp, false);
    };

    const move_mouseUp = () => {
      if (state.moving) {
        state.moving = false;
      }
      removeEventListener("pointermove", move_mouseMove, false);
      removeEventListener("pointerup", move_mouseUp, false);
    };

    const move_mouseMove = (e: any) => {
      const { mousePointInState } = props;
      const { initMousePos, initPosMap } = initData.value;
      const mousePoint = mousePointInState(e);
      const { x, y } = initMousePos;
      if (
        isInputting() ||
        (Math.abs(mousePoint.x - x) < 3 && Math.abs(mousePoint.y - y) < 3)
      ) {
        return;
      }

      const move = handleMoveAdsorbent(mousePoint);
      props.activeSpriteList.forEach((sprite: ISprite, i: number) => {
        const x = move.x + initPosMap[sprite.id]?.x;
        const y = move.y + initPosMap[sprite.id]?.y;
        props.activeSpriteList[i] = {
          ...sprite,
          attrs: {
            ...sprite.attrs,
            coordinate: { x, y },
          },
        };
      });
      state.moving = true;
    };

    const addEventListener = (...args: any) => {
      document.addEventListener(...args);
    };
    const removeEventListener = (...args: any) => {
      document.removeEventListener(...args);
    };

    onMounted(() => {
      addEventListener("pointerdown", move_mouseDown, false);
      addEventListener("pointerup", move_mouseUp, false);
    });

    onUnmounted(() => {
      removeEventListener("pointermove", move_mouseMove);
      removeEventListener("pointerup", move_mouseUp);
    });
  },
});

export default Move;
