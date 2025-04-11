<template>
  <div class="grid-container" :style="gridContainerStyle">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { computed, CSSProperties, toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    cols?: number;
    rowGap?: string;
    columnGap?: string;
    width?: string;
    height?: string;
  }>(),
  {
    cols: 1,
    rowGap: "0px",
    columnGap: "0px",
  }
);

const { cols, rowGap, columnGap, width, height } = toRefs(props);
const gridContainerStyle = computed<CSSProperties>(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  rowGap: rowGap.value,
  columnGap: columnGap.value,
  width: width.value,
  height: height.value,
}));
</script>
