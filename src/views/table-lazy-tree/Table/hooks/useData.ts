import { useVModel } from '@vueuse/core'
import { TableV2Props } from '../type'
import { watch } from 'vue'
import { flattenTreeToMap } from '../utils'

export function useData(props: TableV2Props, emit: any) {
  const data = useVModel(props, 'data', emit)
  let flattenTreeMap: Map<string, any> = new Map()
  let allKeys: string[] = []

  const initData = () => {
    flattenTreeMap = flattenTreeToMap(data.value)
    allKeys = Array.from(flattenTreeMap.keys())
  }

  watch(
    data,
    () => {
      console.time()
      initData()
      console.timeEnd()
    },
    {
      immediate: true,
    }
  )

  return {
    data,
    flattenTreeMap,
    allKeys,
    initData,
  }
}
