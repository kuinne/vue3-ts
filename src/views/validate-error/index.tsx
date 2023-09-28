import { defineComponent, provide, ref, toRaw, watch } from 'vue'
import Com1 from './Com1'
import Com2 from './Com2'
import { ElButton, ElMessage, ElOption, ElSelect } from 'element-plus'
import Com3 from './Com3'

const useValidate = () => {
  const refs = ref<Map<string, any>>(new Map())
  const setRef = (ref: any, key: string) => {
    if (ref) {
      refs.value.set(key, ref)
    } else {
      refs.value.delete(key)
    }
  }

  watch(
    refs,
    () => {
      console.log('refs', refs.value)
    },
    {
      deep: true,
    }
  )

  const validate = () => {
    let flag = true
    for (let [key, value] of refs.value) {
      if (value.validate) {
        flag = value.validate() && flag
      }
    }
    return flag
  }
  return {
    setRef,
    validate,
  }
}

export default defineComponent({
  setup() {
    const data = ref<any[]>([
      {
        type: 1,
        value1: 1,
        value2: 2,
        arr: [
          {
            value1: 1,
          },
        ],
      },
    ])

    const handleAdd = () => {
      data.value.push({
        type: 1,
        value1: 1,
        value2: 2,
        arr: [1],
      })
    }
    const validates = ref([])
    provide('validates', validates)

    const validate = () => {
      console.log('validates', validates.value)

      let flag = true
      for (let item of validates.value) {
        flag = item() && flag
      }
      return flag
    }
    const { setRef } = useValidate()

    const handleSave = () => {
      if (validate()) {
        ElMessage.success('保存成功')
      }
    }

    return () => (
      <div>
        {data.value.map((item, index) => (
          <div style="display: flex;">
            {`row: ${index}`}
            <ElSelect v-model={item.type}>
              <ElOption value={1}>1</ElOption>
              <ElOption value={2}>2</ElOption>
            </ElSelect>
            {item.type == 1 ? (
              <Com1
                value={item.value1}
                ref={(ref) => {
                  setRef(ref, `[${index}].value1`)
                }}
              />
            ) : (
              <Com2
                value={item.value2}
                ref={(ref) => {
                  setRef(ref, `[${index}].value2`)
                }}
              />
            )}

            {/* <Com3
              v-model={item.arr}
              onAdd={() => {
                item.arr.push({
                  value1: 1,
                })
              }}
              onDelete={(subIndex) => {
                delete item.arr[subIndex]
              }}
            >
              {{
                default: ({ subItem, subIndex }) => (
                  <Com1
                    value={subItem.value1}
                    ref={(ref) => {
                      setRef(ref, `[${index}].arr[${subIndex}].value1`)
                    }}
                  />
                ),
              }}
            </Com3> */}
          </div>
        ))}
        <ElButton onClick={handleAdd}>ADD</ElButton>
        <ElButton onClick={handleSave}>SAVE</ElButton>
      </div>
    )
  },
})
