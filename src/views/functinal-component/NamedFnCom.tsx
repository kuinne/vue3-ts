import type { SetupContext } from "vue";

type Props = {
  msg: string;
};

type Events = {
  sendMsg(msg: string): void;
};

export function NamedFnCom(props: Props, ctx: SetupContext<Events>) {
  return (
    <button onClick={() => ctx.emit("sendMsg", props.msg)}>
      {props.msg} {"   "}
    </button>
  );
}
