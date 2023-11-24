import { defineComponent, onMounted, onUnmounted, ref, toRefs } from "vue";
import axios, { AxiosResponse } from "axios";
import { ElButton, ElIcon, ElProgress } from "element-plus";
import { Download, Close } from "@element-plus/icons-vue";

const url = "//d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4";

const VideoDownloader = defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { url } = toRefs(props);

    const percentage = ref(0);
    const showProgress = ref(false);

    const cancelToken = ref<any>();

    const reset = () => {
      percentage.value = 0;
    };
    const downloadVideo = async () => {
      cancelToken.value = axios.CancelToken.source();
      try {
        const res: AxiosResponse = await axios.get(url.value, {
          responseType: "blob",
          onDownloadProgress(progressEvent) {
            console.log(progressEvent);
            showProgress.value = true;
            percentage.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            if (percentage.value === 100) {
              showProgress.value = false;
            }
          },
          cancelToken: cancelToken.value.token,
        });
        const downloadUrl = URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "video.mp4");
        link.click();
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("请求取消：", error.message);
        } else {
          console.log("下载异常：", error.message);
        }
      }
    };

    const cancelDownload = () => {
      if (showProgress.value && cancelToken.value) {
        cancelToken.value.cancel("用户取消下载");
      }
    };

    const handleClick = () => {
      reset();
      downloadVideo();
    };
    onMounted(() => {
      reset();
    });

    onUnmounted(() => {
      console.log("unMounted");

      cancelDownload();
    });
    return () => (
      <div>
        {showProgress.value ? (
          <div onClick={handleClick}>
            <ElProgress percentage={percentage.value} />
          </div>
        ) : (
          <div onClick={handleClick}>
            <ElIcon>
              <Download />
            </ElIcon>
          </div>
        )}
      </div>
    );
  },
});
export default defineComponent({
  setup() {
    const show = ref(true);
    const handleClose = () => {
      show.value = false;
    };
    return () => (
      <div>
        {show.value ? <VideoDownloader url={url} /> : null}
        <div onClick={handleClose}>
          <ElIcon>
            <Close />
          </ElIcon>
        </div>
      </div>
    );
  },
});
