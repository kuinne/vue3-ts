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
import { ref, onMounted, watch, computed } from 'vue'
import Calender from 'js-year-calendar'
import 'js-year-calendar/locales/js-year-calendar.zh-CN'
import 'js-year-calendar/dist/js-year-calendar.css'
const year = ref(2022)
const options = [
  {
    label: '2021',
    value: 2021,
  },
  {
    label: '2022',
    value: 2022,
  },
  {
    label: '2023',
    value: 2023,
  },
]
let calendar: InstanceType<typeof Calender> | null = null
let state = ref<
  {
    date: Date
    ele: HTMLElement
  }[]
>([])

const isSelectedEle = (ele: HTMLElement) => {
  return state.value.map((item) => item.ele).includes(ele)
}

let isSelecting = computed(() => state.value.length === 1)
onMounted(() => {
  const elm = document.querySelector('.calendar') as HTMLDivElement
  if (elm) {
    const currentYear = new Date().getFullYear()
    calendar = new Calender(elm, {
      style: 'custom',
      language: 'zh-CN',
      loadingTemplate: 'zzz',
      enableRangeSelection: false,
      displayHeader: false,
      mouseOnDay({ element, date }) {
        if (isSelecting.value && !isSelectedEle(element)) {
          element.classList.add('selected-date')
          // calendar?.setDataSource([
          //   {
          //     startDate: state.value[0].date,
          //     endDate: date,
          //   },
          // ])
          // calendar?.setCustomDayRenderer((ele, curDate) => {
          //   console.log('curDate', curDate)

          //   // if (curDate > state.value[0]?.date || curDate < date) {
          //   //   console.log('ele', ele)

          //   //   ele.classList.add('in-range')
          //   // }
          // }, true)
        }
      },
      mouseOutDay({ element }) {
        if (isSelecting.value && !isSelectedEle(element)) {
          element.classList.remove('selected-date')
        }
      },
      clickDay(evt) {
        const { element, date } = evt
        if (state.value.length === 2) {
          for (const item of state.value) {
            item.ele.classList.remove('selected-date')
          }
          state.value = []
        }
        calendar?.setDataSource([
          {
            startDate: date,
            endDate: date,
          },
        ])

        element.classList.add('selected-date')
        state.value.push({
          ele: element,
          date,
        })
        // calendar?.render()
      },
      selectRange(e) {
        // console.log('selectRange', e)
      },
      customDayRenderer(ele, currentDate) {
        if (isSelectedEle(ele)) {
          ele.classList.add('selected-date')
        }
      },
      customDataSourceRenderer(ele, cur, evt) {
        // console.log('ele', ele)
        // ele.classList.add('in-range')
        // if (curDate > state.value[0]?.date || curDate < date) {
        //   console.log('ele', ele)
        //   ele.classList.add('in-range')
        // }
      },
    })
  }
})

watch(year, () => {
  if (!calendar) return
  calendar.setYear(year.value)
  //   calendar.setStyle("border");
})

const getRangeSelection = () => {
  if (!calendar) return
  console.log(calendar.getEnableRangeSelection())
}
</script>
<style scoped lang="scss">
:deep(.calendar) {
  .day-content:hover {
    color: #0c89e2;
    background-color: unset !important;
  }
  .selected-date {
    background-color: #0c89e2;
    border-radius: 50%;
    .day-content {
      color: #fff;
    }
  }
  .in-range {
    background-color: rgba(#0c89e2, 0.6);
  }
  .months-container {
    gap: 10px;
  }
  .month-container {
    border: 1px solid #ccc;

    box-sizing: border-box;
    width: 220px !important;
    table {
      width: 100%;
    }
  }
  .month-title {
    border-bottom: 1px solid #ccc;
    padding-bottom: 0px !important;
  }
}
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
