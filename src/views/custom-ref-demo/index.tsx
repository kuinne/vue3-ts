import { customRef, defineComponent } from "vue";
const fetchRef = (value: number) => {
  let res: number = value;
  return customRef<number>((track, trigger) => {
    function getTime(value: number) {
      setTimeout(() => {
        res = value;
        trigger();
      }, 2000);
    }
    return {
      get() {
        track();
        return res;
      },
      set(newValue) {
        value = newValue;
        getTime(value);
      },
    };
  });
};
export default defineComponent({
  setup() {
    const count = fetchRef(0);
    const change = () => {
      count.value += 1;
    };
    return () => (
      <div>
        <button onClick={change}>change</button>
        <div>{count.value}</div>
      </div>
    );
  },
});
