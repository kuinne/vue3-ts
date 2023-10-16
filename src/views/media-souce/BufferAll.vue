<template>
  <video id="video" controls muted></video>
</template>
<script setup>
import { onMounted } from "vue";
import assetURL from "./frag_bunny.mp4";
onMounted(() => {
  const video = document.getElementById("video");

  const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

  if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener("sourceopen", sourceOpen);
  }

  function sourceOpen(_) {
    const mediaSource = this;
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    fetchAB(assetURL, function (buf) {
      sourceBuffer.addEventListener("updateend", function (_) {
        mediaSource.endOfStream();

        video.play();
      });
      sourceBuffer.appendBuffer(buf);
    });
  }

  function fetchAB(url, cb) {
    console.log(url);
    const xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      cb(xhr.response);
    };
    xhr.send();
  }
});
</script>
