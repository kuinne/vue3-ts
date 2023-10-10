import { defineComponent } from "vue";
import { useInstance } from "./use-instance";

const Child = defineComponent({
  methods: {
    save(msg: string) {},
  },
  setup(props, { expose }) {
    const say = () => {
      console.log("hello parent");
    };

    expose({
      say,
    });
    return <div>child</div>;
  },
});

export default defineComponent({
  setup() {
    const childRef = useInstance<typeof Child>();
    const handleClick = () => {
      childRef.value.save("hello");
    };
    return (
      <div>
        <Child></Child>
        <button onClick={handleClick}>save</button>
      </div>
    );
  },
});
