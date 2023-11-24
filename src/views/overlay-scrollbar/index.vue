<template>
  <div class="container">
    <div class="content">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
      provident modi molestiae, reprehenderit harum, illum nisi iste quos
      corrupti voluptate porro quo. Aperiam eaque iste incidunt voluptatum atque
      blanditiis quidem. Lorem ipsum dolor sit amet consectetur, adipisicing
      elit. Ducimus provident modi molestiae, reprehenderit harum, illum nisi
      iste quos corrupti voluptate porro quo. Aperiam eaque iste incidunt
      voluptatum atque blanditiis quidem. Lorem ipsum dolor sit amet
      consectetur, adipisicing elit. Ducimus provident modi molestiae,
      reprehenderit harum, illum nisi iste quos corrupti voluptate porro quo.
      Aperiam eaque iste incidunt voluptatum atque blanditiis quidem.
    </div>
    <div class="content" v-if="showScrollbar">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
      provident modi molestiae, reprehenderit harum, illum nisi iste quos
      corrupti voluptate porro quo. Aperiam eaque iste incidunt voluptatum atque
      blanditiis quidem.
    </div>
  </div>
  <label>
    显示滚动条
    <input type="checkbox" v-model="showScrollbar" />
  </label>
  <br />
  <select v-model="scrollbarGutter">
    <option value="auto">auto：默认行为</option>
    <option value="stable">stable：给滚动条预留一定空间</option>
    <option value="stable both-edges">
      stable both-edges：滚动容器两边都有滚动沟槽等同的空间
    </option>
  </select>
</template>
<script setup>
import { ref } from "vue";
const showScrollbar = ref(false);

const scrollbarGutter = ref("auto");
</script>
<style lang="scss" scoped>
.container {
  background-color: #eee;
  padding: 2px;
  width: 300px;
  height: 400px;
  overflow: auto;
  scrollbar-gutter: v-bind(
    scrollbarGutter
  ); // stable 覆盖式滚动条 auto 经典式滚动条
  .content {
    width: 100%;
  }
}
</style>
