import { cloneDeep, pick } from 'lodash'
import { Ref, computed, defineComponent, ref, watch } from 'vue'
import SubitemGroup from './components/SubitemGroup/index.vue'
import ProductSelect from './components/ProductSelect/index.vue'
import TestInput from './components/TestInput/index.vue'
import DeviceSelect from './components/DeviceSelect'
import { ElInput, ElOption, ElSelect } from 'element-plus'
type Product = {
  productId?: string
  productName?: string
}
export default defineComponent({
  setup() {
    const data = ref<any[]>([])
    const defaultSubitem = ref({
      product: {
        parameterId: undefined,
        parameterName: undefined,
        parameterValue: undefined,
      },
      device: {
        parameterId: undefined,
        parameterName: undefined,

        parameterValue2: undefined,
      },
    })
    const defaultItem = ref({
      type: 'product',
      productId: undefined,
      productName: undefined,
      deviceId: undefined,
      deviceName: undefined,
      args: [cloneDeep(defaultSubitem.value['product'])],
    })

    watch(
      data,
      () => {
        console.log('data', data.value)
      },
      {
        deep: true,
      }
    )

    function group<T = any>(value: any, keys: string[]): Ref<T> {
      return computed({
        get() {
          return pick(value, keys) as T
        },
        set(val) {
          Object.assign(value, val)
        },
      })
    }

    return () => (
      <SubitemGroup
        v-model={data.value}
        defaultItem={defaultItem.value}
        // @ts-ignore
        defaultSubitem={(item) => defaultSubitem.value[item.type]}
      >
        {{
          default: ({ item }: any) => (
            <>
              <ElSelect
                v-model={item.type}
                onChange={() => {
                  // @ts-ignore
                  item.args = [cloneDeep(defaultSubitem.value[item.type])]
                }}
              >
                <ElOption value="product" label="产品"></ElOption>
                <ElOption value="device" label="设备"></ElOption>
              </ElSelect>
              {item.type === 'product' ? (
                <ProductSelect
                  v-model={
                    group<Product>(item, ['productId', 'productName']).value
                  }
                />
              ) : null}
              {item.type === 'device' ? (
                <ElSelect v-model={item.deviceId}>
                  <ElOption value="1" label="设备1"></ElOption>
                  <ElOption value="2" label="设备2"></ElOption>
                </ElSelect>
              ) : null}
              <DeviceSelect
                v-model={group(item, ['deviceId', 'deviceName']).value}
              />
              <input v-model={item.deviceId} />
              <ElInput v-model={item.deviceId}></ElInput>
              <TestInput v-model={item.deviceId}></TestInput>
              <ElSelect v-model={item.deviceId}></ElSelect>
            </>
          ),
          subitem: ({ subitem, item }: any) => (
            <>
              <ElSelect v-model={subitem.parameterId}>
                <ElOption value="1" label="属性1"></ElOption>
                <ElOption value="2" label="属性2"></ElOption>
              </ElSelect>
              {item.type === 'product' ? (
                <ElInput
                  style="width:200px"
                  v-model={subitem.parameterValue}
                ></ElInput>
              ) : null}
              {item.type === 'device' ? (
                <ElInput
                  style="width:200px"
                  v-model={subitem.parameterValue2}
                ></ElInput>
              ) : null}
            </>
          ),
        }}
      </SubitemGroup>
    )
  },
})
