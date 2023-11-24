<template>
  <div>
    <canvas id="canvas-1" width="500" height="300" ref="canvas"> </canvas>
    <button @click="handlePlay">播放</button>
    <button @click="handleStop">暂停</button>
    <button @click="handleScreenshot">截图</button>
    <img :src="imgUrl" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import html2canvas from "html2canvas";

const canvas = ref<HTMLCanvasElement>(null);
const imgUrl = ref("");
let timer;
const video = document.createElement("video");
const handlePlay = () => {
  if (!canvas.value) return;

  const ctx = canvas.value.getContext("2d");

  //   ctx.fillStyle = "green";
  //   ctx.fillRect(10, 10, 150, 100);
  video.src = "https://www.twle.cn/static/i/html/html_video_2.mp4";
  video.play();
  timer = setInterval(() => {
    if (video.currentTime >= video.duration) {
      handleStop();
    }

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }, 16);
};

const handleStop = () => {
  clearInterval(timer);
  video.pause();
};

const handleScreenshot = () => {
  if (!canvas.value) return;
  handleStop();
  html2canvas(canvas.value, {
    allowTaint: true,
    // foreignObjectRendering: true,
  }).then((res) => {
    res.toBlob((d) => {
      console.log("d", d);
    });
  });
};
</script>
