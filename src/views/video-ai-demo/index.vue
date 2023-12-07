<template>
  <!-- 实时 -->
  <div class="player1">
    <h3>实时player</h3>
    <div class="video" :id="videoId" ref="video"></div>
    <header>
      <div class="header-item">
        <label>ip:</label>
        <input type="text" v-model="deviceIp" />
        <span>设备ip</span>
      </div>
      <div class="header-item">
        <label>chn:</label>
        <input type="number" v-model="deviceChannel" />
        <span>设备通道</span>
      </div>
      <div class="header-item">
        <label>码流:</label>
        <input type="number" v-model="subType" />
        <span>1: 辅码流, 0: 主码流</span>
      </div>
    </header>
    <div class="btn-box">
      <button @click="handlePlay">播放</button>
      <button @click="handleStop">停止</button>
      <button @click="handleSwitchChannel">切换通道</button>
      <button @click="handleChangeTrack">跟踪框</button>
      <button @click="handleScreenshot">截图</button>
      <button @click="handleScreenshot2">截图</button>
    </div>
  </div>
  <!-- 回放 -->
  <div class="player2">
    <h3>回放player</h3>
    <div class="playbackVideo"></div>
    <div class="btn-box">
      <button id="playback">播放</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { CreatePlayer } from "./player/mini-player.js";
// @ts-ignore
import decoderUrl from "./player/general/decoder.js?url";
import { nanoid } from "nanoid";
import domtoimage from "dom-to-image";
import ScreenShot from "js-web-screen-shot";

const video = ref<HTMLDivElement>(null);
const videoId = nanoid();
const deviceIp = ref("172.168.70.9");
const deviceChannel = ref("12");
const subType = ref(0);
const previewUrl = ref("");

let player;

const handlePlay = () => {
  // const options = {
  //   container: `#${videoId}`, // 容器
  //   ip: deviceIp.value, // ip地址
  //   port: 1554, // 端口
  //   isHttps: false, // 是否是https (可选，默认为false)
  //   chn: deviceChannel.value, // 通道
  //   subtype: subType.value, // 1是辅码流，0 是主码流;
  //   isPlayback: false, // 是否是回放流 (可选，默认为false)
  //   threadNum: 4, // 多线程解码线程数,仅在开启多线程解码时有效 (可选，不填默认为4)
  //   decoderUrl: decoderUrl, // decoder.js文件相对于项目根目录的位置（普通解码库）
  // };
  const options = {
    container: `#${videoId}`, // 容器
    ip: deviceIp.value, // ip地址
    port: 1554, // 端口
    isHttps: false, // 是否是https (可选，默认为false)
    chn: deviceChannel.value, // 通道
    subtype: subType.value, // 1是辅码流，0 是主码流;
    isPlayback: false, // 是否是回放流 (可选，默认为false)
    threadNum: 4, // 多线程解码线程数,仅在开启多线程解码时有效 (可选，不填默认为4)
    decoderUrl: decoderUrl, // decoder.js文件相对于项目根目录的位置（普通解码库）
  };
  player = new CreatePlayer(options);

  player.init();
  player.play();
  console.log("player", player);
};
const handleStop = () => {
  player.stop();
};
const handleSwitchChannel = () => {
  player.changeChannel(deviceChannel.value);
};
let flag = false;
const handleChangeTrack = () => {
  flag = !flag;
  player.drawTrack(flag);
};
const handleScreenshot = () => {
  if (!video.value) return;
  const canvas1: HTMLCanvasElement = video.value.querySelector("canvas");
  if (!canvas1) return;
  const canvas = canvas1.cloneNode(true);
  document.body.appendChild(canvas);
  //   const canvas = document.createElement("canvas");
  //   canvas.width = video.value.clientWidth;
  //   canvas.height = video.value.clientHeight;

  //   const context = canvas.getContext("2d");
  //   context?.drawImage(video.value, 0, 0, canvas.width, canvas.height);
  //   const oGrayImg = canvas.toDataURL("image/jpg");

  //   previewUrl.value = oGrayImg;

  //   const str = `temp.jpg`;
  //   if ("download" in document.createElement("a")) {
  //     // 非IE下载
  //     const elem = document.createElement("a");
  //     elem.download = str;
  //     elem.style.display = "none";
  //     elem.href = oGrayImg;
  //     document.body.appendChild(elem);
  //     // document.body.appendChild(canvas);
  //     elem.click();
  //     URL.revokeObjectURL(elem.href); // 释放URL 对象
  //     document.body.removeChild(elem);
  //     // document.body.removeChild(canvas);
  //   }
};

const handleScreenshot2 = () => {
  new ScreenShot({
    // enableWebRtc: false,
    // imgSrc: canvas.value.toDataURL("image/png"),
    loadCrossImg: true,
    completeCallback: (...args: any[]) => {
      console.log("args", args);
      const base64 = args[0].base64;
      const link = document.createElement("a");
      link.download = "screenshot.png";
      link.href = base64;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // const img = new Image();
      // img.src = base64;
      // document.body.appendChild(img);
    },
  });
};
</script>
<style lang="scss" scoped>
body {
  display: flex;
}
.player1 {
  margin-right: 100px;
}
header {
  margin-bottom: 10px;
}
header label {
  display: inline-block;
  width: 40px;
}
.video {
  width: 600px;
  height: 400px;
  background: #000;
}
.btn-box {
  margin-top: 10px;
}
.playbackVideo {
  width: 600px;
  height: 400px;
  background: #000;
}
</style>
