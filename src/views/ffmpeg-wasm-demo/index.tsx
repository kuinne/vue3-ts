import { defineComponent, ref } from "vue";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import type { LogEvent } from "@ffmpeg/ffmpeg/dist/esm/types";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.5/dist/esm";
// const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.5/dist/esm";
const videoURL =
  "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi";
export default defineComponent({
  setup() {
    const video = ref("");

    const ffmpeg = new FFmpeg();
    const message = ref("Click Start to Transcode");
    const progressMsg = ref("");

    const transcode = async () => {
      message.value = "Loading ffmpeg-core.js";
      progressMsg.value = "";
      ffmpeg.on("log", ({ message: msg }: LogEvent) => {
        message.value = msg;
      });
      ffmpeg.on("progress", ({ progress, time }) => {
        progressMsg.value = `${progress * 100}% (transcoded time: ${
          time / 1000000
        } s)`;
      });
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });
      message.value = "Start transcoding";

      //   await ffmpeg.writeFile("test.avi", await fetchFile(videoURL));
      //   await ffmpeg.exec(["-i", "test.avi", "test.mp4"]);
      await ffmpeg.writeFile(
        "input.webm",
        await fetchFile(
          "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm"
        )
      );
      //   await ffmpeg.writeFile(
      //     "arial.ttf",
      //     await fetchFile(
      //       "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf"
      //     )
      //   );
      //   await ffmpeg.exec([
      //     "-i",
      //     "input.webm",
      //     "-vf",
      //     "drawtext=fontfile=/arial.ttf:text='hello world ffmpeg.wasm':x=10:y=10:fontsize=24:fontcolor=white",
      //     "output.mp4",
      //   ]);
      await ffmpeg.exec([
        "-i",
        "input.webm",
        "-vf",
        "drawbox=enable='between(t,2,3)':x=50:y=50:w=100:h=100:color=green@0.7",
        "output.mp4",
      ]);
      message.value = "Complete transcoding";
      //   const data = await ffmpeg.readFile("test.mp4");

      const data = await ffmpeg.readFile("output.mp4");
      video.value = URL.createObjectURL(
        new Blob([(data as Uint8Array).buffer], { type: "video/mp4" })
      );
    };

    return () => (
      <div>
        <video src={video.value} controls />
        <br />
        <button onClick={transcode}>Start</button>
        <p>{message.value}</p>
        <p>{progressMsg.value}</p>
      </div>
    );
  },
});
