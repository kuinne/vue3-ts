<template>
  <div>
    <NamedFnCom :msg="msg" @sendMsg="handleSendMsg" />
    <AnonymousFnCom :msg="msg" @sendMsg="handleSendMsg" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { NamedFnCom } from "./NamedFnCom";
import { AnonymousFnCom } from "./AnonymousFnCom";

const msg = ref("hello");

const handleSendMsg = (msg) => {
  alert(msg);
};
</script>
<style scoped lang="scss"></style>
