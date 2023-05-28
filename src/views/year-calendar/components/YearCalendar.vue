<template>
  <div class="year-calendar">
    <template v-for="month in 12">
      <MonthCalendar
        :year="year"
        :month="month"
        :color="parseColor"
        @day-click="handleDayClick"
        @day-mouse-enter="handleMouseEnter"
        @day-mouse-leave="handleMouseLeave"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, toRefs } from 'vue'
import MonthCalendar, { Day } from './MonthCalendar.vue'
import { Dayjs } from 'dayjs'
import { startCase } from 'lodash'
const props = defineProps<{
  year: number
  modelValue: {
    startDate: Dayjs
    endDate: Dayjs
    color: string
  }[]
}>()

const { modelValue } = toRefs(props)

const { year } = toRefs(props)

const willEndDate = ref<Day>()

const current = ref<{
  startDate: Dayjs | null
  endDate: Dayjs | null
  color: string | null
}>({
  startDate: null,
  endDate: null,
  color: null,
})

const parseColor = (_current: Dayjs) => {
  const isSame = (a: Dayjs, b: Dayjs) => {
    return a.month() === b.month() && a.date() === b.date()
  }

  if (current.value.startDate) {
    if (isSame(current.value.startDate, _current)) {
      return current.value.color
    }
  }
  if (current.value.endDate) {
    if (isSame(current.value.endDate, _current)) {
      return current.value.color
    }
  }
  if (inRange(_current, current.value.startDate, hovered.value)) {
    return current.value.color
  }

  //   const found = modelValue.value.findLast(
  //     (item) => isSame(item.startDate, _current) || isSame(item.endDate, _current)
  //   )

  //   if (found) return found.color

  return ''
}

const handleDayClick = (cur: Day) => {
  if (current.value.startDate && current.value.endDate) {
    current.value = {
      startDate: null,
      endDate: null,
      color: 'blue',
    }
  }
  if (!current.value?.startDate) {
    current.value.startDate = cur.date
    current.value.color = 'blue'
  } else if (!current.value?.endDate) {
    current.value.endDate = cur.date
  }

  if (current.value.startDate && current.value.endDate) {
    // modelValue.value.push({
    //   startDate: current.value.startDate,
    //   endDate: current.value.endDate,
    //   color: current.value.color!,
    // })
  }
}

const hovered = ref<Dayjs | null>(null)

const handleMouseEnter = (cur: Day) => {
  if (current.value.startDate && current.value.endDate) return

  hovered.value = cur.date
  //   if (startDate.value && endDate.value) {
  //     return
  //   } else if (startDate.value) {
  //     if (cur.date !== startDate.value.date) {
  //       willEndDate.value = cur
  //     }
  //   }
}
const handleMouseLeave = (cur: Day) => {
  if (current.value.startDate && current.value.endDate) return
  hovered.value = null
  //   if (startDate.value && endDate.value) {
  //     return
  //   } else if (startDate.value) {
  //     if (cur.date !== startDate.value.date) {
  //       if (willEndDate.value === cur) {
  //         willEndDate.value = undefined
  //       }
  //     }
  //   }
}

const inRange = (
  _current: Dayjs,
  startDate: Dayjs | null,
  endDate: Dayjs | null
) => {
  if (endDate && startDate) {
    if (startDate > endDate) {
      //   ;[startDate, endDate] = [endDate, startDate]
    }
    return _current >= startDate && _current <= endDate
  }
  return false
}
const isHovered = (day: Day) => {
  //   const _e = endDate.value || willEndDate.value
  //   const _startDate = _e
  //     ? _e.date < startDate.value!.date
  //       ? _e
  //       : startDate.value
  //     : startDate.value
  //   const _endDate = _e
  //     ? _e.date > startDate.value!.date
  //       ? _e
  //       : startDate.value
  //     : _e
  //   if (_endDate && _startDate) {
  //     return day.date < _endDate.date && day.date > _startDate!.date
  //   }
  //   return false
}
</script>

<style lang="scss" scoped>
.year-calendar {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 246px);
}
</style>
