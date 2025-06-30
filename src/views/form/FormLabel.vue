<template>
  <div
    class="form-item__label"
    :class="[
      `form-item__label--${labelAlign}`,
      { 'form-item__label--ellipsis': labelEllipsis }]"
    :style="{
      width: labelWidth === 'auto' ? undefined : labelWidth,
      flex: labelPosition === 'top' ? undefined: `0 0 ${labelWidth}`
    }"
  >
    <el-tooltip
      v-if="labelEllipsis"
      :content="label"
      placement="top"
      :disabled="!isLabelOverflow"
      effect="dark"
    >
      <span
        ref="labelRef"
        class="label-text"
        :class="{ 'label-text--ellipsis': labelEllipsis }"
      >
        {{ label }}
      </span>
    </el-tooltip>
    <span v-else class="label-text">{{ label }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import type { LabelAlign, LabelPosition } from './types'

interface Props {
  label: string
  labelWidth: string | number
  labelAlign: LabelAlign
  labelPosition: LabelPosition
  labelEllipsis: boolean
  required?: boolean
}

const props = defineProps<Props>()

const labelRef = ref<HTMLElement>()
const isLabelOverflow = ref(false)

// 检查标签是否溢出
const checkLabelOverflow = async () => {
  await nextTick()
  if (labelRef.value) {
    const label = labelRef.value
    isLabelOverflow.value = label.scrollWidth > label.clientWidth
  }
}

onMounted(() => {
  checkLabelOverflow()
})

// 监听标签宽度变化
watch(() => props.labelWidth, () => {
  checkLabelOverflow()
})

// 监听标签内容变化
watch(() => props.label, () => {
  checkLabelOverflow()
})
</script>

<style lang="scss" scoped>
.form-item__label {
  padding-right: 12px;
  flex-shrink: 0;
  min-width: 0;
  margin-right: 8px;

  &--ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &--left {
    text-align: left;
  }
  &--right {
    text-align: right;
  }
}

.label-text {
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 32px;

  &--ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style> 