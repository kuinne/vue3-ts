import { defineComponent } from 'vue'
type Data = {
  id: string
  name: string
}

const Child = defineComponent({
  emits: {
    confirm: (data: Data) => undefined,
    close: () => undefined,
  },
  setup(pros, { emit }) {
    const handleClick = () => {
      emit('confirm', { id: 'sss', name: 'sss' })
    }
    return () => <div></div>
  },
})

export default defineComponent({
  setup() {
    const handleConfirm = (data: Data) => {
      console.log('data', data)
    }
    return () => <Child onConfirm={handleConfirm} />
  },
})
