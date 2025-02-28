import { computed, defineComponent, ref } from "vue";

import { ElSelect, ElOption, ElDatePicker } from "element-plus";
import dayjs, { timezoneStore } from "./utils/dayjs.js";

export default defineComponent({
  setup() {
    /** 时区列表数据 */
    const timezones = [
      {
        label: "中国标准时间",
        value: "Asia/Shanghai",
      },
      {
        label: "伦敦标准时间",
        value: "Europe/London",
      },
      {
        label: "美国东部时间",
        value: "America/New_York",
      },
    ];

    const currentTimezone = ref(timezoneStore.getTimezone());

    const handleTimezoneChange = (value: string) => {
      console.log("选择时区：", value);

      timezoneStore.setTimezone(value);
      location.reload();
    };

    return () => (
      <div>
        <div>
          选择时区：
          <ElSelect
            v-model={currentTimezone.value}
            style="width: 220px"
            onChange={handleTimezoneChange}
          >
            {timezones.map((item) => (
              <ElOption
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </ElSelect>
        </div>
        <br />
        {/* <div>时间: {formatDate(currentTimestamp.value)}</div> */}

        <div>
          选择时间：
          <ElDatePicker valueFormat="x" showTime type="datetime" />
        </div>
      </div>
    );
  },
});
