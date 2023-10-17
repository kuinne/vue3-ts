<template>
  <ElSelect v-model="product.productId" @change="handleChange">
    <ElOption value="1" label="产品1"></ElOption>
    <ElOption value="2" label="产品2"></ElOption>
  </ElSelect>
</template>

<script setup lang="ts">
import { ref, withDefaults } from "vue";
import { ElInput, ElOption, ElSelect } from "element-plus";
import { watch } from "vue";
const props = withDefault(
  defineProps<{
    modelValue?: {
      productId?: string;
      productName?: string;
    };
  }>()
);
const emits = defineEmits<{
  ($event: "update:modelValue", value: any): void;
}>();

const options = ref([
  {
    value: "1",
    label: "产品1",
  },
  {
    value: "2",
    label: "产品2",
  },
]);

const product = ref(props.modelValue);

watch(
  () => props.modelValue,
  () => {
    product.value = props.modelValue;
  }
);

const handleChange = (key: string) => {
  product.value.productName = options.value.find((i) => i.value === key)?.label;

  emits("update:modelValue", product.value);
};
</script>

<style></style>
