<template>
  <label class="toggle">
    <span class="toggle__label">{{ label }}</span>
    <input
      type="checkbox"
      role="switch"
      class="toggle__element"
      v-model="checked"
    />
    <div class="toggle__decor" aria-hidden="true">
      <div class="toggle__thumb"></div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    modelValue: any;
    values?: [any, any];
  }>(),
  {
    values: () => [true, false],
  }
);

const emits = defineEmits<{ ($event: "update:modelValue", val: any): void }>();
const { label, values } = toRefs(props);

const checked = ref(false);

watch(
  () => props.modelValue,
  () => {
    checked.value = props.modelValue === values.value[0];
  },
  {
    immediate: true,
  }
);

watch(
  () => checked.value,
  () => {
    emits(
      "update:modelValue",
      checked.value ? values.value[0] : values.value[1]
    );
  }
);
</script>

<style lang="scss" scoped>
.toggle {
  --metric-toggle-thumb-size: 1rem;
  --metric-toggle-thumb-space: 0.25rem;
  position: relative;
  display: inline-flex;
  align-items: center;
}
.toggle__element {
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: var(--metric-toggle-thumb-size);
  width: 1em;
  height: 1em;
}

.toggle__decor {
  display: block;
  position: relative;
  overflow: hidden;
  width: calc(
    (var(--metric-toggle-thumb-size) * 2) +
      (var(--metric-toggle-thumb-space) * 2)
  );
  height: calc(
    var(--metric-toggle-thumb-size) + (var(--metric-toggle-thumb-space) * 2)
  );
  background: var(--color-mid);
  margin-left: 0.5rem;
  border-radius: var(--metric-toggle-thumb-size);
  box-sizing: content-box;
  border: 1px solid var(--color-light);
}
:checked + .toggle__decor {
  background: var(--color-primary-light);
}

label::after {
  content: "\A";
  white-space: pre;
}

.toggle__thumb {
  display: grid;
  place-items: center;
  width: var(--metric-toggle-thumb-size);
  height: var(--metric-toggle-thumb-size);
  border-radius: var(--metric-toggle-thumb-size);
  background: linear-gradient(
      229.84deg,
      rgba(255, 255, 255, 0) 14.29%,
      rgba(48, 48, 48, 0.15) 81.82%
    ),
    #ffffff;
  box-shadow: var(--generic-shadow);
  position: absolute;
  top: var(--metric-toggle-thumb-space);
  left: var(--metric-toggle-thumb-space);
  transform: none;
  transition: transform 200ms cubic-bezier(1, 0, 0.55, 0.85);
  will-change: transform;
  z-index: 1;
}
.toggle__thumb::before {
  content: "";
  display: none;
  width: calc(
    var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
  );
  height: calc(
    var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
  );
  border: 1px solid var(--color-primary-light);
  border-radius: calc(
    var(--metric-toggle-thumb-size) - var(--metric-toggle-thumb-space)
  );
}
</style>
