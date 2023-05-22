<template>
  <!-- <div class="row">
    <div class="col col-8">
      <div class="box">col-8</div>
    </div>
    <div class="col col-8"><div class="box">col-8</div></div>
    <div class="col col-8"><div class="box">col-8</div></div>
  </div>
  <div class="row row-wrap">
    <div class="col col-8">
      <div class="box">col-8</div>
    </div>
    <div class="col col-24">
      <div class="box">col-24</div>
    </div>
    <div class="col col-8"><div class="box">col-8</div></div>
  </div> -->
  <div class="row">
    <div class="col col-8 col-offset-8"><div class="box">col-8</div></div>
    <div class="col col-8"><div class="box">col-8</div></div>
  </div>
  <div class="row">
    <div class="col" :style="{ ...parseCol(8) }">
      <div class="box">col-8</div>
    </div>
    <div class="col" :style="{ ...parseCol(8) }">
      <div class="box">col-8</div>
    </div>
    <div class="col" :style="{ ...parseCol(8) }">
      <div class="box">col-8</div>
    </div>
  </div>
  <div class="row row-wrap" :style="parseGap(gap)">
    <div class="col" :style="{ ...parseCol(12) }">
      <div class="box">col-12</div>
    </div>
    <div class="col" :style="{ ...parseCol(8) }">
      <div class="box">col-8</div>
    </div>
    <div class="col" :style="{ ...parseCol(12) }">
      <div class="box">col-12</div>
    </div>
    <div class="col" :style="{ ...parseCol(4) }">
      <div class="box">col-4</div>
    </div>
    <div class="col" :style="{ ...parseCol(4) }">
      <div class="box">col-4</div>
    </div>
    <div class="col" :style="{ ...parseCol(4) }">
      <div class="box">col-4</div>
    </div>
    <div class="col" :style="{ ...parseCol(4) }">
      <div class="box">col-4</div>
    </div>
    <div class="col" :style="{ ...parseCol(24) }">
      <div class="box">col-24</div>
    </div>
  </div>
  <!-- <div class="row">
    <div class="col col-6"><div class="box">col-6</div></div>
    <div class="col col-6 col-offset-6">
      <div class="box">col-6 col-offset-6</div>
    </div>
    <div class="col col-6"><div class="box">col-6</div></div>
  </div>
  <div class="row">
    <div class="col" :style="parseFlex(2)">
      <div class="box">2/5</div>
    </div>
    <div class="col" :style="parseFlex(3)">
      <div class="box">3/5</div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { CSSProperties, computed, toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    gutter?: number;
    flex?: number;
    cols?: number;
    gap?: number;
  }>(),
  {
    gutter: 40,
    cols: 24,
    gap: 50,
  }
);

const { cols, gap } = toRefs(props);
const gutter = computed(() => `${props.gutter / 2}px`);
const parseFlex = (flex: number) => `flex: ${flex} ${flex} auto`;
const parseCol = (span: number): CSSProperties => {
  const percent = (span / cols.value) * 100;
  const offset = gap.value * ((cols.value / span - 1) / (cols.value / span));

  return {
    display: "block",
    maxWidth: `0 0 calc(${percent}% - ${offset}px)`,
    flex: `0 0 calc(${percent}% - ${offset}px)`,
  };
};

const parseGap = (gap: number) => `gap: 0 ${gap}px`;
</script>

<style lang="scss" scoped>
@import "./style.scss";
.col {
  // padding-left: v-bind(gutter);
  // padding-right: v-bind(gutter);
  box-sizing: border-box;
}
.row {
  margin-bottom: 20px;
}
.row-wrap {
  flex-wrap: wrap;
}

.box {
  background-color: rgba(0, 136, 255, 0.819);
  padding: 10px 12px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  text-align: center;
}
</style>
