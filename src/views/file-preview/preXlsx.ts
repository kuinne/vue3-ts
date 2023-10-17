import * as xlsx from "xlsx/xlsx.mjs";

export const preXlsx = (target: any) => (file: any) => {
  let blob = new Blob([file], { type: "text/xml" });
  const reader = new FileReader();
  reader.readAsArrayBuffer(blob);
  reader.onload = (event: any) => {
    // 读取ArrayBuffer数据变成Uint8Array
    const data = new Uint8Array(event.target.result);
    // 这里的data里面的类型和后面的type类型要对应
    const workbook = xlsx.read(data, { type: "array" });
    // 工作表名称
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    const html = xlsx.utils.sheet_to_html(worksheet);
    target.innerHTML = html;
  };
};
