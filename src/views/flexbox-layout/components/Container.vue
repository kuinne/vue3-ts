<template>
  <div class="container">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="body" ref="bodyRef">
      <el-scrollbar v-if="bodyHeight" :height="bodyHeight">
        <div class="inner">
          <slot />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, toRefs } from "vue";
const bodyRef = ref<HTMLDivElement | null>();
const bodyHeight = ref(0);
const props = withDefaults(
  defineProps<{
    flexDirection?: string;
  }>(),
  {
    flexDirection: "row",
  }
);

const { flexDirection } = toRefs(props);
onMounted(() => {
  bodyHeight.value = bodyRef.value?.clientHeight!;
  window.addEventListener("resize", () => {
    bodyHeight.value = 0;
    nextTick(() => {
      bodyHeight.value = bodyRef.value?.clientHeight!;
    });
  });
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #557;
  font-family: "Exo", Arial, sans-serif;
  color: #fff;

  .header {
    display: flex;
    gap: 10px;
  }
  .body {
    flex: 1;

    .el-scrollbar {
      width: 100%;
    }
    .inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: v-bind(flexDirection);
      gap: 10px;
      padding: 1rem;
    }
  }
}
</style>
