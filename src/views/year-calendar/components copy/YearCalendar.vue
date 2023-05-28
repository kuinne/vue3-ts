<template>
  <div class="year-calendar">
    <template v-for="month in 12">
      <MonthCalendar
        :year="year"
        :month="month"
        @day-click="handleDayClick"
        @day-mouse-enter="handleMouseEnter"
        @day-mouse-leave="handleMouseLeave"
        :is-hovered="isHovered"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, toRefs } from 'vue'
import MonthCalendar, { Day } from './MonthCalendar.vue'
import { Dayjs } from 'dayjs'
const props = defineProps<{
  year: number
  modelValue: Dayjs[][]
}>()

const { modelValue } = toRefs(props)

const { year } = toRefs(props)
const startTime = ref<Day>()
const endTime = ref<Day>()
const willEndTime = ref<Day>()
const handleDayClick = (cur: Day) => {
  if (startTime.value && endTime.value) {
    startTime.value.isSelected = false
    startTime.value = undefined
    endTime.value.isSelected = false
    endTime.value = undefined
    willEndTime.value = undefined
  }
  if (!startTime.value) {
    startTime.value = cur
    cur.isSelected = true
  } else if (!endTime.value) {
    endTime.value = cur
    cur.isSelected = true
  }
}

const handleMouseEnter = (cur: Day) => {
  if (startTime.value && endTime.value) {
    return
  } else if (startTime.value) {
    if (cur.date !== startTime.value.date) {
      cur.isSelected = true
      willEndTime.value = cur
    }
  }
}
const handleMouseLeave = (cur: Day) => {
  if (startTime.value && endTime.value) {
    return
  } else if (startTime.value) {
    if (cur.date !== startTime.value.date) {
      cur.isSelected = false
      if (willEndTime.value === cur) {
        willEndTime.value = undefined
      }
    }
  }
}
const isHovered = (day: Day) => {
  const _e = endTime.value || willEndTime.value
  const _startTime = _e
    ? _e.date < startTime.value!.date
      ? _e
      : startTime.value
    : startTime.value
  const _endTime = _e
    ? _e.date > startTime.value!.date
      ? _e
      : startTime.value
    : _e

  if (_endTime && _startTime) {
    return day.date < _endTime.date && day.date > _startTime!.date
  }
  return false
}
</script>

<style lang="scss" scoped>
.year-calendar {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 246px);
}
</style>
