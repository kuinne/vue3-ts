<template>
  <div class="page">
    <el-container>
      <el-aside width="200px">
        <el-menu
          style="height: 100%"
          active-text-color="#ffd04b"
          background-color="#545c64"
          text-color="#fff"
          :default-active="route.path"
          @select="handleSelect"
        >
          <el-menu-item v-for="(item, index) in menus" :index="item.path">{{
            item.name
          }}</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { routes } from "./router";

const menus = routes.map((item) => {
  const name = item.path.split("/").pop();
  return {
    name,
    path: item.path,
  };
});

const router = useRouter();
router.push(menus[0]?.path);

const route = useRoute();

const handleSelect = (index: string) => {
  console.log("index", index);

  router.push(index);
};
</script>

<style>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
