<template>
  <div class="flex-box-wrapper">
    <slot name="header" />
    <div :class="flexBoxClass" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, toRefs, ref, onMounted, CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{ class?: string | any[]; height?: string; display?: string }>(),
  {
    class: () => [],
    height: "300px",
    display: "flex",
  }
);

const { class: customClass, height, display } = toRefs(props);

const flexBoxClass = computed(() => {
  if (Array.isArray(customClass.value)) {
    return ["flex-box", ...customClass.value];
  } else {
    return `flex-box ${customClass.value}`;
  }
});
</script>

<style lang="scss" scoped>
.flex-box-wrapper {
}
.flex-box {
  resize: both;
  overflow: hidden;
  height: v-bind(height);
  aspect-ratio: 4 / 3;
  display: v-bind(display);
  border-radius: 0.625em;
  color: #fff;
  background: linear-gradient(to right, #4b56e4, #6b4cbf);
  box-shadow: 0 0.25rem 0.5rem -0.15rem hsla(0 0% 0% / 55%);
}
</style>
