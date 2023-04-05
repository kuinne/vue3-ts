<template>
  <RouterView />
</template>

<script setup lang="ts">
import app from "../../main";
import Toggle from "./components/Toggle.vue";
import Container from "./components/Container.vue";
import FlexBox from "./components/FlexBox.vue";
app.component("Toggle", Toggle);
app.component("Container", Container);
app.component("FlexBox", FlexBox);
console.log(app);
</script>

<style lang="scss">
@import "./common.scss";
</style>
