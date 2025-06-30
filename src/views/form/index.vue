<template>
  <div class="form-demo">
    <div class="form-demo__header">
      <h3>表单布局控制</h3>
      <div class="form-demo__controls">
        <div class="control-group">
          <span>布局方式：</span>
          <el-radio-group v-model="layout">
            <el-radio-button label="horizontal">水平</el-radio-button>
            <el-radio-button label="vertical">垂直</el-radio-button>
            <el-radio-button label="grid">网格</el-radio-button>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>标签位置：</span>
          <el-radio-group v-model="currentLabelPosition">
            <el-radio-button label="inline">行内</el-radio-button>
            <el-radio-button label="top">顶部</el-radio-button>
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
            <el-radio-button label="auto">自适应</el-radio-button>
            <el-radio-button label="100px">100px</el-radio-button>
            <el-radio-button label="150px">150px</el-radio-button>
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

        <div class="control-group">
          <span>行间距：</span>
          <el-radio-group v-model="rowGap">
            <el-radio-button label="10px">10px</el-radio-button>
            <el-radio-button label="20px">20px</el-radio-button>
            <el-radio-button label="30px">30px</el-radio-button>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>列间距：</span>
          <el-radio-group v-model="colGap">
            <el-radio-button label="10px">10px</el-radio-button>
            <el-radio-button label="20px">20px</el-radio-button>
            <el-radio-button label="30px">30px</el-radio-button>
          </el-radio-group>
        </div>

        <div class="control-group">
          <span>尺寸：</span>
          <el-radio-group v-model="size">
            <el-radio-button label="small">小</el-radio-button>
            <el-radio-button label="default">默认</el-radio-button>
            <el-radio-button label="large">大</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <div class="form-demo__content">
      <h2>表单组件示例</h2>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础组件" name="basic">
          <Form
            ref="basicFormRef"
            :model="formData"
            :layout="layout"
            :label-width="currentLabelWidth"
            :label-position="currentLabelPosition"
            :label-align="labelAlign"
            :label-ellipsis="labelEllipsis"
            :grid-cols="gridCols"
            :row-gap="rowGap"
            :col-gap="colGap"
            :size="size"
          >
            <!-- 输入框示例 -->
            <FormItem
              type="input"
              v-model="formData.input"
              name="input"
              label="输入框"
              placeholder="请输入"
              clearable
            />

            <!-- 选择器示例 -->
            <FormItem
              type="select"
              v-model="formData.select"
              name="select"
              label="选择器"
              :options="[
                { label: '选项1', value: 1 },
                { label: '选项2', value: 2 }
              ]"
              placeholder="请选择"
              clearable
              multiple
              filterable
              :grid-row-span="2"
            />

            <!-- 日期选择器示例 -->
            <FormItem
              type="date"
              v-model="formData.date"
              name="date"
              label="日期"
              placeholder="请选择日期"
              clearable
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              dateType="date"
            />

            <!-- 数字输入框示例 -->
            <FormItem
              type="number"
              v-model="formData.number"
              name="number"
              label="数字"
              placeholder="请输入数字"
              :min="0"
              :max="100"
              :step="1"
              :precision="2"
            />

            <!-- 开关示例 -->
            <FormItem
              type="switch"
              v-model="formData.switch"
              name="switch"
              label="开关"
              activeText="开"
              inactiveText="关"
            />

            <!-- 复选框示例 -->
            <FormItem
              type="checkbox"
              v-model="formData.checkbox"
              name="checkbox"
              label="复选框"
              :options="[
                { label: '选项1', value: 1 },
                { label: '选项2', value: 2 }
              ]"
            />

            <!-- 单选框示例 -->
            <FormItem
              type="radio"
              v-model="formData.radio"
              name="radio"
              label="单选框"
              :options="[
                { label: '选项1', value: 1 },
                { label: '选项2', value: 2 }
              ]"
            />
          </Form>
        </el-tab-pane>

        <el-tab-pane label="自定义组件" name="custom">
          <Form
            ref="customFormRef"
            :model="formData"
            :layout="layout"
            :label-width="currentLabelWidth"
            :label-position="currentLabelPosition"
            :label-align="labelAlign"
            :label-ellipsis="labelEllipsis"
            :grid-cols="gridCols"
            :row-gap="rowGap"
            :col-gap="colGap"
            :size="size"
          >
            <!-- 基础用法 -->
            <FormItem
              type="custom"
              v-model="formData.amount1"
              name="amount1"
              label="金额输入"
              :component="MoneyInput"
              :props="{
                placeholder: '请输入金额',
                clearable: true
              }"
            />

            <!-- 自定义前缀后缀 -->
            <FormItem
              type="custom"
              v-model="formData.amount2"
              name="amount2"
              label="自定义符号"
              :component="MoneyInput"
              :props="{
                placeholder: '请输入金额',
                clearable: true
              }"
            >
              <template #prefix>
                <span class="custom-prefix">$</span>
              </template>
              <template #suffix>
                <span class="custom-suffix">USD</span>
              </template>
            </FormItem>

            <!-- 自定义输入框前后缀 -->
            <FormItem
              type="custom"
              v-model="formData.amount3"
              name="amount3"
              label="输入框装饰"
              :component="MoneyInput"
              :props="{
                placeholder: '请输入金额',
                clearable: true
              }"
            >
              <template #inputPrefix>
                <el-icon><Search /></el-icon>
              </template>
              <template #inputSuffix>
                <el-icon><Calendar /></el-icon>
              </template>
            </FormItem>

            <!-- 带提示信息 -->
            <FormItem
              type="custom"
              v-model="formData.amount4"
              name="amount4"
              label="带提示信息"
              :component="MoneyInput"
              :props="{
                placeholder: '请输入金额',
                clearable: true
              }"
            >
              <template #tip>
                <div class="custom-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>请输入正确的金额格式</span>
                </div>
              </template>
            </FormItem>
          </Form>
        </el-tab-pane>

        <el-tab-pane label="表单校验" name="validation">
          <Form
            ref="validationFormRef"
            :model="formData"
            :layout="layout"
            :label-width="currentLabelWidth"
            :label-position="currentLabelPosition"
            :label-align="labelAlign"
            :label-ellipsis="labelEllipsis"
            :grid-cols="gridCols"
            :row-gap="rowGap"
            :col-gap="colGap"
            :size="size"
          >
            <!-- 必填校验 -->
            <FormItem
              type="input"
              v-model="formData.required"
              name="required"
              label="必填项"
              placeholder="请输入"
              :rules="[{ required: true, message: '请输入必填项' }]"
            />

            <!-- 正则校验 -->
            <FormItem
              type="input"
              v-model="formData.pattern"
              name="pattern"
              label="邮箱"
              placeholder="请输入邮箱"
              :rules="[
                { required: true, message: '请输入邮箱' },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '请输入正确的邮箱格式'
                }
              ]"
            />

            <!-- 数字范围校验 -->
            <FormItem
              type="number"
              v-model="formData.range"
              name="range"
              label="数字范围"
              placeholder="请输入数字"
              :rules="[
                { required: true, message: '请输入数字' },
                { min: 0, max: 100, message: '数字范围在0-100之间' }
              ]"
            />

            <!-- 自定义校验 -->
            <FormItem
              type="input"
              v-model="formData.custom"
              name="custom"
              label="自定义校验"
              placeholder="请输入"
              :rules="[
                { required: true, message: '请输入' },
                { validator: validateCustom, message: '自定义校验失败' }
              ]"
            />
          </Form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { Search, Calendar, InfoFilled } from '@element-plus/icons-vue'
  import Form from './Form.vue'
  import FormItem from './FormItem.vue'
  import MoneyInput from './components/MoneyInput.vue'
  import type { FormLayout, LabelPosition, LabelAlign, FormSize } from './types/form'

  const layout = ref<FormLayout>('horizontal')
  const currentLabelPosition = ref<LabelPosition>('inline')
  const labelAlign = ref<LabelAlign>('left')
  const currentLabelWidth = ref<'auto' | '100px' | '150px'>('auto')
  const labelEllipsis = ref(true)
  const gridCols = ref(3)
  const rowGap = ref('20px')
  const colGap = ref('20px')
  const size = ref<FormSize>('default')
  const activeTab = ref('basic')

  const formData = reactive({
    // 布局示例数据
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
    wrapLabel: '',

    // 基础组件示例数据
    input: '',
    select: [],
    date: '',
    number: 0,
    switch: false,
    checkbox: [],
    radio: '',

    // 自定义组件示例数据
    amount1: '',
    amount2: '',
    amount3: '',
    amount4: '',

    // 校验示例数据
    required: '',
    length: '',
    pattern: '',
    custom: '',
    combined: '',
    async: '',
    trigger: '',
    range: 0
  })

  const validateCustom = (value: string | number) => {
    const num = Number(value)
    return !isNaN(num) && num % 2 === 0
  }
</script>

<style lang="scss" scoped>
  .form-demo {
    margin: 0 auto;
    padding: 10px;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    gap: 10px;

    h2 {
      margin-bottom: 20px;
      text-align: center;
      position: sticky;
      top: 0;
      background: #fff;
      padding: 10px 0;
      z-index: 1;
    }

    &__header {
      width: 300px;
      flex-shrink: 0;
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      position: sticky;
      top: 60px;
      background: #fff;
      z-index: 1;
      height: fit-content;

      h3 {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
      }
    }

    &__content {
      flex: 1;
      min-width: 0;
    }

    &__controls {
      display: flex;
      flex-direction: column;
      gap: 15px;
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

  .custom-prefix,
  .custom-suffix {
    color: #409eff;
    font-weight: bold;
  }

  .custom-tip {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>
