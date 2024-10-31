import type { Fn } from "@vueuse/shared";
import { noop } from "lodash";
import {
  Ref,
  computed,
  defineComponent,
  isRef,
  ref,
  shallowRef,
  watchEffect,
} from "vue";
export type AsyncComputedOnCancel = (cancelCallback: Fn) => void;

export interface AsyncComputedOptions {
  /**
   * @default false
   */
  lazy?: boolean;
  evaluation?: Ref<boolean>;

  shallow?: boolean;
  onError?: (e: unknown) => void;
}

export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  initialState?: T,
  optionsOrRef?: Ref<boolean> | AsyncComputedOptions
): Ref<T> {
  let options: AsyncComputedOptions;

  if (isRef(optionsOrRef)) {
    options = {
      evaluation: optionsOrRef,
    };
  } else {
    options = optionsOrRef || {};
  }

  const {
    lazy = false,
    evaluation = undefined,
    shallow = true,
    onError = noop,
  } = options;

  const started = ref(!lazy);

  const current = (
    shallow ? shallowRef(initialState) : ref(initialState)
  ) as Ref<T>;

  let triggerCount = 0;

  watchEffect(async (onInvalidate) => {
    console.log("watchEffect");

    if (!started.value) {
      return;
    }
    triggerCount++;
    const triggerCountAtStart = triggerCount;
    let hasFinished = false;

    if (evaluation) {
      Promise.resolve().then(() => {
        evaluation.value = true;
      });
    }

    try {
      const result = await evaluationCallback((cancelCallback) => {
        onInvalidate(() => {
          if (evaluation) {
            evaluation.value = false;
          }

          if (!hasFinished) {
            cancelCallback();
          }
        });
      });

      if (triggerCountAtStart === triggerCount) {
        current.value = result;
      }
    } catch (e) {
      onError(e);
    } finally {
      if (evaluation && triggerCountAtStart === triggerCount) {
        evaluation.value = false;
      }
      hasFinished = true;
    }
  });

  if (lazy) {
    return computed(() => {
      started.value = true;
      return current.value;
    });
  } else {
    return current;
  }
}

export default defineComponent({
  setup() {
    const evaluation = ref(false);
    const id = ref(1);
    const flag = ref(true);
    const fetchData = (data: any) =>
      new Promise((resolve) => {
        setTimeout(
          () => {
            resolve(data);
          },
          flag.value ? 5000 : 300
        );
      });
    const data = computedAsync(
      async () => {
        return await fetchData(id.value);
      },
      "ok",
      evaluation
    );
    return () => (
      <div>
        evaluation: {evaluation.value + ""}
        <br />
        data: {data.value}
        <div
          onClick={() => {
            id.value += 1;
            flag.value = !flag.value;
          }}
        >
          change
        </div>
      </div>
    );
  },
});
