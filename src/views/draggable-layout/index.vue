<template>
  <div class="container">
    <div class="header"></div>
    <div class="main">
      <el-scrollbar :max-height="'calc(100vh - 45px)'" class="menu">
        <ul class="menu-list">
          <li
            class="menu-item"
            v-for="item in modelBaseList"
            :key="item.id"
            draggable="true"
            @dragstart="(e) => handleDragStart(e, item)"
            @drag="handleDrag"
            @dragend="handleDragEnd"
          >
            <div class="menu-image">
              <el-image
                draggable="false"
                fit="scale-down"
                :src="item.icon"
              ></el-image>
            </div>
            <div class="menu-info">
              <div class="menu-name">
                {{ item.name }}
              </div>
            </div>
          </li>
        </ul>
      </el-scrollbar>
      <div class="drag-content" ref="dargContentRef">
        <div class="content" @drop="handleDrop" @dragover.prevent>
          <draggable-container
            :adsorb-parent="true"
            :disabled="true"
            v-if="dragModelList.length"
          >
            <draggable-resizable-item
              v-for="drag in dragModelList"
              :key="drag.key"
              :config="drag"
              @on-drag-actived="handleDragActived"
              @on-drag-deactivated="handleDragDeactivated"
            >
            </draggable-resizable-item>
          </draggable-container>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElScrollbar, ElImage } from "element-plus";
import { cloneDeep } from "lodash";
import { onMounted, ref } from "vue";
import { nanoid } from "nanoid";
import { DraggableContainer } from "vue3-draggable-resizable";
import DraggableResizableItem from "./DraggableResizableItem.vue";

type MenuItem = {
  id: string;
  name: string;
  icon: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  key?: string;
};
const modelBaseList = ref<MenuItem[]>([
  {
    id: "0",
    name: "组件1",
    icon: "https://placehold.co/600x400/000000/FFFFFF/png",
  },
]);

const dargContentRef = ref<HTMLDivElement | null>(null);

// 当前选中的内容
const dragActive = ref<MenuItem | null>(null);

// 可拖拽模型列表
const dragModelList = ref<MenuItem[]>([]);

// 拖拽开始
const handleDragStart = (e: DragEvent, menuItem: MenuItem) => {
  dragActive.value = cloneDeep(menuItem);
};

// 拖拽中
const handleDrag = (e: DragEvent) => {
  e.preventDefault();
};

// 拖拽完成
const handleDrop = (e: DragEvent) => {
  e.preventDefault();

  if (dargContentRef.value) {
    const container = dargContentRef.value.getBoundingClientRect();
    const x = e.clientX - container.left - 520 / 2;
    const y = e.clientY - container.top - 360 / 2;
    dragActive.value.x = x;
    dragActive.value.y = y;
  }
};

// 拖拽结束
const handleDragEnd = (e: DragEvent) => {
  e.preventDefault();

  const { x, y } = dragActive.value;
  if (!x || !y) {
    dragActive.value = null;
    return false;
  }
  dragActive.value.width = 520;
  dragActive.value.height = 360;
  dragActive.value.key = nanoid();
  dragModelList.value.push(dragActive.value);
  dragActive.value = null;
};

// 选中拖拽元素
const handleDragActived = (drag: any) => {
  console.log("handleDragActived", drag);

  dragActive.value = drag;
};

// 取消选中拖拽元素
const handleDragDeactivated = (key: string) => {
  if (key === dragActive.value.key) {
    dragActive.value = null;
  }
};

onMounted(() => {
  // 监听键盘按下 delete 建
  window.addEventListener("keydown", (event) => {
    if (event.keyCode === 8 && event.key === "Backspace" && dragActive.value) {
      const { key } = dragActive.value;
      dragModelList.value = dragModelList.value.filter((v) => v.key !== key);

      dragActive.value = null;
    }
  });
});
</script>
<style lang="scss" scoped>
.container {
  .header {
    height: 45px;
    width: 100%;
    background-color: #010c1d;
  }
  .main {
    display: flex;
    .menu {
      height: calc(100vh - 45px);
      width: 230px;
      padding: 10px;
      background-color: #18181c;
      .menu-list {
        list-style: none;
        .menu-item {
          border-radius: 3px;
          font-size: 14px;
          margin-bottom: 10px;
          color: #fff;
          box-sizing: border-box;
          cursor: all-scroll;
          border: 1px solid #323332;
          &:hover {
            border: 2px solid #18c174;
          }

          .menu-image {
            font-size: 0;
            padding: 10px 18px;
          }
          .menu-info {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            padding: 0px 8px;
            box-sizing: border-box;
            background-color: #232324;
          }
        }
      }
    }
    .drag-content {
      height: calc(100vh - 45px);
      display: flex;
      width: 100%;
      border: 5px solid #000000;
      .content {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background-color: #18181c;
        background-size: 15px 15px, 15px 15px;
        background-image: linear-gradient(#18181c 14px, transparent 0),
          linear-gradient(90deg, transparent 14px, #86909c 0);
      }
    }
  }
}
</style>
