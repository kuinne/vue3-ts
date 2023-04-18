<template>
  <div class="test">
    <img :src="url" v-if="url" />
    <div class="pdf" ref="dom">
      <div class="list">
        <div class="item" v-for="item in 8">发生的防守打法是否的是</div>
      </div>
      <img
        style="width: 100%"
        src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb20b2479ae3446694b61d7686321946~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?"
      />
      <el-button @click="handleDownload">下载</el-button>
      <!-- switch parent border: <el-switch v-model="parentBorder" /> switch child
      border: <el-switch v-model="childBorder" /> -->
      <el-table :data="tableData" :border="parentBorder" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <p m="t-0 b-2">State: {{ props.row.state }}</p>
              <p m="t-0 b-2">City: {{ props.row.city }}</p>
              <p m="t-0 b-2">Address: {{ props.row.address }}</p>
              <p m="t-0 b-2">Zip: {{ props.row.zip }}</p>
              <h3>Family</h3>
              <el-table :data="props.row.family" :border="childBorder">
                <el-table-column label="Name" prop="name" />
                <el-table-column label="State" prop="state" />
                <el-table-column label="City" prop="city" />
                <el-table-column label="Address" prop="address" />
                <el-table-column label="Zip" prop="zip" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Date" prop="date" />
        <el-table-column label="Name" prop="name" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import domToImage from "dom-to-image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const parentBorder = ref(false);
const childBorder = ref(false);
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
  {
    date: "2016-05-08",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
  {
    date: "2016-05-06",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
  {
    date: "2016-05-07",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
      {
        name: "Tyke",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114",
      },
    ],
  },
];

const dom = ref<HTMLDivElement | null>(null);
const url = ref("");
// const handleDownload = () => {
//   if (dom.value) {
//     const eleW = dom.value.offsetWidth; // 获得该容器的宽
//     const eleH = dom.value.offsetHeight; // 获得该容器的高
//     domToImage
//       .toJpeg(dom.value, {
//         quality: 2,
//         width: eleW * 2,
//         height: eleH * 2,
//       })
//       .then((pageData) => {
//         // url.value = pageData;
//         let contentWidth = dom.value?.clientWidth!;
//         let contentHeight = dom.value?.clientHeight!;

//         //一页pdf显示html页面生成的canvas高度;
//         let pageHeight = (contentWidth / 592.28) * 841.89;
//         //未生成pdf的html页面高度
//         let leftHeight = contentHeight;
//         //页面偏移
//         let position = 0;
//         //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
//         let imgWidth = 595.28;
//         let imgHeight = (592.28 / contentWidth) * contentHeight;
//         let pdf = new jsPDF("landscape", "px", "");

//         //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
//         //当内容未超过pdf一页显示的范围，无需分页
//         if (leftHeight < pageHeight) {
//           console.log("ss");

//           //   pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
//           pdf.addImage(pageData, "JPEG", 0, 0, contentWidth, contentHeight);
//         } else {
//           while (leftHeight > 0) {
//             // pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
//             pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
//             leftHeight -= pageHeight;
//             position -= 841.89;
//             //避免添加空白页
//             if (leftHeight > 0) {
//               pdf.addPage();
//             }
//           }
//         }

//         pdf.save("content.pdf");
//       });
//   }
// };
const handleDownload = () => {
  if (dom.value) {
    // html2canvas(dom.value, {
    //   scale: 4,
    //   useCORS: true,
    //   allowTaint: true,
    // }).then((canvas) => {
    //   let contentWidth = canvas.width;
    //   let contentHeight = canvas.height;
    //   console.log("contentWidth", contentHeight);

    //   let pageData = canvas.toDataURL("image/jpeg", 1.0);

    //   let PDF = new jsPDF("p", "pt", [contentWidth / 4, contentHeight / 4]);

    //   PDF.addImage(pageData, "JPEG", 0, 0, contentWidth / 4, contentHeight / 4);

    //   PDF.save("test" + ".pdf");
    // });

    domToImage
      .toJpeg(dom.value, {
        quality: 0.95,
        width: dom.value.offsetWidth,
        height: dom.value.offsetHeight,
      })
      .then((pageData) => {
        url.value = pageData;
        const contentWidth = dom.value?.offsetWidth!;
        const contentHeight = dom.value?.offsetHeight!;
        let PDF = new jsPDF("p", "pt", [contentWidth / 2, contentHeight / 2]);
        PDF.addImage(
          pageData,
          "JPEG",
          0,
          0,
          contentWidth / 4,
          contentHeight / 4
        );
        PDF.save("test" + ".pdf");
      });
  }
};
</script>
<style lang="scss" scoped>
.test {
  width: 100%;
  height: 100vh;
  background-color: #e8e8e8;

  overflow: auto;
  /* display: flex;
  justify-content: center; */
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .pdf {
    width: 600px;
    background-color: #fff;
    /* margin: 0 auto; */
    padding: 0 20px;
    transform: scale(2);
    transform-origin: 0 0;
  }
}
</style>
