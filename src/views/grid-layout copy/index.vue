<template>
  <div class="row">
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
  </div>
  <div class="row">
    <div class="col col-8 col-offset-8"><div class="box">col-8</div></div>
  </div>
  <div class="row">
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
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";

const props = withDefaults(defineProps<{ gutter?: number; flex?: number }>(), {
  gutter: 40,
});

const gutter = computed(() => `${props.gutter / 2}px`);
const parseFlex = (flex: number) => `flex: ${flex} ${flex} auto`;
</script>

<style lang="scss" scoped>
@import "./style.scss";
.col {
  padding-left: v-bind(gutter);
  padding-right: v-bind(gutter);
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
