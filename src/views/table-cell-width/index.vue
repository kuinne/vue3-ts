<template>
  <h4>单元格数据多：</h4>
  <div class="app">
    <table>
      <thead>
        <tr>
          <th>表头1</th>
          <th>表头2</th>
          <th>表头3</th>
          <th>表头4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>第一</td>
          <td>
            这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容
          </td>
          <td>
            这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容这是内容内容
          </td>
          <td>这是内容内容这是内容内容这是内容内容</td>
        </tr>
        <tr>
          <td>第二</td>
          <td>这是内容内容这是内容内容</td>
          <td>这是内容内容这是内容内容</td>
          <td>这是内容内容这是内容内容</td>
        </tr>
      </tbody>
    </table>
  </div>
  <h4>单元格数据少：</h4>
  <div class="app">
    <table>
      <thead>
        <tr>
          <th>表头1</th>
          <th>表头2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>第一</td>
          <td>这是内容内容这是内容内容这是内容内容</td>
        </tr>
        <tr>
          <td>第二</td>
          <td>这是内容内容这是内容内容</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
</script>
<style scoped lang="scss">
.app {
  width: 375px;
  padding: 20px;
  background-color: #eee;
  overflow: auto;
}
table {
  width: max-content;
  min-width: 100%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-spacing: 0;
  border-radius: 4px;
}
table thead {
  background-color: #f8f8f8;
  white-space: nowrap;
}
table th,
table td {
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  padding: 10px;
}
table th:first-child,
table td:first-child {
  border-left: 0;
}
table tr:first-child th {
  border-top: 0;
}
table td {
  /* min-width: 100px; */
  max-width: 200px;
}
</style>
