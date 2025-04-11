<template>
  <div class="grid-item" :style="gridItemStyle">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed, CSSProperties, toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    rowSpan?: number;
    columnSpan?: number;
  }>(),
  {
    rowSpan: 1,
    columnSpan: 1,
  }
);
const { rowSpan, columnSpan } = toRefs(props);
const gridItemStyle = computed<CSSProperties>(() => ({
  gridRow: `span ${rowSpan.value}`,
  gridColumn: `span ${columnSpan.value}`,
}));
</script>
