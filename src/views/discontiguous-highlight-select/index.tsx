import { computed, defineComponent, ref } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { match, filterMap } from "sdm2";
import styles from "./style.module.scss";
export const Simple = defineComponent({
  setup() {
    const value = ref("");
    const query = ref("");
    const options = ref([
      {
        value: "Beijing",
        label: "Beijing",
      },
      {
        value: "Shanghai",
        label: "Shanghai",
      },
      {
        value: "Nanjing",
        label: "Nanjing",
      },
      {
        value: "Chengdu",
        label: "Chengdu",
      },
      {
        value: "Shenzhen",
        label: "Shenzhen",
      },
      {
        value: "Guangzhou",
        label: "Guangzhou",
      },
    ]);

    const optionsComputed = computed(() =>
      options.value.filter(({ label }) =>
        match(label, query.value, {
          ignoreCase: true,
        })
      )
    );
    return () => (
      <ElSelect
        v-model={value.value}
        size="large"
        filterable
        filterMethod={(q) => (query.value = q)}
      >
        {optionsComputed.value.map(({ value, label }) => (
          <ElOption key={value} value={value} label={label}></ElOption>
        ))}
      </ElSelect>
    );
  },
});

export default defineComponent({
  setup() {
    const value = ref("");
    const query = ref("");
    const options = ref([
      {
        value: "Beijing",
        label: "Beijing",
      },
      {
        value: "Shanghai",
        label: "Shanghai",
      },
      {
        value: "Nanjing",
        label: "Nanjing",
      },
      {
        value: "Chengdu",
        label: "Chengdu",
      },
      {
        value: "Shenzhen",
        label: "Shenzhen",
      },
      {
        value: "Guangzhou",
        label: "Guangzhou",
      },
    ]);

    const optionsComputed = computed(() =>
      filterMap(options.value, query.value, {
        ignoreCase: true,
        matchStr: ({ label }) => label,
        onMatched: (matchedStr) =>
          `<span class="${styles["highlight"]}">${matchedStr}</span>`,

        onMap: ({ str, origin }) => {
          return {
            highlight: str,
            ...origin,
          };
        },
      })
    );
    return () => (
      <ElSelect
        v-model={value.value}
        size="large"
        filterable
        filterMethod={(q) => (query.value = q)}
      >
        {optionsComputed.value.map(({ value, label, highlight }) => (
          <ElOption key={value} value={value} label={label}>
            <div v-html={highlight}></div>
          </ElOption>
        ))}
      </ElSelect>
    );
  },
});
