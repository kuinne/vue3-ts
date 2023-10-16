<template>
  <Child ref="childRef" />
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import Child from "./Child.vue";
const show = ref(false);
const childRef = ref<InstanceType<typeof Child>>();

onMounted(async () => {
  await nextTick();
  console.log("mounted");

  //   if (childRef.value?.childchildRef) {
  //     console.log("childchildRef yes");
  //   }
});

watch(
  () => childRef.value?.childchildRef,
  () => {
    if (childRef.value?.childchildRef) {
      console.log("zzzzzzz");
    }
  },
  {
    immediate: true,
  }
);
</script>
<style scoped lang="scss"></style>
