<template>
  <div>
    <canvas id="canvas-1" width="500" height="300" ref="canvas"> </canvas>

    <button @click="handlePlay">播放</button>
    <button @click="handleStop">暂停</button>
    <button @click="handleScreenshot">截图</button>
    <button @click="handleScreenshot2">截图2</button>
    <button @click="handleScreenshot3">截图3</button>
    <img :src="imgUrl" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import html2canvas from "html2canvas";
import ScreenShot from "js-web-screen-shot";

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: any;
const imgUrl = ref("");
let timer: any;
const video = document.createElement("video");
const handlePlay = () => {
  if (!canvas.value) return;

  ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  video.src = "https://www.twle.cn/static/i/html/html_video_2.mp4";
  video.addEventListener("play", () => {
    const draw = () => {
      if (!canvas.value) return;
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, canvas.value.width, canvas.value.height);
      requestAnimationFrame(draw);
    };
    draw();
  });
  video.play();
};

const handleStop = () => {
  clearInterval(timer);
  video.pause();
};

const handleScreenshot = () => {
  if (!canvas.value) return;

  const img = new Image();
  img.crossOrigin = "anonymous"; // Set crossOrigin attribute
  img.onload = function () {
    ctx.drawImage(img, 0, 0);

    // Now you can safely use toDataURL
    const dataURL = canvas.value.toDataURL("image/png");
    console.log(dataURL);
  };
  img.src =
    "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg";
};

const handleScreenshot2 = () => {
  new ScreenShot({
    // enableWebRtc: false,
    // imgSrc: canvas.value.toDataURL("image/png"),
    loadCrossImg: true,
    completeCallback: (...args: any[]) => {
      console.log("args", args);
      const base64 = args[0].base64;
      const img = new Image();
      img.src = base64;
      document.body.appendChild(img);
    },
  });
};

const handleScreenshot3 = async () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const screenshot = document.createElement("screenshot");

  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia();
    screenshot.srcObject = captureStream;
    context.drawImage(screenshot, 0, 0, window.width, window.height);
    const frame = canvas.toDataURL("image/png");
    captureStream.getTracks().forEach((track) => track.stop());
    // window.location.href = frame;
  } catch (err) {
    console.error("Error: " + err);
  }
};
</script>
