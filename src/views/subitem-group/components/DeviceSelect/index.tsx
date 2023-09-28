import { PropType, defineComponent } from 'vue'
type Device = { deviceName: string; deviceId: string }
export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<Device>,
      required: true,
    },
    ['onUpdate:modelValue']: Function as PropType<(val: Device) => void>,
  },
  setup() {
    return () => <div></div>
  },
})
