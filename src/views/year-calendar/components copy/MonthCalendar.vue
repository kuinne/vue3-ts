<template>
  <div class="month-calendar">
    <div class="month">
      {{ title }}
    </div>
    <div class="month-calendar_body">
      <div class="week">
        <div class="week-item" v-for="week in weekMapping">{{ week }}</div>
      </div>
      <div class="day">
        <div
          :class="[
            'day-item',
            {
              'is-disabled': day.type !== 'cur',
              'is-selected': day.isSelected,
              'is-hovered': isHovered(day),
            },
          ]"
          v-for="day in days"
          @click.stop="() => handleClick(day)"
          @mouseenter.stop="() => handleMouseEnter(day)"
          @mouseleave.stop="() => handleMouseLeave(day)"
        >
          {{ day.date.date() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import calendar from 'dayjs/plugin/calendar'

export type Day = {
  type: 'pre' | 'cur' | 'next'
  date: Dayjs
  isSelected: boolean
}
import dayjs, { Dayjs } from 'dayjs'
import { computed, ref, toRefs, watch, withDefaults } from 'vue'
dayjs.extend(calendar)

const title = computed(() =>
  dayjs()
    .year(year.value)
    .month(month.value - 1)
    .format('YYYY年M月')
)
const weekMapping = ['一', '二', '三', '四', '五', '六', '日']
const props = withDefaults(
  defineProps<{
    year: number
    month: number
    isHovered: (day: Day) => boolean
    color?: string
  }>(),
  {
    color: 'green',
  }
)

const emits = defineEmits<{
  ($event: 'day-click', day: Day): void
  ($event: 'day-mouse-enter', day: Day): void
  ($event: 'day-mouse-leave', day: Day): void
}>()

const { year, month, isHovered, color } = toRefs(props)

const days = ref<Day[]>([])

const curDate = computed(() =>
  dayjs()
    .year(year.value)
    .month(month.value - 1)
)
const initCalendar = () => {
  days.value = []

  // 本月第一天是周几
  const totalDays = 7 * 6
  let preDays =
    (dayjs()
      .year(year.value)
      .month(month.value - 1)
      .startOf('month')
      .day() || 7) - 1

  const curDays = curDate.value.daysInMonth()

  const nextDays = totalDays - preDays - curDays

  for (let i = preDays; i > 0; i--) {
    if (month.value === 1) {
      // 取去年12月份的后preDays天
      days.value.push({
        type: 'pre',
        date: dayjs()
          .year(year.value - 1)
          .month(12 - 1)
          .endOf('month')
          .subtract(i, 'days'),
        isSelected: false,
      })
    } else {
      // 取前一月份的后preDays天
      days.value.push({
        type: 'pre',
        date: dayjs()
          .year(year.value)
          .month(month.value - 2)
          .endOf('month')
          .subtract(i, 'days'),
        isSelected: false,
      })
    }
  }

  for (let i = 0; i < curDays; i++) {
    // 取当前月份第i+1号
    days.value.push({
      type: 'cur',
      date: dayjs()
        .year(year.value)
        .month(month.value - 1)
        .date(i + 1),
      isSelected: false,
    })
  }

  for (let i = 0; i < nextDays - 1; i++) {
    if (month.value === 12) {
      // 取下一年的一月份的前nextDayjs天
      days.value.push({
        type: 'next',
        date: dayjs()
          .year(year.value + 1)
          .month(month.value)
          .date(i + 1),
        isSelected: false,
      })
    } else {
      // 取下一月份前nextDayjs天
      days.value.push({
        type: 'next',
        date: dayjs()
          .year(year.value)
          .month(month.value)
          .date(i + 1),
        isSelected: false,
      })
    }
  }
}

const handleClick = (day: Day) => {
  if (day.type !== 'cur') return
  emits('day-click', day)
}
const handleMouseEnter = (day: Day) => {
  if (day.type !== 'cur') return
  emits('day-mouse-enter', day)
}
const handleMouseLeave = (day: Day) => {
  if (day.type !== 'cur') return
  emits('day-mouse-leave', day)
}
watch(
  year,
  () => {
    initCalendar()
  },
  {
    immediate: true,
  }
)
watch(
  month,
  () => {
    initCalendar()
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.month-calendar {
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 2px;
  &_body {
    padding: 3px 20px;
  }
}
.month {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(217, 217, 217, 1);
  user-select: none;
  height: 36px;
  font-size: 14px;
  color: #212121;
  font-weight: 600;
  background: #fafafa;
}
.week {
  display: flex;

  .week-item {
    width: calc(100% / 7);
    height: 32px;
    display: flex;
    justify-content: center;
  }
}
.day {
  display: flex;
  flex-wrap: wrap;
  // padding: 0 20px;
  .day-item {
    width: calc(100% / 7);
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    &:not(.is-disabled):hover {
      color: blue;
    }
    &.is-disabled {
      visibility: hidden;
    }
    &:not(.is-disabled).is-selected {
      background-color: v-bind(color) !important;
      color: #fff;
    }
    &:not(.is-disabled).is-hovered {
      background-color: v-bind(color);
      color: #fff;
    }
  }
}
</style>
