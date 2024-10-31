import {
  MaybeRef,
  MaybeRefOrGetter,
  Ref,
  computed,
  customRef,
  defineComponent,
  effectScope,
  getCurrentScope,
  nextTick,
  onScopeDispose,
  onUnmounted,
  ref,
  toValue,
  watch,
  watchEffect,
} from "vue";
import {
  LocationAsRelativeRaw,
  RouteParamValueRaw,
  Router,
  useRoute,
  useRouter,
} from "vue-router";
// import { useRouteParams } from "@vueuse/router";

export interface ReactiveRouteOptions {
  mode?: MaybeRef<"replace" | "push">;

  route?: ReturnType<typeof useRoute>;

  router?: ReturnType<typeof useRouter>;
}

export interface ReactiveRouteOptionsWithTransform<V, R>
  extends ReactiveRouteOptions {
  transform?: (val: V) => R;
}

const _queue = new WeakMap<Router, Map<string, any>>();
export function useRouteParams(name: string): Ref<null | string | string[]>;
export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
  K = T
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>;
export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
  K = T
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options: ReactiveRouteOptionsWithTransform<T, K> = {}
): Ref<K> {
  const {
    mode = "replace",
    route = useRoute(),
    router = useRouter(),
    transform = (value) => value as any as K,
  } = options;

  if (!_queue.has(router)) {
    _queue.set(router, new Map());
  }

  const _paramsQueue = _queue.get(router);

  let param = route.params[name] as any;

  tryOnScopeDispose(() => {
    param = undefined;
  });

  let _trigger: () => void;
  const proxy = customRef<any>((track, trigger) => {
    return {
      get() {
        track();
        return transform(
          param !== undefined && param !== "" ? param : toValue(defaultValue)
        );
      },
      set(v) {
        if (param === v) {
          return;
        }
        param = v === defaultValue || v === null ? undefined : v;
        _paramsQueue.set(
          name,
          v === defaultValue || v === null ? undefined : v
        );
        trigger();
        nextTick(() => {
          if (_paramsQueue?.size === 0) {
            return;
          }

          const newParams = Object.fromEntries(_paramsQueue?.entries());
          _paramsQueue?.clear();
          const { params, query, hash } = route;
          router[toValue[mode]]({
            params: {
              ...params,
              ...newParams,
            },
            query,
            hash,
          } as LocationAsRelativeRaw);
        });
      },
    };
  });

  watch(
    () => route.params[name],
    (v) => {
      param = v;
      _trigger();
    },
    {
      flush: "sync",
    }
  );
  return proxy as Ref<K>;
}

export function tryOnScopeDispose(fn: any) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}

function useTest() {
  console.log("getCurrentScope", getCurrentScope());

  onUnmounted(() => {
    console.log("onUnmounted");
  });
  onScopeDispose(() => {
    console.log("onScopeDispose");
  });
}

const scope = effectScope();

scope.run(() => {
  const counter = ref(0);
  const doubled = computed(() => counter.value * 2);
  watch(doubled, () => {
    console.log("doubled", doubled.value);
  });

  watchEffect(() => {
    console.log("Count: ", doubled.value);
  });
});

export default defineComponent({
  setup() {
    const id = useRouteParams("id", Date.now() + "");
    const change = () => {
      id.value = Date.now() + "";
    };
    useTest();

    return () => {
      return <div onClick={change}>{id.value}</div>;
    };
  },
});
