<template>
  <div>
    <el-button @click="getRangeSelection">getRangeSelection</el-button>
    <el-select v-model="year">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="calendar"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Calender from "js-year-calendar";
import "js-year-calendar/locales/js-year-calendar.zh-CN";
import "js-year-calendar/dist/js-year-calendar.css";
const year = ref(2022);
const options = [
  {
    label: "2021",
    value: 2021,
  },
  {
    label: "2022",
    value: 2022,
  },
  {
    label: "2023",
    value: 2023,
  },
];
let calendar: any = null;
onMounted(() => {
  const elm = document.querySelector(".calendar") as HTMLDivElement;
  if (elm) {
    const currentYear = new Date().getFullYear();
    calendar = new Calender(elm, {
      style: "background",
      language: "zh-CN",
      loadingTemplate: "zzz",
      enableRangeSelection: true,

      dataSource: [
        {
          startDate: new Date(currentYear, 1, 4),
          endDate: new Date(currentYear, 1, 15),
        },
        {
          startDate: new Date(currentYear, 3, 5),
          endDate: new Date(currentYear, 5, 15),
        },
      ],
      clickDay(e) {
        console.log("clickDay", e);
      },
      selectRange(e) {
        console.log("selectRange", e);
      },
      customDayRenderer(element, currentDate) {
        console.log("element", element, currentDate);
      },
    });
  }
});

watch(year, () => {
  if (!calendar) return;
  calendar.setYear(year.value);
  //   calendar.setStyle("border");
});

const getRangeSelection = () => {
  if (!calendar) return;
  console.log(calendar.getEnableRangeSelection());
};
</script>
<style scoped lang="scss">
// :deep(.calendar) {
//   .calendar-header {
//     background-color: #cc251f;
//     color: white;
//     border: 0;
//   }
//   .calendar-header .year-title:hover,
//   .calendar-header .prev:hover,
//   .calendar-header .next:hover {
//     background: rgba(255, 255, 255, 0.2);
//   }

//   .calendar-header .year-neighbor {
//     color: inherit;
//     opacity: 0.7;
//   }

//   .calendar-header .year-neighbor2 {
//     color: inherit;
//     opacity: 0.4;
//   }

//   .month-container {
//     height: 210px;
//   }

//   table.month {
//     height: 100%;
//   }

//   table.month .month-title {
//     background-color: #cc251f;
//     color: white;
//     padding: 5px;
//   }

//   table.month .day-header {
//     padding-top: 8px;
//     border-bottom: 2px solid #cc251f;
//   }

//   table.month td.day .day-content {
//     padding: 5px 8px;
//   }
// }
</style>
