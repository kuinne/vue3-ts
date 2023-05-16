import { Ref, computed, inject, provide, reactive, ref } from 'vue'

export const initStore = () => {
  // State
  const state = reactive({
    name: 'Bob Day',
    email: 'bob@qq.com',
  })

  // Getters
  const getUsername = computed(() => state.name)
  const getEmail = computed(() => state.email)

  // Actions

  const updateUsername = (name: string) => {
    state.name = name
  }
  const updateEmail = (email: string) => {
    state.email = email
  }

  provide('getUsername', getUsername)
  provide('getEmail', getEmail)
  provide('updateUsername', updateUsername)
  provide('updateEmail', updateEmail)
}

export const useStore = () => ({
  getUsername: inject<Ref<string>>('getUsername', ref('')),
  getEmail: inject<Ref<string>>('getEmail', ref('')),
  updateUsername: inject<(name: string) => void>(
    'updateUsername',
    (name: string) => {}
  ),
  updateEmail: inject<(email: string) => void>(
    'updateEmail',
    (name: string) => {}
  ),

  // Actions
})
