import { defineComponent, getCurrentInstance, nextTick, ref, watch } from "vue";
import SortableJs from "sortablejs";
import { Sortable } from "sortablejs-vue3";
import { Swap } from "sortablejs/modular/sortable.core.esm";

import { cloneDeep, isNil } from "lodash";
SortableJs.mount(new Swap());
export default defineComponent({
  setup() {
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

    const handleLog = () => {};

    const moveItemInArray = (array: any[], from: number, to: number) => {
      const item = array.splice(from, 1)[0];
      nextTick(() => array.splice(to, 0, item));
    };

    return () => (
      <div>
        <Sortable
          list={data.value}
          itemKey="id"
          tag="div"
          options={{ animation: 300 }}
          onEnd={(event) => {
            moveItemInArray(data.value, event.oldIndex, event.newIndex);
          }}
          onAdd={() => {}}
        >
          {{
            item: ({ element, index }: any) => <div>{element.name}</div>,
          }}
        </Sortable>
        <button onClick={handleAdd}>add</button>
        <button onClick={handleLog}>log</button>
      </div>
    );
  },
});
