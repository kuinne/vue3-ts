import { FunctionalComponent } from "vue";
import styles from "./style.module.scss";

type IProps = {
  x: number;
  y: number;
};

const Sprite: FunctionalComponent<IProps> = (props, { slots }) => {
  const { x, y } = props;
  return (
    <g class={styles["sprite-container"]} transform={`translate(${x}, ${y})`}>
      {slots.default?.()}
    </g>
  );
};

export default Sprite;
