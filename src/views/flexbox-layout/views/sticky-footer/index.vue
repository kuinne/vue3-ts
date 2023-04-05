<template>
  <Container flexDirection="column">
    <p>
      页脚（Footer）的位置会随着页头（Header）和主内容（Content）高度而变化，但当页头和主内容内容较小，其高度总和小于浏览器视窗高度时，页脚要始终位于浏览器视窗底部。
    </p>
    <FlexBox height="50vh">
      <div class="wrapper">
        <header>头部</header>
        <main>
          <div class="overflow-wrapper">
            <video
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
              controls
            ></video>
          </div>
        </main>
        <footer>底部</footer>
      </div>
    </FlexBox>
    <FlexBox height="50vh">
      <div class="wrapper">
        <header contenteditable>头部</header>
        <main>
          <div class="overflow-wrapper">
            <Chart />
          </div>
        </main>
        <footer>底部</footer>
      </div>
    </FlexBox>
    <FlexBox height="50vh">
      <div class="wrapper">
        <header>头部</header>
        <main>
          <div class="overflow-wrapper">
            <el-scrollbar>
              <ul v-for="item in 100">
                <li>{{ item }}</li>
              </ul>
            </el-scrollbar>
          </div>
        </main>
        <footer>底部</footer>
      </div>
    </FlexBox>
  </Container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChart } from "../../../echarts/hooks/use-chart";

const option = ref<any>({
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
});
const { Chart } = useChart({
  option,
  style: {
    height: "100%",
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  gap: 1px;
  color: #000;
  display: flex;
  flex-direction: column;
  header,
  main,
  footer {
    background-color: #fff;
    padding: 10px;
  }
  main {
    flex: 1;
    position: relative;
    .overflow-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
    }

    video {
      width: inherit;
      height: inherit;
      object-fit: fill;
    }
  }
}
</style>
