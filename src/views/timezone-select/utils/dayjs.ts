import dayjs, { Dayjs } from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const timezoneStore = {
  setTimezone: (value: string) => {
    dayjs.tz.setDefault(value);
    localStorage.setItem("timezone", value);
  },
  getTimezone: () => {
    return localStorage.getItem("timezone") || "Asia/Shanghai";
  },
};

dayjs.tz.setDefault(timezoneStore.getTimezone());

const dayjsWrapper = (...args: dayjs.ConfigType[]): Dayjs => {
  return dayjs(...args).tz();
};

const now = Date.now();
console.log(
  "测试时区",
  now === dayjsWrapper(now).valueOf() &&
    dayjsWrapper(now).valueOf() ===
      dayjs(now).tz(timezoneStore.getTimezone()).valueOf()
);
// 将 dayjs 上的所有属性方法都加到 dayjsWrapper 上
Object.assign(dayjsWrapper, dayjs);
export default dayjsWrapper;
