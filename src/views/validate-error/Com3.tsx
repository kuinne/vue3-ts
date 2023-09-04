import { ElButton, ElIcon, ElInput } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue', 'delete', 'add'],
  setup(props, { emit, slots }) {
    return () => (
      <div style="display: flex; ">
        <div>
          {props.modelValue.map((i, index) => (
            <div>
              {slots.default?.({
                subItem: i,
                subIndex: index,
              })}
              {index === props.modelValue.length - 1 ? (
                <ElButton
                  onClick={() => {
                    emit('add')
                  }}
                >
                  ADD
                </ElButton>
              ) : null}
              <ElButton
                onClick={() => {
                  emit('delete', index)
                }}
              >
                DELETE
              </ElButton>
            </div>
          ))}
        </div>
      </div>
    )
  },
})
