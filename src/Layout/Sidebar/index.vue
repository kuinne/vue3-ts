<template>
  <div class="sidebar">
    <div class="collapse">
      <el-icon class="collapse-icon" @click="toggleCollapse"
        ><Expand v-if="isCollapse" /><Fold v-else
      /></el-icon>
    </div>
    <el-scrollbar>
      <el-menu
        class="menu"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        :default-active="route.path"
        @select="handleSelect"
        :collapse="isCollapse"
      >
        <MenuItem :menus="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import MenuItem from "./MenuItem.vue";
import { useRoute, useRouter } from "vue-router";
import { routes } from "../../router";
import { ref } from "vue";
const router = useRouter();

const route = useRoute();

const isCollapse = ref(false);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleSelect = (index: string) => {
  router.push(index);
};
</script>

<style lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.menu {
  min-height: calc(100vh - 40px);
  border-right: none !important;
}
.collapse {
  height: 40px;
  background-color: #545c54;

  .collapse-icon {
    align-self: flex-end;
    margin: 10px;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
