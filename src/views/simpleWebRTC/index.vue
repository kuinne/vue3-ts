<template>
  <div>
    <button @click="handleLocalStream">
      {{ isLocalStreamOpen ? "关闭摄像头" : "打开摄像头" }}
    </button>
    <button @click="takePhoto">拍照</button>
    <button @click="shareScreen">分享屏幕</button>
    <button @click="startRecord">
      {{ timer === 0 ? " 开始录制" : "终止录制 | " + timer }}
    </button>
    <select v-model="deviceId" @change="handleDeviceChange">
      <option v-for="item in devices" :value="item.deviceId">
        {{ item.label }}
      </option>
    </select>
    <select v-model="mimeType" @change="handleMimeTypesChange">
      <option v-for="item in mimeTypes" :value="item">
        {{ item }}
      </option>
    </select>
    <video
      id="localVideo"
      autoplay
      playsinline
      muted
      width="500"
      height="300"
    ></video>
    <div v-for="(item, index) in imgList" :key="index" class="item">
      <img width="200" :src="item" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const imgList = ref<string[]>([]);
const devices = ref<MediaDeviceInfo[]>([]);
const deviceId = ref<string>("");
const mimeTypes = ref<string[]>([]);
const mimeType = ref("video/webm;codecs=vp9");
const localStream = ref<MediaStream>();
const isLocalStreamOpen = ref(false);
const mediaRecorder = ref<MediaRecorder>();
const timer = ref<number>(0);
// 获取本地音视频流
async function getLocalStream() {
  // 获取媒体流
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  localStream.value = stream;
  isLocalStreamOpen.value = true;
  // 将媒体流设置到 video 标签上播放
  playLocalStream(stream);
}

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const videoEl = document.getElementById("localVideo") as HTMLVideoElement;
  videoEl.srcObject = stream;
  videoEl.onloadedmetadata = () => {
    videoEl.play();
  };
}

// 关闭本地音视频流
function closeLocalStream() {
  if (!localStream.value) return;
  localStream.value.getTracks().forEach((track) => {
    track.stop();
  });
  isLocalStreamOpen.value = false;
}

// 操作本地音视频流

function handleLocalStream() {
  if (isLocalStreamOpen.value) {
    closeLocalStream();
  } else {
    getLocalStream();
  }
}

// 拍照
function takePhoto() {
  const videoEl = document.getElementById("localVideo") as HTMLVideoElement;
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  imgList.value.push(canvas.toDataURL("image/png"));

  // 添加滤镜
  const filterList = [
    "blur(5px)", // 模糊
    "brightness(0.5)", // 亮度
    "contrast(200%)", // 对比度
    "grayscale(100%)", // 灰度
    "hue-rotate(90deg)", // 色相旋转
    "invert(100%)", // 反色
    "opacity(90%)", // 透明度
    "saturate(200%)", // 饱和度
    "saturate(20%)", // 饱和度
    "sepia(100%)", // 褐色
    "drop-shadow(4px 4px 8px blue)", // 阴影
  ];

  for (let i = 0; i < filterList.length; i++) {
    ctx.filter = filterList[i];
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    imgList.value.push(canvas.toDataURL("image/png"));
  }
}

// 获取所有视频输入设备
async function getDevices() {
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  console.log("🚀🚀🚀 / devices", allDevices);
  devices.value = allDevices.filter((device) => device.kind === "videoinput");
  deviceId.value = devices.value?.[0].deviceId;
}

// 切换设备
async function handleDeviceChange() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: { exact: deviceId.value },
    },
  });
  playLocalStream(stream);
}

// 获取屏幕共享的媒体流
async function shareScreen() {
  let localScream = await navigator.mediaDevices.getDisplayMedia({
    audio: {
      echoCancellation: true, // 回音消除
      noiseSuppression: true, // 噪音抑制
      autoGainControl: true, // 自动增益
    },
    video: {
      width: 1920, // 视频宽度
      height: 1080, // 视频高度
      frameRate: 60, // 帧率
      aspectRatio: 16 / 9, // 宽高比
    },
  });
  localStream.value = localScream;

  playLocalStream(localScream);
}

// 获取支持的媒体类型
function getSupportedMimeTypes() {
  const media = "video";
  const types = [
    "webm",
    "mp4",
    "ogg",
    "mov",
    "avi",
    "wmv",
    "flv",
    "mkv",
    "ts",
    "x-matroska",
  ];
  const codecs = [
    "vp9",
    "vp9.0",
    "vp8",
    "vp8.0",
    "avc1",
    "av1",
    "h265",
    "h264",
  ];
  // codecs: "should-not-be-supported","vp9", "vp9.0", "vp8", "vp8.0", "avc1", "av1", "h265", "h.265", "h264", "h.264", "opus", "pcm", "aac", "mpeg", "mp4a"
  const isSupported = MediaRecorder.isTypeSupported;
  const supported: string[] = [];
  types.forEach((type: string) => {
    const mimeType = `${media}/${type}`;
    if (isSupported(mimeType)) supported.push(mimeType);
    codecs.forEach((codec: string) =>
      [
        `${mimeType};codecs=${codec}`,
        `${mimeType};codecs=${codec.toUpperCase()}`,
      ].forEach((variation) => {
        if (isSupported(variation)) supported.push(variation);
      })
    );
  });
  // console.log('🚀🚀🚀 / supported', supported)
  mimeTypes.value = supported;
  return supported;
}

function handleMimeTypesChange(val: string) {
  mimeType.value = val;
}

// 录制媒体流
async function startRecord() {
  if (!localStream.value) return;
  if (mediaRecorder.value?.state === "recording") {
    mediaRecorder.value.stop();
    return;
  }
  const kbps = 1024;
  const Mbps = kbps * kbps;
  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 250000,
    mimeType: mimeType.value,
    // mimeType: 'video/webm; codecs="vp8,opus"',
    // bitsPerSecond: 2000 * Mbps,
  };
  const chunks: Blob[] = [];
  let timerId: any;
  mediaRecorder.value = new MediaRecorder(localStream.value, options);
  mediaRecorder.value.start();
  mediaRecorder.value.onstart = () => {
    // 计时
    // 计时
    timerId = setInterval(() => {
      timer.value++;
    }, 1000);
  };
  mediaRecorder.value.ondataavailable = (e) => {
    chunks.push(e.data);
  };
  mediaRecorder.value.onstop = (e: Event) => {
    timer.value = 0;
    clearInterval(timerId);
    // 将录制的数据合并成一个 Blob 对象
    // const blob = new Blob(chunks, { type: chunks[0].type })
    console.log("sss", mediaRecorder.value?.mimeType);

    const blob = new Blob(chunks, { type: mediaRecorder.value?.mimeType });
    downloadBlob(blob);
    chunks.length = 0;
  };
}

// 下载 Blob
function downloadBlob(blob: Blob) {
  // 将 Blob 对象转换成一个 URL 地址
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  // 设置 a 标签的 href 属性为刚刚生成的 URL 地址
  a.href = url;
  // 设置 a 标签的 download 属性为文件名
  a.download = `${new Date().getTime()}.${
    blob.type.split("/")[1].split(";")[0]
  }`;
  // 模拟点击 a 标签
  a.click();
  // 释放 URL 地址
  URL.revokeObjectURL(url);
}

onMounted(() => {
  getSupportedMimeTypes();
  getDevices();
});
</script>
