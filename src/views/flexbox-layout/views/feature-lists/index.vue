<template>
  <Container flexDirection="column">
    <p>
      要真正达到均分列，只在 Flex 项目上显式设置 flex:1 是不够的，还需要在 Flex
      项目上显式设置 min-width 值为 0
    </p>
    <Toggle
      v-model="minWidth"
      :values="['unset', '0']"
      label="min-width:unset / 0"
    ></Toggle>
    <div class="device">
      <main></main>
      <footer>
        <a href="">
          <svg
            t="1641978879209"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2113"
            width="200"
            height="200"
          >
            <path
              d="M492.48 372.928l26.752 24.448-13.376 14.464H678.4l0.544 40.064-107.392 0.544v51.744l106.24 1.696v26.144h-105.696l-0.544 93.472c35.584 1.12 47.296-13.888 47.296-13.888l-12.256-24.512 64-37.28 33.92 75.68v-227.616c-40.64-104.64-212.032-25.056-212.032-25.056v0.096zM512 64C264.576 64 64 264.608 64 512c0 247.424 200.576 448 448 448s448-200.576 448-448C960 264.64 759.424 64 512 64zM288.288 276.576a53.44 53.44 0 1 1 0 106.848 53.44 53.44 0 0 1 0-106.88z m54.528 298.304l-77.92 160.256-83.52-53.44 110.24-120.192c15.552-20.032 0-44.512 0-44.512l-81.28-70.112 35.648-48.96s38.976 30.048 81.824 72.32c42.816 42.304 15.008 104.64 15.008 104.64z m459.68 80.096s-6.688 94.624-99.04 92.416c-92.352-2.24-92.416 0-92.416 0h-26.72s-15.552-21.696 0.576-53.984c0 0 33.92-5.6 39.488 13.344h38.976s37.824-7.232 40.608-66.784l-53.44 40.064-19.456-39.52s-70.72 56.768-128.576 52.896h-78.464s-51.2-13.344-53.984-80.704v-52.32h80.16s-8.352 82.368 38.944 78.464l1.12-105.76h-120.224v-26.72h120.224l-0.544-52.864-17.28-0.544-48.96 48.416-32.32-28.928 60.672-60.096-1.664-27.296-76.256 70.112-46.176-46.176s61.184-39.52 81.248-132.48l68.448 17.28-11.136 36.16s298.272-109.056 336.16 81.28v243.744h0.032z"
              fill="currentColor"
              p-id="2114"
            ></path>
          </svg>
          首页
        </a>
        <a href="">
          <svg
            t="1641979219459"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5031"
            width="200"
            height="200"
          >
            <path
              d="M920.8832 403.285333C920.8832 180.906667 737.8944 0.682667 512.136533 0.682667 286.344533 0.682667 103.2192 180.906667 103.2192 403.285333c0 141.5168 74.1376 265.966933 186.2656 337.681067l-84.7872 167.048533a68.266667 68.266667 0 0 0 60.893867 99.157334h492.9536a68.266667 68.266667 0 0 0 60.859733-99.157334l-84.753067-167.048533c112.093867-71.68 186.231467-196.164267 186.231467-337.681067zM512 201.9328c112.9472 0 204.458667 90.112 204.458667 201.352533 0 111.2064-91.511467 201.3184-204.458667 201.3184s-204.458667-90.112-204.458667-201.3184C307.712 292.0448 399.223467 201.9328 512 201.9328z"
              p-id="5032"
              fill="currentColor"
            ></path>
            <path
              d="M439.773867 474.453333a103.253333 103.253333 0 0 0 98.679466 26.043734 101.376 101.376 0 0 0 72.226134-71.168 99.566933 99.566933 0 0 0-26.4192-97.1776 103.287467 103.287467 0 0 0-144.4864 0 99.5328 99.5328 0 0 0 0 142.301866z"
              p-id="5033"
              fill="currentColor"
            ></path>
          </svg>
          逛逛
        </a>
        <a href="">
          <svg
            t="1641979247030"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5855"
            width="200"
            height="200"
          >
            <path
              d="M544 161.536a330.666667 330.666667 0 0 1 298.666667 329.130667h-0.341334c0.213333 1.493333 0.341333 2.986667 0.341334 4.565333v219.434667h39.68a32 32 0 0 1 0 64h-212.053334a160 160 0 0 1-316.586666 0H141.909333a32 32 0 1 1 0-64h39.424v-219.434667c0-1.578667 0.128-3.072 0.341334-4.565333H181.333333a330.666667 330.666667 0 0 1 298.666667-329.130667V128a32 32 0 1 1 64 0v33.536z m-298.666667 553.130667h533.333334v-219.434667c0-1.578667 0.128-3.072 0.341333-4.565333h-0.341333a266.666667 266.666667 0 1 0-533.333334 0h-0.341333c0.213333 1.493333 0.341333 2.986667 0.341333 4.565333v219.434667z m359.765334 64H418.901333a96 96 0 0 0 186.197334 0z"
              fill="currentColor"
              p-id="5856"
            ></path>
          </svg>
          消息
        </a>
        <a href="">
          <svg
            t="1641979285731"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6677"
            width="200"
            height="200"
          >
            <path
              d="M346.112 806.912q19.456 0 36.864 7.168t30.208 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.208 20.48-36.864 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 37.888-7.168zM772.096 808.96q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM944.128 227.328q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-13.312 37.888-22.016 62.976-23.552 68.096-18.944 53.248q-13.312 40.96-33.28 56.832t-49.664 15.872l-35.84 0-65.536 0-86.016 0-96.256 0-253.952 0 14.336 92.16 517.12 0q49.152 0 49.152 41.984 0 20.48-9.728 35.328t-38.4 14.848l-49.152 0-94.208 0-118.784 0-119.808 0-99.328 0-55.296 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-13.312l21.504 0 21.504 0 25.6 0 34.816 0q20.48 0 32.768 6.144t19.456 15.36 10.24 19.456 5.12 17.408q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0zM867.328 194.56l-374.784 0 135.168-135.168q23.552-23.552 51.712-24.064t51.712 23.04z"
              p-id="6678"
              fill="currentColor"
            ></path>
          </svg>
          购物车
        </a>
        <a href="">
          <svg
            t="1641979315815"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7467"
            width="200"
            height="200"
          >
            <path
              d="M512 558.545455c-141.963636 0-256-125.44-256-279.272728S370.036364 0 512 0s256 125.44 256 279.272727-114.036364 279.272727-256 279.272728zM93.090909 826.181818A197.818182 197.818182 0 0 1 290.909091 628.363636h442.181818a197.818182 197.818182 0 1 1 0 395.636364h-442.181818A198.050909 198.050909 0 0 1 93.090909 826.181818z"
              p-id="7468"
              fill="currentColor"
            ></path>
          </svg>
          <span>我的淘宝搜索</span>
        </a>
      </footer>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const minWidth = ref("unset");
</script>

<style lang="scss" scoped>
.device {
  width: 300px;
  aspect-ratio: 3 /5;
  resize: both;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  main {
    flex: 1;
  }
  footer {
    display: flex;
    background-color: rgb(120 98 120 / 0.9);
    border-top: 1px solid rgb(100 100 100 / 0.5);
    margin-top: auto;
    padding: 20px 0 30px;
    color: #fff;
    a {
      text-decoration: none;
      color: #fff;
      font-size: 1em;
      display: inline-flex;
      flex-direction: column;
      flex: 1;
      min-width: v-bind(minWidth);
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-size: 0.825em;
      font-weight: 700;
      border: 1px dashed;
      span {
        white-space: nowrap;
      }
    }
    svg {
      width: 1em;
      height: 1em;
      font-size: 1.5rem;
    }
  }
}
</style>
