<template>
  <div class="calendar">
    <div class="month">{{ monthMapping[month - 1] }}</div>
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
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type Day = {
  type: 'pre' | 'cur' | 'next'
  date: Date
  isSelected: boolean
}
import dayjs from 'dayjs'
import { ref, toRefs, watch } from 'vue'

const monthMapping = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]
const weekMapping = ['日', '一', '二', '三', '四', '五', '六']
const props = defineProps<{
  year: number
  month: number
  isHovered: (day: Day) => boolean
}>()

const emits = defineEmits<{
  ($event: 'day-click', day: Day): void
  ($event: 'day-mouse-enter', day: Day): void
  ($event: 'day-mouse-leave', day: Day): void
}>()

const { year, month, isHovered } = toRefs(props)

const days = ref<Day[]>([])
const initCalendar = () => {
  days.value = []
  const firstDayOfMonth = getFirstDayOfMonth()
  console.log('firstDayOfMonth', firstDayOfMonth)
  const daysInMonth = getDaysInMonth()
  // 本月第一天是周几
  const totalDays = 7 * 6
  const preDays = new Date(year.value, month.value - 1, 1).getDay() || 7

  const curDays = daysInMonth[month.value - 1]

  const nextDays = totalDays - preDays - curDays

  for (let i = preDays - 1; i >= 0; i--) {
    if (month.value === 1) {
      days.value.push({
        type: 'pre',
        date: new Date(
          year.value - 1,
          11,
          new Date(year.value - 1, 11, daysInMonth[11]).getDate() - i
        ),
        isSelected: false,
      })
    } else {
      days.value.push({
        type: 'pre',
        date: new Date(
          year.value,
          month.value - 2,
          new Date(
            year.value,
            month.value - 2,
            daysInMonth[month.value - 2]
          ).getDate() - i
        ),
        isSelected: false,
      })
    }
  }

  for (let i = 0; i < curDays; i++) {
    days.value.push({
      type: 'cur',
      date: new Date(year.value, month.value - 1, i + 1),
      isSelected: false,
    })
  }

  for (let i = 0; i < nextDays; i++) {
    days.value.push({
      type: 'next',
      date: new Date(year.value, month.value, i + 1),
      isSelected: false,
    })
  }
}

/** 当月第一天的位置 */
const getFirstDayOfMonth = () => {
  return new Date(year.value, month.value - 1, 1).getDay()
}

const getDaysInMonth = () => {
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (
    (year.value % 4 === 0 && year.value % 100 !== 0) ||
    year.value % 400 === 0
  ) {
    // 闰年处理
    daysInMonth[1] = 29
  }
  return daysInMonth
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
.calendar {
  width: 200px;
  /* width: 100%; */
  border: 1px solid #ccc;
}
.month {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  user-select: none;
}
.week {
  display: flex;

  .week-item {
    flex: 0 0 calc(100% / 7);
    display: flex;
    justify-content: center;
  }
}
.day {
  display: flex;
  flex-wrap: wrap;
  .day-item {
    flex: 0 0 calc(100% / 7);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    &:not(.is-disabled):hover {
      color: blue;
    }
    &.is-disabled {
      color: #ccc;
    }
    &:not(.is-disabled).is-selected {
      background-color: blue !important;
      color: #fff;
    }
    &:not(.is-disabled).is-hovered {
      background-color: rgba(blue, 0.07);
    }
  }
}
.week-item,
.day-item {
  width: 50px;
  height: 30px;
  user-select: none;
}
</style>
