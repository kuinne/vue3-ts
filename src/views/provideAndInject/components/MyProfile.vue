<template>
  <div class="flex flex-col">
    <h2 class="block m-auto text-2xl">My Profile</h2>
    <hr />
    <label class="py-1 flex">
      <span class="w-24">Username: </span>
      <input class="shadow p-1 bg-gray-100 w-64" v-model="username" />
    </label>
    <label class="py-1 flex">
      <span class="w-24">Email:</span>
      <input class="shadow p-1 bg-gray-100 w-64" type="email" v-model="email" />
    </label>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'

const { getUsername, getEmail, updateUsername, updateEmail } = useStore()

const username = computed({
  get() {
    return getUsername.value
  },
  set(val) {
    updateUsername(val)
  },
})
const email = computed({
  get() {
    return getEmail.value
  },
  set(val) {
    updateEmail(val)
  },
})
</script>
