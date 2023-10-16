import {
  defineComponent,
  toRefs,
  SetupContext,
  renderSlot,
  SlotsType,
} from "vue";
import { Item } from "./types";

// type Emits = ["select"];

type Emits<T> = {
  select: (item: T) => void;
};

export default defineComponent(
  <T extends Item>(
    props: { items: T[]; selected: T },
    { emit, slots }: SetupContext<Emits<T>>
  ) => {
    const { items, selected } = toRefs(props);
    const handleSelect = (item: T) => {
      emit("select", item);
    };
    return () => {
      <ul>
        {items.value.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              handleSelect(item);
            }}
          >
            <h3>{item.name}</h3>
            <div>{slots.item?.(item, index)}</div>
          </li>
        ))}
      </ul>;
    };
  },
  {
    props: ["items", "selected"],
    emits: ["select"],
    slots: {},
  }
);
