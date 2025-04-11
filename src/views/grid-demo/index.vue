<template>
  <Grid :cols="2" row-gap="20px" column-gap="10px" width="600px" height="200px">
    <GridItem>
      <div class="box">1</div>
    </GridItem>
    <GridItem :row-span="2">
      <div class="box">2</div>
    </GridItem>
    <GridItem>
      <div class="box">3</div>
    </GridItem>
    <GridItem :column-span="2">
      <div class="box">4</div>
    </GridItem>
  </Grid>
</template>
<script lang="ts" setup>
import Grid from "./Grid.vue";
import GridItem from "./GridItem.vue";
</script>
<style lang="scss" scoped>
.box {
  border: 1px solid;
  height: 100%;
}
</style>
