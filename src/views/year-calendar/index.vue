<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="icon minus-icon" @click="changeYear('minus')">-</div>
      <div class="year">{{ year }}</div>
      <div class="icon plus-icon" @click="changeYear('plus')">+</div>
    </div>
    <YearCalendar :year="year" v-model="timeRange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import YearCalendar from './components/YearCalendar.vue'
import { Dayjs } from 'dayjs'
const year = ref(2019)
const changeYear = (type: 'minus' | 'plus') => {
  switch (type) {
    case 'minus':
      year.value -= 1
      break
    case 'plus':
      year.value += 1
    default:
      break
  }
}

const timeRange = ref<
  {
    startDate: Dayjs
    endDate: Dayjs
    color: string
  }[]
>([])
</script>

<style lang="scss" scoped>
.year {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.calendar {
  overflow: auto;
  max-height: 100vh;
}
.calendar__header {
  display: flex;
  justify-content: center;
  gap: 20px;
  .icon {
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }
}
</style>
