import { defineComponent, ref } from 'vue'
import Input2 from './Input2.vue'
import { ElDialog, ElInput, ElOption, ElSelect } from 'element-plus'
const Input1 = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
})

export default defineComponent({
  setup() {
    const keyword = ref('')
    const visible = ref([])
    return () => (
      <div>
        <Input1 v-model={keyword.value}></Input1>
        <Input2 v-model={keyword.value}></Input2>
        <ElInput v-model={keyword.value}></ElInput>
        <ElSelect v-model={visible.value}>
          <ElOption value={1}>ll</ElOption>
        </ElSelect>
        {/* <ElDialog v-model={visible.value}></ElDialog> */}
      </div>
    )
  },
})
