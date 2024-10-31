import {
  PropType,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import Draggable from "vuedraggable";
import { cloneDeep, isNil } from "lodash";

const IInput = defineComponent({
  props: {
    modelValue: {
      type: String,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      () => {
        console.log("inputchange", props.modelValue);
      }
    );

    return () => (
      <input
        v-model={inputValue.value}
        onChange={() => {
          emit("update:modelValue", inputValue.value);
        }}
      />
    );
  },
});
const List = defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<{ id: number; name: string }[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    const index = ref(0);
    const data = ref<{ id: number; name: string }[]>(props.modelValue);
    const handleAdd = () => {
      console.log("data.value", cloneDeep(data.value));
      data.value.push({
        id: index.value,
        name: `${index.value}`,
      });
      index.value += 1;
    };

    const handleLog = () => {};

    watch(
      () => props.modelValue,
      () => {
        data.value = props.modelValue;
      }
    );

    watch(data.value, () => {});

    return () => (
      <div>
        <Draggable
          v-model={data.value}
          itemKey="id"
          onEnd={() => {
            console.log("zzz");

            emit("update:modelValue", data.value);
          }}
        >
          {{
            item: ({ element }) => (
              <div>
                {element.name}
                {slots.default?.({ item: element })}
              </div>
            ),
          }}
        </Draggable>
        <button onClick={handleAdd}>add</button>
        <button onClick={handleLog}>log</button>
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    const list = ref<{ id: number; name: string }[]>([]);

    return () => (
      <div>
        <List v-model={list.value}>
          {{
            default: ({ item }) => <IInput v-model={item.name} />,
          }}
        </List>
        <button
          onClick={() => {
            console.log("list", list.value);
          }}
        >
          log
        </button>
      </div>
    );
  },
});
