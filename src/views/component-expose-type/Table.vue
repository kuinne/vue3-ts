<template>
  <table>
    <thead>
      <tr>
        <th v-for="(item, index) in columns" :key="index">{{ item.title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in dataSource" :key="index">
        <td v-for="header in columns">
          <slot name="bodyCell" :record="item" :column="header">
            {{ item[header.dataIndex as keyof T] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts" generic="T extends object">
defineProps<{
  columns: { title: string; dataIndex: string; key: string }[];
  dataSource: T[];
}>();
</script>
