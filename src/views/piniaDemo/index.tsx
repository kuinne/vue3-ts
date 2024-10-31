import { defineComponent, onMounted, onUnmounted } from "vue";
import { useCounterStore } from "./store/counter";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const store = useCounterStore();

    const {
      counter,
      name,
      isAdmin,
      doubleCount,
      doublePlusOne,
      doubleCountPlusOne,
    } = storeToRefs(store);
    const add = () => {
      counter.value++;
    };

    const reset = () => {
      store.$reset();
    };

    const patch = () => {
      store.$patch({
        counter: counter.value + 1,
        name: "Abalam",
      });
    };

    const replace = () => {
      store.$state = {
        counter: 666,
        name: "Paimon",
        isAdmin: false,
        users: [],
      };
    };

    const register = () => {
      store.registerUser();
    };

    onUnmounted(() => {
      store.$reset();
    });
    return () => (
      <div>
        <div>name: {name.value}</div>
        <div>counter: {counter.value}</div>
        <div>doubleCount: {doubleCount.value}</div>
        <div>doublePlusOne: {doublePlusOne.value}</div>
        <div>doubleCountPlusOne: {doubleCountPlusOne.value}</div>
        <div onClick={add}>add</div>
        <div onClick={reset}>reset</div>
        <div onClick={patch}>patch</div>
        <div onClick={replace}>replace</div>
        <div>User 2: {store.getUserById("2")}</div>
      </div>
    );
  },
});
