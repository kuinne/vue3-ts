<template>
  <div class="form-demo">
    <div class="form-demo__header">
      <h2>表单布局控制</h2>
      <div class="form-demo__controls">
        <div class="control-group">
          <span>布局方式：</span>
          <el-radio-group v-model="layout">
            <el-radio-button label="horizontal">水平</el-radio-button>
            <el-radio-button label="vertical">垂直</el-radio-button>
            <el-radio-button label="grid">网格</el-radio-button>
            <el-radio-button label="inline">行内</el-radio-button>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>标签位置：</span>
          <el-radio-group v-model="currentLabelPosition">
            <el-radio label="inline">行内</el-radio>
            <el-radio label="top">顶部</el-radio>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>标签对齐：</span>
          <el-radio-group v-model="labelAlign">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>标签宽度：</span>
          <el-radio-group v-model="currentLabelWidth">
            <el-radio label="auto">自适应</el-radio>
            <el-radio label="100px">100px</el-radio>
            <el-radio label="150px">150px</el-radio>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>标签省略：</span>
          <el-radio-group v-model="labelEllipsis">
            <el-radio-button :label="true">启用</el-radio-button>
            <el-radio-button :label="false">禁用</el-radio-button>
          </el-radio-group>
        </div>

        <div v-if="layout === 'grid'" class="control-group">
          <span>网格列数：</span>
          <el-radio-group v-model="gridCols">
            <el-radio-button :label="2">2列</el-radio-button>
            <el-radio-button :label="3">3列</el-radio-button>
            <el-radio-button :label="4">4列</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <Form
      ref="formRef"
      :model="formData"
      :items="formItems"
      :layout="layout"
      :label-width="currentLabelWidth"
      :label-position="currentLabelPosition"
      :label-align="labelAlign"
      :grid-cols="gridCols"
      @update:model="handleUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Form from './Form.vue'
import type { FormItem, FormLayout, LabelPosition, LabelAlign } from './types'

const layout = ref<FormLayout>('horizontal')
const currentLabelPosition = ref<LabelPosition>('inline')
const labelAlign = ref<LabelAlign>('right')
const currentLabelWidth = ref<'auto' | '100px' | '150px'>('auto')
const labelEllipsis = ref(true)
const gridCols = ref(3)

interface FormData {
  username: string
  password: string
  longLabel: string
  email: string
  phone: string
  address: string
  description: string
  gender: string
  hobbies: string[]
  workExperience: string
  education: string
  skills: string
  agree: boolean
  wrapLabel: string
}

const formData = ref<FormData>({
  username: '',
  password: '',
  longLabel: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  gender: '',
  hobbies: [],
  workExperience: '',
  education: '',
  skills: '',
  agree: false,
  wrapLabel: ''
})

const formItems = computed<FormItem[]>(() => {
  const items: FormItem[] = [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      required: true,
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      gridColSpan: 2,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'password',
      label: '密码',
      type: 'input',
      placeholder: '请输入密码',
      required: true,
      rules: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      gridColSpan: 2,
      gridRowSpan: 2,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'longLabel',
      label: '这是一个非常非常非常非常非常非常非常非常非常非常长的标签文本',
      type: 'input',
      placeholder: '请输入内容',
      gridColSpan: 2,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      rules: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
      gridColSpan: 4,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      rules: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
      gridColSpan: 4,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'address',
      label: '地址',
      type: 'input',
      placeholder: '请输入地址',
      gridColSpan: 4,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'description',
      label: '个人简介',
      type: 'textarea',
      placeholder: '请输入个人简介',
      gridColSpan: 4,
      gridRowSpan: 2,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'gender',
      label: '性别',
      type: 'radio',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ],
      gridColSpan: 2,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'hobbies',
      label: '兴趣爱好',
      type: 'checkbox',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '音乐', value: 'music' },
        { label: '运动', value: 'sports' },
        { label: '旅行', value: 'travel' }
      ],
      gridColSpan: 4,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'workExperience',
      label: '工作经历',
      type: 'textarea',
      placeholder: '请输入工作经历',
      gridColSpan: 4,
      gridRowSpan: 3,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'education',
      label: '教育经历',
      type: 'textarea',
      placeholder: '请输入教育经历',
      gridColSpan: 4,
      gridRowSpan: 2,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'skills',
      label: '技能特长',
      type: 'textarea',
      placeholder: '请输入技能特长',
      gridColSpan: 4,
      gridRowSpan: 2,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'agree',
      label: '同意协议',
      type: 'switch',
      gridColSpan: 2,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    },
    {
      name: 'wrapLabel',
      label: '这是一个非常长的标签文本，用于测试换行效果',
      type: 'input',
      placeholder: '请输入内容',
      gridColSpan: 4,
      gridRowSpan: 1,
      labelEllipsis: labelEllipsis.value
    }
  ]

  return items
})

const handleUpdate = (value: FormData) => {
  formData.value = value
}
</script>

<style lang="scss" scoped>
.form-demo {
  padding: 20px;

  &__header {
    margin-bottom: 20px;

    h2 {
      margin-bottom: 16px;
    }
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      white-space: nowrap;
    }
  }
}
</style> 