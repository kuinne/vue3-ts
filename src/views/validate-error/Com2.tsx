import { ElInput } from 'element-plus'
import { beforeEach } from 'vitest'
import {
  Ref,
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    // error: {
    //   type: String,
    // },
  },
  setup(props, { expose }) {
    const value = ref(props.value)
    const error = ref('')
    const validate = () => {
      if (!value.value) {
        error.value = '必填'
        return false
      }
      return true
    }
    const validates = inject<Ref<any[]>>('validates')
    // onMounted(() => {
    //   validates?.value.push(validate)
    // })

    // onUnmounted(() => {
    //   if (validates?.value) {
    //     const index = validates.value.findIndex(validate)
    //     console.log('index', index)

    //     if (index > -1) {
    //       validates.value.splice(index, 1)
    //     }
    //   }
    // })

    expose({
      validate,
    })

    onUnmounted(() => {
      console.log('onUnmounted')
    })
    return () => (
      <span>
        Com2：
        <input
          v-model={value.value}
          onInput={() => {
            error.value = ''
          }}
        />
        {error.value ? <div>error: {error.value}</div> : null}
      </span>
    )
  },
})
