import type { FunctionalComponent, Prop } from "vue";

type Props = {
  msg: string;
};

type Events = {
  sendMsg(msg: string): void;
};

export const AnonymousFnCom: FunctionalComponent<Props, Events> = (
  props,
  ctx
) => {
  return (
    <button onClick={() => ctx.emit("sendMsg", props.msg)}>
      {props.msg} {"   "}
    </button>
  );
};
