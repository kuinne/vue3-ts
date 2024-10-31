<template>
  <input :value="value" @input="handleInput" @blur="validate" />
</template>
<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import FormItemProvider from "./FormItemProvider.vue";
import { formItemContextKey } from "./constants";
export default defineComponent({
  name: "FormInput",
  components: {
    FormItemProvider,
  },
  setup(props) {
    const formItemContext = inject(formItemContextKey);
    if (!formItemContext) {
      throw new Error("FormInput must be used within a FormProvider");
    }
    const { value, updateValue, error, validate } = formItemContext;

    const handleInput = (e: any) => {
      updateValue(e.target?.value);
    };
    return {
      value,
      error,
      handleInput,
      validate,
    };
  },
});
</script>
