libavformat 编码解码

libavfilter 过滤器
-vf 视频
-af 音频
-lavfi 相当于 -filter_complex 复杂过滤

-code[:stream_specifiter]
-c:v 视频流
-c:v libx264 -c:a copy
使用 libx264 编码所有视频流并复制所有音频流。
