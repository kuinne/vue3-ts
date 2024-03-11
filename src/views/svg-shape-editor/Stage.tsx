import { FunctionalComponent } from "vue";
import styles from "./style.module.scss";

type IProps = {
  width: number;
  height: number;
};

const Stage: FunctionalComponent<IProps> = (props, { slots }) => {
  const { width, height } = props;
  return (
    <svg
      class={styles["stage-container"]}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{
        width: width,
        height: height,
        outline: "1px solid #ddd",
      }}
    >
      {slots.default?.()}
    </svg>
  );
};

export default Stage;
