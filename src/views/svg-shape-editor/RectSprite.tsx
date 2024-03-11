import { FunctionalComponent, computed, defineComponent, toRefs } from "vue";
import type {
  IBaseSpriteProps,
  IDefaultGraphicProps,
  ISpriteMeta,
} from "./type";

type IProps = IDefaultGraphicProps;

const SpriteType = "RectSprite";

export const Rect: FunctionalComponent<IProps> = (props) => (
  <rect x="0" y="0" stroke="#999" stroke-width="2" {...props}></rect>
);

export const RectSprite: FunctionalComponent<IBaseSpriteProps<IProps>> = (
  _props
) => {
  const { sprite } = _props;
  const { props, attrs } = sprite;
  const { width, height } = attrs.size;

  return <Rect {...props} x={0} y={0} width={width} height={height} />;
};

RectSprite.displayName = SpriteType;
// 描述精灵的元数据
export const RectSpriteMeta: ISpriteMeta<IProps> = {
  // 类型，精灵的名字，全局唯一
  type: SpriteType,
  // 精灵组件
  spriteComponent: RectSprite,
};

export default RectSprite;
