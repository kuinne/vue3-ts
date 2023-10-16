<template>
  <div class="year-calendar">
    <template v-for="month in 12">
      <MonthCalendar
        :year="year"
        :month="month - 1"
        :color="parseColor"
        :is-start-date="isStartDate"
        :is-end-date="isEndDate"
        @day-click="handleDayClick"
        @day-mouse-enter="handleMouseEnter"
        @day-mouse-leave="handleMouseLeave"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, toRefs } from "vue";
import MonthCalendar, { Day } from "./MonthCalendar.vue";
import { Dayjs } from "dayjs";

const Default_Color = "#5582F3";
const props = defineProps<{
  year: number;
  modelValue: {
    startDate: Dayjs;
    endDate: Dayjs;
    color: string;
  }[];
}>();

const emits = defineEmits<{
  (
    $event: "change",
    current: {
      startDate: Dayjs;
      endDate: Dayjs;
      color: string;
    }
  ): void;
}>();

const { modelValue } = toRefs(props);

const { year } = toRefs(props);

const current = ref<{
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  color: string | null;
}>({
  startDate: null,
  endDate: null,
  color: null,
});

const isSame = (a: Dayjs, b: Dayjs) => {
  return (
    a.year() === b.year() && a.month() === b.month() && a.date() === b.date()
  );
};

const parseColor = (_current: Dayjs) => {
  if (current.value.startDate) {
    if (isSame(current.value.startDate, _current)) {
      return current.value.color;
    }
  }
  if (current.value.endDate) {
    if (isSame(current.value.endDate, _current)) {
      return current.value.color;
    }
  }
  if (
    current.value.startDate &&
    hovered.value &&
    inRange(_current, current.value.startDate, hovered.value)
  ) {
    return current.value.color;
  }
  if (
    current.value.startDate &&
    current.value.endDate &&
    inRange(_current, current.value.startDate, current.value.endDate)
  ) {
    return current.value.color;
  }

  const found = modelValue.value.findLast(
    (item) =>
      isSame(item.startDate, _current) ||
      isSame(item.endDate, _current) ||
      inRange(_current, item.startDate, item.endDate)
  );

  if (found) return found.color;

  return "";
};

const isStartDate = (_current: Dayjs) => {
  if (current.value.startDate) {
    return isSame(current.value.startDate, _current);
  }
  const found = modelValue.value.findLast((item) =>
    isSame(item.startDate, _current)
  );
  if (found) {
    return true;
  }
  return false;
};
const isEndDate = (_current: Dayjs) => {
  if (current.value.endDate) {
    return isSame(current.value.endDate, _current);
  }
  const found = modelValue.value.findLast((item) =>
    isSame(item.endDate, _current)
  );
  if (found) {
    return true;
  }
  return false;
};

const handleDayClick = (cur: Day) => {
  if (current.value.startDate && current.value.endDate) {
    current.value = {
      startDate: null,
      endDate: null,
      color: Default_Color,
    };
  }
  if (!current.value?.startDate) {
    current.value.startDate = cur.date;
    current.value.color = Default_Color;
    emits("change", {
      startDate: current.value.startDate,
      endDate: current.value.startDate,
      color: current.value.color!,
    });
  } else if (!current.value?.endDate) {
    current.value.endDate = cur.date;
  }

  if (current.value.startDate && current.value.endDate) {
    emits("change", {
      startDate: current.value.startDate,
      endDate: current.value.endDate,
      color: current.value.color!,
    });
  }
};

const hovered = ref<Dayjs | null>(null);

const handleMouseEnter = (cur: Day) => {
  if (current.value.startDate && current.value.endDate) return;

  hovered.value = cur.date;
};
const handleMouseLeave = (cur: Day) => {
  hovered.value = null;
};

const inRange = (
  _current: Dayjs,
  startDate: Dayjs | null,
  endDate: Dayjs | null
) => {
  if (endDate && startDate) {
    return (
      (_current >= startDate && _current <= endDate) ||
      (_current >= endDate && _current <= startDate)
    );
  }
  return false;
};
</script>

<style lang="scss" scoped>
.year-calendar {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 246px);
}
</style>
