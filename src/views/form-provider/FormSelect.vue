<template>
  <select :value="value" @change="handleChange">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import FormItemProvider from "./FormItemProvider.vue";
import { PropType } from "vue";
import { formItemContextKey } from "./constants";

interface Option {
  value: string;
  label: string;
}
export default defineComponent({
  name: "FormSelect",
  components: {
    FormItemProvider,
  },
  props: {
    options: {
      type: Array as PropType<Option[]>,
    },
  },
  setup(props) {
    const formItemContext = inject(formItemContextKey);
    if (!formItemContext) {
      throw new Error("FormSelect must be used within a FormProvider");
    }
    const { value, updateValue, error, validate } = formItemContext;

    const handleChange = (e: any) => {
      updateValue(e.target?.value);
    };

    return {
      value,
      error,
      handleChange,
      validate,
    };
  },
});
</script>
