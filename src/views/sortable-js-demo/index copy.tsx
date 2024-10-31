import { defineComponent, getCurrentInstance, nextTick, ref, watch } from "vue";
import Sortable from "sortablejs";
import { cloneDeep, isNil } from "lodash";
export default defineComponent({
  setup() {
    const show = ref(true);
    const target = ref<HTMLDivElement>();
    const index = ref(0);
    const data = ref<{ id: number; name: string }[]>([]);
    const handleAdd = () => {
      console.log("data.value", cloneDeep(data.value));
      data.value.push({
        id: index.value,
        name: `${index.value}`,
      });
      index.value += 1;
    };

    const handleLog = () => {
      console.log("res", res);
    };

    const { ctx } = getCurrentInstance();

    watch(target, () => {
      if (target.value) {
        const sortable = Sortable.create(target.value, {
          animation: 300,
          onEnd(event) {
            console.log("event", event);
            console.log("zzzz", sortable.toArray());

            const { newIndex, oldIndex } = event;
            if (isNil(newIndex) || isNil(oldIndex)) return;

            [data.value[newIndex], data.value[oldIndex]] = [
              data.value[oldIndex],
              data.value[newIndex],
            ];
          },
          store: {
            get() {
              return data.value;
            },
            set(sortable) {
              console.log("sortable", sortable.toArray());
            },
          },
        });
      }
    });
    return () => (
      <div>
        <div ref={target}>
          {data.value.map((item, index) => (
            <div key={item.id} data-id={item.id}>
              {item.name}
            </div>
          ))}
        </div>
        <button onClick={handleAdd}>add</button>
        <button onClick={handleLog}>log</button>
      </div>
    );
  },
});
