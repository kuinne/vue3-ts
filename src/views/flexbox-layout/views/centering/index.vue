<template>
  <Container>
    <FlexBox class="flex-box-1">
      <div class="item">(^_^)</div>
      <div class="item">(^_^)</div>
      <div class="item">(^_^)</div>
    </FlexBox>
    <FlexBox class="flex-box-2">
      <template #header>
        <Toggle
          v-model="flexWrap"
          label="flex-wrap: wrap"
          :values="['wrap', 'nowrap']"
        />
      </template>
      <div class="item">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam amet
        aliquid fuga eligendi earum? Accusamus voluptate labore a sunt
        necessitatibus eos corporis maxime, voluptas ducimus, iusto facilis
        voluptatibus inventore dolore.
      </div>
    </FlexBox>
    <FlexBox class="flex-box-3">
      <div class="item">Lorem ipsum dolor</div>
    </FlexBox>
    <FlexBox class="flex-box-4">
      <div class="item">Lorem ipsum dolor</div>
    </FlexBox>
  </Container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const flexWrap = ref("wrap");
</script>

<style lang="scss" scoped>
:deep(.flex-box-1) {
  align-items: center;
  justify-content: center;
}
:deep(.flex-box-2) {
  flex-wrap: v-bind(flexWrap);
  place-content: center;
}
:deep(.flex-box-3) {
  place-content: center;
  place-items: center;
}
:deep(.flex-box-4) {
  .item {
    margin: auto;
  }
}
</style>
