import { FunctionalComponent, defineComponent, toRefs } from "vue";
import type {
  IBaseSpriteProps,
  IDefaultGraphicProps,
  ISpriteMeta,
  Line,
} from "./type";

type IProps = Line & IDefaultGraphicProps;

const SpriteType = "LineSprite";

const Line: FunctionalComponent<IProps> = (props) => (
  <line
    x1={0}
    y1={0}
    x2={0}
    y2={0}
    stroke="#999"
    stroke-width="2"
    {...props}
  ></line>
);

const LineSprite: FunctionalComponent<IBaseSpriteProps<IProps>> = (_props) => {
  const { sprite } = _props;
  const { props, attrs } = sprite;
  return <Line {...props}></Line>;
};

LineSprite.displayName = SpriteType;

export const LineSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: LineSprite,
};

export default LineSprite;
