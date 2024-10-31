<template>
  <div>
    <slot />
    <span v-if="error">{{ error }}</span>
  </div>
</template>
<script lang="ts">
import { PropType, computed, defineComponent, inject, provide, ref } from "vue";
import { type Rule } from "./type";

import { formContextKey, formItemContextKey } from "./constants";
export default defineComponent({
  name: "FormItemProvider",
  props: {
    name: {
      type: String,
      required: true,
    },
    rules: {
      type: Array as PropType<Rule[]>,
      default: () => [],
    },
  },
  setup(props) {
    const formContext = inject(formContextKey);
    if (!formContext) {
      throw new Error("FormItemProvider must be used within a FormProvider");
    }

    const { formState, registerField, validateField, onChange } = formContext;

    registerField(props.name, props.rules);

    const value = computed(() => formState.values[props.name]);
    const error = computed(() => formState.errors[props.name]);

    const updateValue = (value: any) => {
      formState.values[props.name] = value;
      onChange();
    };

    const validate = () => {
      validateField(props.name);
    };

    provide(formItemContextKey, {
      value: value.value,
      error: error.value,
      updateValue,
      validate,
    });

    return {
      value,
      error,
      updateValue,
      validate,
    };
  },
});
</script>
