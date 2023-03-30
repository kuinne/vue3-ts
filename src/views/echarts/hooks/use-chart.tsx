import { CSSProperties, Ref, ref, watch } from "vue";
import { VueEcharts } from "vue3-echarts";
type VueChartsProps = InstanceType<typeof VueEcharts>["$props"];
import type { EChartsOption } from "echarts";
export type UseChartOptions = {
  option: Ref<EChartsOption>;
  style?: CSSProperties;
};
export function useChart({ option, style }: UseChartOptions) {
  const chartRef = ref<InstanceType<typeof VueEcharts>>();
  const Chart = () => (
    <VueEcharts option={option.value} style={style} ref={chartRef} />
  );

  return {
    Chart,
    chartRef,
  };
}
