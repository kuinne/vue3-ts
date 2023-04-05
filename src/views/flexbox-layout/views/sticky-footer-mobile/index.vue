<template>
  <body>
    <div class="main-container">
      <div class="header">Header：固定尺寸</div>
      <div class="content-wrapper">
        <div class="scroll-wrapper">
          <div class="content">
            在 iOS 系统上触发了一个 Flexbox 的 Bug，就是在滚动容器上显示设置
            overflow-y:scroll ，滚动依旧失效 。造成这个 Bug 是因为我们上面的 CSS
            代码触发了 Flex 项目的边缘情况。如果要避免这个 Bug
            的出现，需要对结构做出一定的调整：<code>min-height: 0</code>
            <img
              src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b437393646ee44cf8671be0725d11b24~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp"
            />
            <img
              src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4378590856b44862b5a99a56ea84ac55~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp"
            />
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style lang="scss" scoped>
body {
  width: 100vw;
  height: 100vh;
  font-family: "Exo", Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

.main-container {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
}

.header {
  height: 100px;
  padding: 20px;
  background-color: #0b5ab0;
  color: white;
  border-radius: 5px 5px 0 0;
  display: flex;
  align-items: center;
}

.content-wrapper {
  display: flex;
  flex: 1;
  min-height: 0; /* 这个很重要*/
}

.scroll-wrapper {
  flex: 1;
  overflow-y: auto;
}

.content {
  height: 2000px;
  color: black;
  background-color: #ddd;
}
img {
  max-width: 100%;
}
</style>
