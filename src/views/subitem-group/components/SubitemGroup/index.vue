<template>
  <div class="subitem-group">
    <div class="item" v-for="(item, index) in props.modelValue" :key="item._id">
      <slot :item="item" :index="index"></slot>
      <div>
        <div
          class="sub-item"
          v-for="(subitem, subindex) in item.args"
          :key="subitem._id"
        >
          <slot
            name="subitem"
            :subitem="subitem"
            :item="item"
            :index="index"
            :subindex="subindex"
          ></slot>
          <ElButton
            v-if="subindex === item.args.length - 1"
            @click="handleSubitemAdd(item)"
            >+</ElButton
          >
          <ElButton
            @click="() => handleItemDelete(item, index, subindex, subitem)"
            >-</ElButton
          >
        </div>
      </div>
    </div>
  </div>
  <ElButton @click="handleItemAdd">添加</ElButton>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { nanoid } from 'nanoid'
import { computed, ref, toRefs, watch } from 'vue'
import { omit, cloneDeep } from 'lodash'

const props = defineProps<{
  modelValue: any[]
  defaultItem: any
  defaultSubitem: (item: any) => any
}>()

const emits = defineEmits<{
  ($event: 'update:modelValue', value: any[]): void
}>()

// const data = computed(() =>
//   props.modelValue.map((i) => ({
//     ...i,
//     _id: nanoid(),
//     args: i.args.map((subI) => ({
//       ...subI,
//       _id: nanoid(),
//     })),
//   }))
// )
const data = ref<any[]>([])

watch(
  () => props.modelValue,
  () => {
    data.value = props.modelValue
  }
)

watch(
  data,
  () => {
    console.log('[SubitemGroup] data', data.value)
  },
  {
    deep: true,
  }
)

const withoutId = (data: any[]) => {
  return data
  // return data.map((i) =>
  //   omit(
  //     {
  //       ...i,
  //       args: i.args.map((si) => omit(si, ['_id'])),
  //     },
  //     ['_id']
  //   )
  // )
}

const addId = (item: any) => ({
  ...item,
  _id: nanoid(),
})

const handleItemAdd = () => {
  data.value.push(addId(cloneDeep(props.defaultItem)))
  emits('update:modelValue', withoutId(data.value))
}

const handleSubitemAdd = (item: any) => {
  item.args.push(addId(cloneDeep(props.defaultSubitem(item))))
  emits('update:modelValue', withoutId(data.value))
}
const handleItemDelete = (
  item: any,
  index: number,
  subindex: number,
  subitem: any
) => {
  const _index = item.args.findIndex((i) => i._id === subitem._id)
  item.args.splice(_index, 1)

  console.log('zzz', item.args)

  if (item.args.length === 0) {
    data.value.splice(index, 1)
  }
  emits('update:modelValue', withoutId(data.value))
}
</script>

<style lang="scss" scoped>
.subitem-group {
  .sub-item {
    display: flex;
  }
  .item {
    display: flex;
  }
}
.operation {
  display: flex;
  align-items: center;
}
</style>
