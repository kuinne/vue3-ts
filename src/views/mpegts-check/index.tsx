import { defineComponent, onMounted, ref, watch } from "vue";
import token from "./token";
import mpegtsJs from "mpegts.js";
import VConsole from "vconsole";

export default defineComponent({
  setup() {
    // const url =
    //   "wss://v6r2aiotdev.rd.chn-das.com/api/client/media/v1/websocket/video/01972d16e89753fc0694967d808b0219.flv?access_token=" +
    //   token;
    const url =
      "https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv";

    const video = ref<HTMLMediaElement | null>(null);
    const config = {};
    const error = ref("");
    const onError = (err: any) => {
      console.log("zzz", err);
      error.value = err;
    };
    const init = async () => {
      if (!video.value) return;
      const mediaDataSource = {
        type: "flv",
        isLive: true,
        url,
      };
      const player = mpegtsJs.createPlayer(mediaDataSource, config);
      player.attachMediaElement(video.value);
      player.load();
      player.play();

      player.on(mpegtsJs.Events.ERROR, onError);
    };

    watch(video, () => {
      if (video.value) {
        init();
      }
    });
    onMounted(() => {
      const vConsole = new VConsole();
    });
    return () => (
      <div>
        <div>test</div>
        <div>{error.value}</div>
        <video ref={video}></video>
      </div>
    );
  },
});
