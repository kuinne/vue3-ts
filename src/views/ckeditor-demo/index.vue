<template>
  <ckeditor
    :editor="editor"
    v-model="editorData"
    :config="editorConfig"
  ></ckeditor>
  <pre>{{ editorData }}</pre>
</template>
<script setup lang="ts">
import { ref, createApp } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

const ckeditor = CKEditor.component;

const editor = ClassicEditor;

const editorData = ref(
  '<span style="color: red;"><strong>Content of the editor.</strong></span>'
);

const editorConfig = ref({});
</script>
<style scoped lang="scss"></style>
