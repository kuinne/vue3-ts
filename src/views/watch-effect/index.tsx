import { Ref, defineComponent, ref, watchEffect } from "vue";

const doAsyncWork = (data: any): Promise<{ response: any; cancel: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        response: data,
        cancel: () => {
          console.log("cancel");
        },
      });
    }, 0);
  });
};

const useTest = (evaluating?: Ref<boolean>) => {
  watchEffect(async () => {
    console.log("hello");
    if (evaluating) {
      evaluating.value = true;
    }

    await doAsyncWork("hello");

    evaluating.value = false;
  });
};
export default defineComponent({
  setup() {
    const evaluating = ref(false);

    useTest(evaluating);

    const change = () => {
      evaluating.value = !evaluating.value;
      //   console.log("evaluating", evaluating.value);
    };
    return () => <div onClick={change}>13a{evaluating.value + ""}</div>;
  },
});
