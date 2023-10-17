import { renderAsync } from "docx-preview";

const options = {
  className: "docx", // 默认和文档样式类的类名/前缀
  inWrapper: true, // 启用围绕文档内容渲染包装器
  ignoreWidth: false, // 禁止页面渲染宽度
  ignoreHeight: false, // 禁止页面渲染高度
  ignoreFonts: false, // 禁止字体渲染
  breakPages: true, // 在分页符上启用分页
  ignoreLastRenderedPageBreak: true, //禁用lastRenderedPageBreak元素的分页
  experimental: false, //启用实验性功能（制表符停止计算）
  trimXmlDeclaration: true, //如果为真，xml声明将在解析之前从xml文档中删除
  debug: false, // 启用额外的日志记录
};

export const preDocx = (target: any) => (file: any) => {
  let blob = new Blob([file], { type: "text/xml" });
  renderAsync(blob, target, null, options);
};
