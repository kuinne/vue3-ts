<template>
  <div>
    <video id="video2" controls muted></video>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import assetURL from "./frag_bunny.mp4";
onMounted(() => {
  const video = document.getElementById("video2");
  const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  const totalSegments = 5;
  /** 分片大小 */
  let segmentLength = 0;
  /** 分片时间 */
  let segmentDuration = 0;
  let bytesFetched = 0;
  const requestedSegments = [];
  let fileLength = 0;

  for (let i = 0; i < totalSegments; ++i) requestedSegments[i] = false;

  let mediaSource = null;
  if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
    mediaSource = new MediaSource();
    // 使用URL.createObjectURL为video元素创建一个URL对象，作为视频源
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener("sourceopen", sourceOpen);
  } else {
    console.error("Unsupported MIME type of codec: ", mimeCodec);
  }

  let sourceBuffer = null;
  function sourceOpen(_) {
    console.log("开始拉取资源");
    // 向媒体源添加一个源缓冲区，并将其赋值给sourceBuffer变量
    sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    getFileLength(assetURL, function (_fileLength) {
      fileLength = _fileLength;
      console.log("资源总大小：", fileLength);
      // 计算每个分片的大小
      segmentLength = Math.round(fileLength / totalSegments);
      console.log("分片大小：", segmentLength);
      // 获取第一个分片的数据并追加到源缓冲区
      fetchRange(assetURL, 0, segmentLength, appendSegment);
      requestedSegments[0] = true;
      // 当currentTime更新时会触发timeupdate事件。
      video.addEventListener("timeupdate", checkBuffer);
      // 在终端可以播放媒体文件时（但估计还没有加载足够的数据来播放媒体直到其结束，即后续可能需要停止以进一步缓冲内容）被触发
      video.addEventListener("canplay", function () {
        console.log("开始播放");
        // 计算每个分片的持续时间
        segmentDuration = video.duration / totalSegments;
        console.log("分片时间大小：", segmentDuration);
        video.play();
      });
      video.addEventListener("seeking", seek);
    });
  }
  function getFileLength(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("head", url);
    xhr.onload = function () {
      cb(xhr.getResponseHeader("content-length"));
    };
    xhr.send();
  }

  function fetchRange(url, start, end, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.responseType = "arraybuffer";
    console.log(`请求资源范围：${start}-${Math.min(end, fileLength - 1)}`);
    xhr.setRequestHeader(
      "Range",
      "bytes=" + start + "-" + Math.min(end, fileLength - 1)
    );

    xhr.onload = function () {
      bytesFetched += end - start + 1;
      console.log(`获取资源：`, xhr.response);
      cb(xhr.response);
    };
    xhr.send();
  }

  function appendSegment(chunk) {
    // 将数据块追加到源缓冲区
    sourceBuffer.appendBuffer(chunk);
  }
  /** 检查视频缓冲区的状态，根据条件执行相应的操作 */
  function checkBuffer(_) {
    const currentSegment = getCurrentSegment();
    console.log("请求分片序号", currentSegment);
    // 如果当前片段是最后一个片段，并且所有片段都已经加载完毕，则结束流并移除时间更新事件的监听
    if (currentSegment === totalSegments && haveAllSegments()) {
      console.log("最后一个片段", mediaSource.readyState);
      mediaSource.endOfStream();
      video.removeEventListener("timeupdate", checkBuffer);
    }
    // 否则，如果满足获取下一个片段的条件，则标记该片段为已请求，并请求下一个片段的数据
    else if (shouldFetchNextSegment(currentSegment)) {
      requestedSegments[currentSegment] = true;
      console.log("获取下一个分片的时间", video.currentTime);
      fetchRange(
        assetURL,
        bytesFetched,
        bytesFetched + segmentLength,
        appendSegment
      );
    }
  }

  // TODO
  /** 处理视频的跳转操作 */
  function seek(e) {
    // 如果媒体源处于打开状态，则中止之前的数据缓冲操作
    if (mediaSource.readyState === "open") {
      sourceBuffer.remove();
      // sourceBuffer.abort();
      console.log(mediaSource.readyState);
    }
    // 否则，输出媒体源的状态信息
    else {
      console.log("seek but not open?");
      console.log(mediaSource.readyState);
    }
  }
  /** 计算当前播放时间所对应的片段序号 */
  function getCurrentSegment() {
    return ((video.currentTime / segmentDuration) | 0) + 1;
  }
  /** 检查所有片段是否都已经请求过了 */
  function haveAllSegments() {
    return requestedSegments.every((i) => !!i);
  }
  /** 判断是否需要获取下一个片段 */
  function shouldFetchNextSegment(currentSegment) {
    return (
      video.currentTime > segmentDuration * currentSegment * 0.8 &&
      !requestedSegments[currentSegment]
    );
  }
});
</script>
