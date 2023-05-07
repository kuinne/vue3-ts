import { ref } from 'vue'

export const counter = ref(0)

export const add = () => {
  counter.value += 1
}

export const minus = () => {
  counter.value -= 1
}

export const list = ref<any[]>([])

export const getList = () => {
  setTimeout(() => {
    list.value = Array.from({ length: 30 })
      .fill(0)
      .map((item, index) => ({ id: index }))
  }, 1000)
}
