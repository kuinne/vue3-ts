<template>
  <draggable-resizable
    class="draggable-resizable"
    class-name-dragging="dragging"
    class-name-active="active"
    :init-w="props.config.width"
    :init-h="props.config.height"
    v-model:x="props.config.x"
    v-model:y="props.config.y"
    v-model:w="props.config.width"
    v-model:h="props.config.height"
    :parent="false"
    :resizable="true"
    :draggable="true"
    @dragging="handleDrag"
    @drag-end="handleDragend"
    @activated="handleActivate"
    @deactivated="handleDeactivate"
  >
    <tree-component
      :width="props.config.width"
      :height="props.config.height"
      :icon="props.config.icon"
    ></tree-component>
    <div :class="dragMaskClass" class="mask"></div>
  </draggable-resizable>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DraggableResizable from "vue3-draggable-resizable";
import { createTreeDComponent } from "./initTreeTemplate";
const props = defineProps({
  config: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["onDragActived", "onDragDeactivated"]);

const dragMaskClass = ref("");

// 开始拖拽
const handleDrag = (e) => {
  console.log("handleDrag");

  dragMaskClass.value = "mask-dragging";
};

// 拖拽结束
const handleDragend = () => {
  console.log("handleDragend");

  dragMaskClass.value = "mask-dragactive";
};

// 选中
const handleActivate = () => {
  console.log("handleActivate");

  dragMaskClass.value = "mask-dragactive";
  emit("onDragActived", props.config);
};

// 取消选中
const handleDeactivate = () => {
  console.log("handleDeactivate");

  dragMaskClass.value = "";
  emit("onDragDeactivated", props.config.key);
};

const treeComponent = createTreeDComponent(props.config);
</script>
<style lang="scss" scoped>
.draggable-resizable {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0c314;
    pointer-events: none;
    display: none;
    box-shadow: 1px 1px 40px #15d7aa;
  }
  .mask-dragactive {
    opacity: 0.2;
    display: block;
  }
  .mask-dragging {
    opacity: 0.1;
    display: block;
  }
}
.active {
  cursor: all-scroll;
  border-style: solid;
  border-color: #d5ad11;
  border-width: 2px;
  z-index: 100;
}
</style>
