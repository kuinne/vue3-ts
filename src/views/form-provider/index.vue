<template>
  <FormProvider v-model="formData" @submit="handleSubmit">
    <FormItemProvider name="username" :rules="usernameRules">
      <FormInput />
    </FormItemProvider>
    <FormItemProvider name="email" :rules="emailRules">
      <FormInput />
    </FormItemProvider>
    <FormItemProvider name="country" :rules="countryRules">
      <FormSelect :options="countryOptions" />
    </FormItemProvider>
  </FormProvider>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import FormProvider from "./FormProvider.vue";
import FormItemProvider from "./FormItemProvider.vue";
import FormInput from "./FormInput.vue";
import FormSelect from "./FormSelect.vue";
import { Rule } from "./type";

export default defineComponent({
  components: {
    FormProvider,
    FormItemProvider,
    FormInput,
    FormSelect,
  },
  setup() {
    const usernameRules: Rule[] = [
      {
        validate: (value: string) => !!value,
        message: "Username is required",
      },
    ];

    const emailRules: Rule[] = [
      {
        validate: (value: string) => !!value,
        message: "Email is required",
      },
      {
        validate: (value: string) => /\S+@\S+\.\S+/.test(value),
        message: "Email must be valid",
      },
    ];
    const countryRules: Rule[] = [
      {
        validate: (value: string) => !!value,
        message: "Country is required",
      },
    ];

    const countryOptions = [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "mx", label: "Mexico" },
    ];

    const handleSubmit = (formValues: Record<string, string>) => {
      console.log("Form Submitted:", formValues);
    };

    const formData = ref({
      username: "",
      email: "123@123.com",
      country: "us",
    });

    watch(formData, () => {
      console.log("formData", formData.value);
    });

    return {
      usernameRules,
      emailRules,
      countryRules,
      countryOptions,
      handleSubmit,
      formData,
    };
  },
});
</script>
<style scoped lang="scss"></style>
