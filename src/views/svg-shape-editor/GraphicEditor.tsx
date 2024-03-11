import { PropType, defineComponent, reactive, ref, toRefs } from "vue";
import { ISprite, ISpriteMeta } from "./type";
import Stage from "./Stage";
import Sprite from "./Sprite";

interface IProps {
  width: number;
  height: number;
  onReady?: () => void;
}

interface IState {
  spriteList: ISprite[];
}

export const GraphicEditorCore = defineComponent({
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    onReady: {
      type: Function as PropType<IProps["onReady"]>,
    },
  },
  //   expose: ["registerSprite", "addSpriteToState"],

  setup(props, { expose }) {
    const registerSpriteMetaMap = ref<Record<string, ISpriteMeta>>({});

    const state = reactive<IState>({
      spriteList: [],
    });

    /**
     * 注册精灵
     * @param spriteMeta sprite
     */
    const registerSprite = (spriteMeta: ISpriteMeta) => {
      if (registerSpriteMetaMap.value[spriteMeta.type]) {
        console.warn(`Sprite ${spriteMeta.type} is already registered.`);
        return;
      }

      registerSpriteMetaMap.value[spriteMeta.type] = spriteMeta;
    };

    const addSpriteToStage = (sprite: ISprite | ISprite[]) => {
      if (Array.isArray(sprite)) {
        state.spriteList.push(...sprite);
      } else {
        state.spriteList.push(sprite);
      }
    };

    expose({
      registerSprite,
      addSpriteToStage,
    });

    return () => {
      const { width, height } = toRefs(props);
      const { spriteList } = toRefs(state);

      return (
        <Stage width={width.value} height={height.value}>
          {/* 精灵列表 */}
          {spriteList.value.map((sprite) => {
            // 从注册好的精灵映射里拿到meta和精灵组件
            const spriteMeta = registerSpriteMetaMap.value[sprite.type];

            const SpriteComponent =
              spriteMeta?.spriteComponent ||
              ((props: any) => (
                <text fill="red">Undefined Sprite: {sprite.type}</text>
              ));

            const { attrs } = sprite;

            return (
              <Sprite
                key={sprite.id}
                x={attrs.coordinate.x}
                y={attrs.coordinate.y}
              >
                <SpriteComponent sprite={sprite} />
              </Sprite>
            );
          })}
        </Stage>
      );
    };
  },
});
