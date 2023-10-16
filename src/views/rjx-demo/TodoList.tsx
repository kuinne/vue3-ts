import { defineComponent, onMounted, ref } from "vue";
import { filter, fromEvent, map, merge, mergeMap, tap } from "rxjs";

export default defineComponent({
  setup() {
    const inputRef = ref<HTMLInputElement>();
    const addBtnRef = ref<HTMLButtonElement>();
    const list = ref<any>([]);

    const createTodoItem = (val: string) => {
      list.value.push(val);
    };
    onMounted(() => {
      if (!inputRef.value || !addBtnRef.value) return;

      const enter$ = fromEvent<KeyboardEvent>(inputRef.value, "keydown").pipe(
        filter((r) => r.keyCode === 13)
      );

      const clickAdd$ = fromEvent<MouseEvent>(addBtnRef.value, "click");

      const input$ = merge(enter$, clickAdd$);

      const app$ = input$.pipe(
        map(() => inputRef.value?.value || ""),
        filter((r) => r !== ""),
        map(createTodoItem),
        tap(() => {
          inputRef.value!.value = "";
        })
      );

      app$.subscribe();
    });

    return () => (
      <div>
        <input ref={inputRef}></input>
        <button ref={addBtnRef}>ADD</button>
        <ul>
          {list.value.map((item) => (
            <li> {item}</li>
          ))}
        </ul>
      </div>
    );
  },
});
