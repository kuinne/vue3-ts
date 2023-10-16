<template>
  <div>
    <ul v-for="(item, index) in items">
      <li :key="item.id" @click="handleSelect(item)">
        <h3>{{ item.name }}</h3>
        <div>
          <slot name="item" :data="item" :index="index"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts" generic="T extends Item=">
import type { Item } from "./types";
import { toRefs } from "vue";

const props = defineProps<{
  items: T[];
  selected: T;
}>();

const emits = defineEmits<{
  ($event: "select", item: T): void;
}>();

const slot = defineSlots<{
  item(props: { data: T; index: number }): any;
}>();
const { items } = toRefs(props);

const handleSelect = (item: T) => {
  emits("select", item);
};
</script>
