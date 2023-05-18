import { defineStore } from "pinia";

export const useCounterStore = defineStore("counterStore", {
  state: () => {
    return {
      counter: 0,
      name: "Eduardo",
      isAdmin: true,
      users: [],
    };
  },
  getters: {
    doubleCount: (state) => state.counter * 2,
    doublePlusOne(): number {
      return this.counter * 2 + 1;
    },
    /**
     * 返回计数器值乘以二加一。
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // @ts-ignore
      return this.doubleCount + 1;
    },
    getUserById: (state) => {
      return (userId: string) => state.users.find((user) => user.id === userId);
    },
    otherGetter(state) {
      // const otherStore = useOtherStore()
      // return state.localdata + otherStore.data
    },
  },
  actions: {
    increment() {
      this.counter++;
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random());
    },
    async registerUser(login, password) {
      //  try {
      //    this.userData = await api.post({ login, password });
      //    showTooltip(`Welcome back ${this.userData.name}!`);
      //  } catch (error) {
      //    showTooltip(error);
      //    // 让表单组件显示错误
      //    return error;
      //  }
    },
    async fetchUserPreferences(preferences) {
      //   const auth = useAuthStore();
      //   if (auth.isAuthenticated) {
      //     this.preferences = await fetchPreferences();
      //   } else {
      //     throw new Error("User must be authenticated");
      //   }
    },
  },
});
