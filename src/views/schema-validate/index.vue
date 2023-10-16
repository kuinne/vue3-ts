<template>
  <button @click="validate">测试</button>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { string, email, endsWith, parse } from "valibot";

const EmailSchema = string([email(), endsWith("@example.com")]);

const validate = () => {
  try {
    const email = parse(EmailSchema, "jane@mssss.com");
  } catch (error) {
    console.log(error);
  }
};
</script>
<style scoped lang="scss"></style>
