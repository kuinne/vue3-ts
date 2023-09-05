import { ElOption, ElSelect } from "element-plus";
import { PropType, computed, defineComponent } from "vue";

export const AreaSelect = defineComponent({
  props: {
    modelValue: Array as PropType<number[]>,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // 获取国家列表

    const country = useCountryList();

    // 计算当前选中的国家，从这里拿到行政区域结构
    const currentCountry = computed(() => {
      return country.data.value?.data?.find(
        (i) => i.id === props.modelValue?.[0]
      );
    });

    const handleCountryChange = (value: number) => {
      if (value !== props.modelValue?.[0]) {
        // 国家变动后，重置掉后续的数据
        emit("update:modelValue", [value]);
      }
    };

    return () => {
      return (
        <div>
          <ElSelect
            modelValue={props.modelValue?.[0]}
            placeholder="请选择国家"
            onUpdate:modelValue={handleCountryChange}
            filterable
            fitInputWidth
            loading={country.isValidating.value}
          >
            {country.data.value?.data?.map((i) => {
              return (
                <ElOption key={i.id} label={i.name} value={i.id}></ElOption>
              );
            })}
          </ElSelect>

          {!!currentCountry.value &&
            currentCountry.value?.regionLevelInfos?.map((i, index) => {
              // 父区域 id
              const parentValue = props.modelValue?.[index];

              // 当前区域
              const value = props.modelValue?.[index + 1];

              // 父区域信息
              const parentRegion: RegionLevelDTO =
                index === 0
                  ? {
                      code: currentCountry.value?.code!,
                      name: currentCountry.value?.name!,
                    }
                  : currentCountry.value?.regionLevelInfos?.[index - 1];

              const handleChange = (nextValue: number) => {
                if (value === nextValue) {
                  return;
                }
                assert(
                  Array.isArray(props.modelValue),
                  "modelValue is required"
                );
                // 裁剪掉当前区域后面的区域数据
                const clone = [...props.modelValue].slice(0, index + 2);
                clone[index + 1] = nextValue;

                emit("update:modelValue", clone);
              };
              return (
                <Selection
                  index={index}
                  parentValue={parentValue}
                  modelValue={value}
                  region={i}
                  parentRegion={parentRegion}
                  country={currentCountry.value!}
                  onUpdate:modelValue={handleChange}
                />
              );
            })}
        </div>
      );
    };
  },
});

const Selection = defineComponent({
  name: "AreaSelectSection",
  props: {
    /**
     * 当前索引
     */
    index: { type: Number, required: true },

    /**
     * 区域信息
     */
    region: {
      type: Object as PropType<RegionLevelDTO>,
      required: true,
    },

    /**
     * 当前国家
     */
    country: { type: Object as PropType<CountryInfoDTO>, required: true },

    /**
     * 父级
     */
    parentRegion: { type: Object as PropType<RegionLevelDTO>, required: true },

    /**
     * 父级的值
     */
    parentValue: Number,

    /**
     * 当前值
     */
    modelValue: Number,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // 获取区域列表
    const region = useRegion(
      computed(() => {
        return {
          countryId: props.country.id,
          level: props.index + 1,
          parentId: props.parentValue,
        };
      })
    );

    const handleChange = (value: number) => {
      emit("update:modelValue", value);
    };
      
      return () => {
          return (
              <ElSelect modelValue={props.modelValue} placeholder={`请选择${props.region.name}`} filterable fitInputWidth disabled={!props.parentValue} onUpdate: modelValue={handleChange} loading={region.isValidating.value}>
                  {
                      region.data.value?.data?.map(i => {
                          return <ElOption key={i.id} label={i.name} value={i.id}></ElOption>
                      })
                  }
              </ElSelect>
          )
      }
  },
});
