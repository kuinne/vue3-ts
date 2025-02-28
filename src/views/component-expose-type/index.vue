<template>
  <Table ref="table" :dataSource="dataSource" :columns="columns">
    <template #bodyCell="{ record, column }">
      <span v-if="column.dataIndex === 'name'">{{ record.name }}</span>
      <span v-else-if="column.dataIndex === 'age'">{{ record.age }}</span>
      <span v-else-if="column.dataIndex === 'address'">{{
        record.address
      }}</span>
    </template>
  </Table>
</template>
<script setup lang="ts">
import Table from "./Table.vue";
import { ref } from "vue";

const tableRef = ref<InstanceType<typeof Table> | null>(null);

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const clear = () => {
  tableRef.value?.clear();
};
</script>
