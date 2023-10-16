<template>
  <div>
    <Demo1 :items="items" :selected="selected" @select="handleSelect">
      <template #item="{ data, index }">
        序号：{{ index + 1 }} 名称：{{ data.name }}
      </template>
    </Demo1>
    <br />
    <Demo2 :items="items" :selected="selected" @select="handleSelect">
      <template #item="{ data, index }">
        <!-- 序号：{{ index + 1 }} 名称：{{ data.name }} -->
      </template>
    </Demo2>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Demo1 from "./components/Demo1.vue";
import Demo2 from "./components/Demo2";
import type { Item } from "./components/types";

const items = ref<Item[]>([
  {
    id: "0",
    name: "0name",
  },
  {
    id: "1",
    name: "name1",
  },
]);

const selected = ref<Item>(items[0]);

const handleSelect = (item: Item) => {
  selected.value = item;
};
</script>
