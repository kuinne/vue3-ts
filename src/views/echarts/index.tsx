import { defineComponent, onMounted, ref, Ref } from "vue";
import { useChart, type UseChartOptions } from "./hooks/use-chart";
import type { EChartsOption } from "echarts";
export default defineComponent({
  setup() {
    const option = ref<EChartsOption>({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    }) as Ref<EChartsOption>;
    const { Chart } = useChart({
      option,
      style: {
        height: "500px",
      },
    });

    onMounted(() => {
      setTimeout(() => {
        option.value = {
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [120, 200, 150, 80, 70],
              type: "bar",
              showBackground: true,
              backgroundStyle: {
                color: "rgba(180, 180, 180, 0.2)",
              },
            },
          ],
        };
      }, 2000);
    });

    return () => (
      <div>
        <Chart />
      </div>
    );
  },
});
