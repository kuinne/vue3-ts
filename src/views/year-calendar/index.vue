<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="icon minus-icon" @click="changeYear('minus')">-</div>
      <div class="year">{{ year }}</div>
      <div class="icon plus-icon" @click="changeYear('plus')">+</div>
    </div>
    <div class="calendar__body">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MonthCalendar, { Day } from "./components/MonthCalendar.vue";
const year = ref(2019);
const changeYear = (type: "minus" | "plus") => {
  switch (type) {
    case "minus":
      year.value -= 1;
      break;
    case "plus":
      year.value += 1;
    default:
      break;
  }
};
const startTime = ref<Day>();
const endTime = ref<Day>();
const willEndTime = ref<Day>();
const handleDayClick = (cur: Day) => {
  if (startTime.value && endTime.value) {
    startTime.value.isSelected = false;
    startTime.value = undefined;
    endTime.value.isSelected = false;
    endTime.value = undefined;
    willEndTime.value = undefined;
  }
  if (!startTime.value) {
    startTime.value = cur;
    cur.isSelected = true;
  } else if (!endTime.value) {
    endTime.value = cur;
    cur.isSelected = true;
  }
};

const handleMouseEnter = (cur: Day) => {
  if (startTime.value && endTime.value) {
    return;
  } else if (startTime.value) {
    if (cur.date !== startTime.value.date) {
      cur.isSelected = true;
      willEndTime.value = cur;
    }
  }
};
const handleMouseLeave = (cur: Day) => {
  if (startTime.value && endTime.value) {
    return;
  } else if (startTime.value) {
    if (cur.date !== startTime.value.date) {
      cur.isSelected = false;
      if (willEndTime.value === cur) {
        willEndTime.value = undefined;
      }
    }
  }
};
const isHovered = (day: Day) => {
  const _e = endTime.value || willEndTime.value;
  const _startTime = _e
    ? _e.date < startTime.value!.date
      ? _e
      : startTime.value
    : startTime.value;
  const _endTime = _e
    ? _e.date > startTime.value!.date
      ? _e
      : startTime.value
    : _e;

  if (_endTime && _startTime) {
    return day.date < _endTime.date && day.date > _startTime!.date;
  }
  return false;
};
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
.calendar__body {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 246px);
}
</style>
