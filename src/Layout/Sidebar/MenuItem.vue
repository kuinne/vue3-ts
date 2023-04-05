<template>
  <template v-for="item in menus">
    <el-sub-menu
      :index="item.path"
      v-if="(item as any).children.length > 0"
      popper-class="popper"
    >
      <template #title
        ><el-icon v-if="item.meta?.icon"
          ><component :is="item.meta?.icon" /></el-icon
        ><span>{{ item.meta?.name || item.name }}</span></template
      >
      <MenuItem :menus="item.children" />
    </el-sub-menu>
    <el-menu-item :index="item.path" v-else>
      <el-icon v-if="item.meta?.icon"
        ><component :is="item.meta?.icon" /></el-icon
      ><span>{{ item.meta?.name || item.name }}</span></el-menu-item
    >
  </template>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{ menus: any[] }>();
const { menus } = toRefs(props);
</script>

<style lang="scss">
.el-menu--popup-container.popper {
  max-height: 99vh;
  overflow: auto;
}
</style>
