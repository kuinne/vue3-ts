<template>
  <div class="container" ref="target"></div>
  <button @click="handleExport">导出</button>
</template>
<script setup lang="ts">
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";
import { ref } from "vue";

const target = ref<HTMLDivElement | null>(null);

const handleExport = () => {
  if (!target.value) return;
  exportDocx(target.value);
};

const exportDocx = (elem: HTMLElement) => {
  // const scale = 2
  // domToImage
  //   .toJpeg(elem, {
  //     width: elem.clientWidth * scale,
  //     height: elem.clientHeight * scale,
  //     style: { transform: 'scale(' + scale + ')', transformOrigin: 'top left', margin: '0' },
  //     bgcolor: '#fff',
  //   })
  //   .then((dataUrl) => {
  //     const dom = `<img src=${dataUrl} width="625"/>`
  //     const fileData = asBlob(dom, {

  //       }).then(data => {
  //       saveAs(data, 'file.docx') // 保存为docx文件
  //   })
  //   })

  const htmlDoc = `
  <!DOCTYPE html>
  <html lang="en">
  ${elem.outerHTML}
  </html>
  `;

  const fileData = asBlob(htmlDoc).then((data) => {
    saveAs(data, "file.docx"); // 保存为docx文件
  });
};
</script>
