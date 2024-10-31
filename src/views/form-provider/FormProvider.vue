<template>
  <form @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>
<script lang="ts">
import { PropType, defineComponent, provide, reactive, ref, toRefs } from "vue";

import type { Rule, FormState } from "./type";
import { formContextKey } from "./constants";
import { cloneDeep } from "lodash";
export default defineComponent({
  name: "FormProvider",
  props: {
    modelValue: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "submit"],
  setup(props, { emit }) {
    const formState = reactive<FormState>({
      values: { ...props.modelValue },
      errors: {},
      rules: {},
    });

    const registerField = (field: string, rules: Rule[]) => {
      formState.values[field] = formState.values[field];
      formState.errors[field] = "";
      formState.rules[field] = rules;
    };

    const validateField = (field: string) => {
      const rules = formState.rules[field];
      const value = formState.values[field];
      formState.errors[field] = "";

      for (const rule of rules) {
        if (!rule.validate(value)) {
          formState.errors[field] = rule.message;
          break;
        }
      }
    };

    const validateForm = () => {
      let isValid = true;
      for (const field in formState.rules) {
        validateField(field);
        if (formState.errors[field]) {
          isValid = false;
        }
      }
      return isValid;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        emit("submit", formState.values);
      }
    };

    const onChange = () => {
      emit("update:modelValue", cloneDeep(formState.values));
    };

    provide(formContextKey, {
      formState,
      registerField,
      validateField,
      onChange,
    });

    return {
      ...toRefs(formState),
      handleSubmit,
    };
  },
});
</script>
<style scoped lang="scss"></style>
