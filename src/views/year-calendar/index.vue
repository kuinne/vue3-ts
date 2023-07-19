<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="icon minus-icon" @click="changeYear('minus')">-</div>
      <div class="year">{{ year }}</div>
      <div class="icon plus-icon" @click="changeYear('plus')">+</div>
    </div>
    <YearCalendar :year="year" v-model="timeRange" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import YearCalendar from "./components/YearCalendar.vue";
import dayjs, { Dayjs } from "dayjs";
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

const timeRange = ref<
  {
    startDate: Dayjs;
    endDate: Dayjs;
    color: string;
  }[]
>([
  {
    startDate: dayjs().year(year.value).month(1).date(2),
    endDate: dayjs().year(year.value).month(4).date(2),
    color: "purple",
  },
  {
    startDate: dayjs().year(year.value).month(2).date(2),
    endDate: dayjs().year(year.value).month(5).date(2),
    color: "orange",
  },
]);

const handleChange = (current: {
  startDate: Dayjs;
  endDate: Dayjs;
  color: string;
}) => {
  console.log("change", current);
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
</style>
