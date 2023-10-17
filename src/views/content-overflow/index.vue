<template>
  <div class="device-content">
    <div class="container">
      <div class="card">
        <div class="title">Card Title</div>
        <img src="https://picsum.photos/1200/300?random=5" alt="" />
      </div>

      <div class="card">
        <div class="title">Card Title</div>
        <div class="box"></div>
      </div>
    </div>
  </div>
  change<input type="checkbox" @change="handleChange" />
</template>
<script setup lang="ts">
import { ref } from "vue";

const width = ref("386px");

const handleChange = (e) => {
  if (e.target.checked) {
    width.value = "min(100%, 386px)";
  } else {
    width.value = "386px";
  }
};
</script>
<style scoped lang="scss">
.container {
  padding: 3rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.device-content {
  width: 428px;
}
.card {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgb(0 0 0 / 0.125);
  box-shadow: 0 0 1px 1px rgb(0 0 0 / 0.025);
  background-color: #fff;
  color: #444;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  .title {
    font-size: clamp(1rem, 1vw + 1.125rem, 1.5rem);
    margin-bottom: 0.25em;
    text-shadow: 1px 1px 1px rgb(220 220 220 / 0.12);
  }

  img {
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.125);
    box-shadow: 0 0 1px 1px rgb(0 0 0 / 0.025);
    aspect-ratio: 4 / 1;
    width: v-bind(width);
  }

  .box {
    aspect-ratio: 4 / 1;
    background: rgb(145 39 39 / 50%);
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.125);
    box-shadow: 0 0 1px 1px rgb(0 0 0 / 0.025);
    width: v-bind(width);
  }
}
</style>
