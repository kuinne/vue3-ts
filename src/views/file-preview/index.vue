<!--
 * @Author: Kvon
 * @Date: 2023-10-09 15:55:30
 * @Description: 
-->
<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :auto-upload="false"
      :on-change="onUploadChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <div id="luckysheetEl" class="docxRef" ref="docxRef">
      <canvas
        :id="'canvas' + pageIndex"
        v-for="pageIndex in pdfPages"
        :key="pageIndex"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElUpload } from "element-plus";

import LuckyExcel from "luckyexcel";
// import * as pdfjs from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.entry";
import { ref } from "vue";
import { preDocx } from "./preDoc";
import { preXlsx } from "./preXlsx";
// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const pdfFile = ref<any>(null);
const pdfPages = ref(0);
const timer = ref<any>(null);

const docxRef = ref<any>(null);

const onUploadChange = (file: any) => {
  const _file = file.raw;
  let _type = _file.name.split(".")[1];
  if (_type === "docx") {
    preDocx(docxRef.value)(_file);
  } else if (_type === "xlsx") {
    // 使用xlsx预览
    // preXlsx(docxRef.value)(_file);
    // 使用luckyexcel+luckysheet进行预览
    preLuckySheet(_file);
  } else if (_type === "pdf") {
    prePDF(_file);
  } else {
    console.error("Import failed. Is your fail a valid file?");
  }
};

const preLuckySheet = (file: any) => {
  LuckyExcel.transformExcelToLucky(
    file,
    function (exportJson, luckysheetfile) {
      // 获得转化后的表格数据后，使用luckysheet初始化，或者更新已有的luckysheet工作簿
      // 注：luckysheet需要引入依赖包和初始化表格容器才可以使用
      console.log(exportJson);
      // @ts-ignore
      console.log("luckysheet", luckysheet);

      luckysheet.create({
        container: "luckysheetEl", // luckysheet is the container id
        data: exportJson.sheets,
        title: exportJson.info.name,
        userInfo: exportJson.info.name.creator,
        lang: "zh", // 设定表格语言
        showinfobar: false, //是否显示顶部信息栏
        showtoolbar: false, //是否显示顶部工具栏
        sheetFormulaBar: false, //是否显示公式栏
      });
      // this.createExcel()
    },
    function (err) {
      console.error("Import failed. Is your fail a valid xlsx?");
    }
  );
};

const prePDF = (file: any) => {
  // const reader = new FileReader();
  // reader.readAsArrayBuffer(file);
  // // onload该事件在读取操作完成时触发
  // reader.onload = () => {
  //   console.log("pdf文件", reader.result);
  //   pdfjs
  //     .getDocument({ data: new Uint8Array(reader.result) })
  //     .then((pdfDoc) => {
  //       pdfFile.value = pdfDoc;
  //       pdfPages.value = pdfDoc.numPages;
  //       // 渲染是需要时间的，要等待渲染结束
  //       timer.value = setTimeout(() => {
  //         renderPage(pdfDoc.numPages);
  //       }, 100);
  //     });
  // };
};

const renderPage = (nums: number) => {
  for (let item = 1; item <= nums; item++) {
    // 获取页面canvas节点
    let canvas = document.getElementById(`canvas${item}`);
    // 获取上下文
    const ctx = canvas.getContext("2d");
    // 获取每一页的内容
    pdfFile.value.getPage(item).then((page) => {
      // 文件页面的视图 1倍
      const viewport = page.getViewport(1.0);
      // pdf不清晰有一个重要的原因是默认dpi为96，然后网页一般使用dpi为72。
      var CSS_UNITS = 96.0 / 72.0;
      canvas.height = Math.floor(viewport.height * CSS_UNITS); // 放大了
      canvas.width = Math.floor(viewport.width * CSS_UNITS); // 放大了
      const renderContext = {
        transform: [CSS_UNITS, 0, 0, CSS_UNITS, 0, 0],
        canvasContext: ctx,
        viewport: viewport,
      };
      // 渲染页面内容：参数是canvas画布上下文，以及文件视图
      page.render(renderContext);
    });
  }
};
</script>

<style>
.docxRef {
  width: 100%;
  height: 500px;
}
</style>
