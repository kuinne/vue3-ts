<template>
  <Container>
    <FlexBox height="45vh">
      <div class="wrapper box1">
        <div class="grid">
          <div class="row">
            <div class="column">
              <figure>
                <img src="https://loremflickr.com/800/600?random=1" alt="" />
              </figure>
            </div>
            <div class="column">
              <figure>
                <img src="https://loremflickr.com/800/600?random=2" alt="" />
              </figure>
              <figure>
                <img src="https://loremflickr.com/800/600?random=3" alt="" />
              </figure>
              <figure>
                <img src="https://loremflickr.com/800/600?random=4" alt="" />
              </figure>
              <figure>
                <img src="https://loremflickr.com/800/600?random=5" alt="" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </FlexBox>
    <FlexBox height="45vh">
      <template #header>
        <p>
          这个方案有一定的缺陷存在，必须知道 Flex 项目的数量及其容器上的宽高比
          。容器中的 Flex 项目一旦发生变化或容器中的 Flex
          项目宽高比发生变化，开发者就需要重新计算 Flex
          容器的宽高比，否则布局就不是按照相应的宽高比构建的。另外就是 Flex
          容器要是设置了 gap 值，对 Flex 项目的计算也有一定的影响。
        </p>
        <Toggle
          v-model="height"
          label="height: auto/100%"
          :values="['100%', 'auto']"
        ></Toggle>
      </template>
      <div class="wrapper box2">
        <div class="row">
          <div class="column" style="--ratio: 4 / 3">4:3</div>
          <div class="column" style="--ratio: 2 / 3">2:3</div>
        </div>
      </div>
    </FlexBox>
    <FlexBox height="45vh">
      <div class="wrapper box3">
        <div class="row container">
          <div class="column item" style="--ratio: 3 / 2">3 : 2</div>
          <div class="column item" style="--ratio: 16 / 9">16 : 9</div>
          <div class="column item" style="--ratio: 1 / 1">1 : 1</div>
        </div>
      </div>
    </FlexBox>
    <FlexBox height="45vh">
      <div class="wrapper box4">
        <div class="container">
          <div class="row">
            <div class="item" style="--ratio: 16 / 9">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=1" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 1 / 1">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=2" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 3 / 2">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=3" alt="" />
              </figure>
            </div>
          </div>

          <div class="row">
            <div class="item" style="--ratio: 1 / 1">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=4" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 1 / 1">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=5" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 1 / 1">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=6" alt="" />
              </figure>
            </div>
          </div>

          <div class="row">
            <div class="item" style="--ratio: 4 / 3">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=7" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 3 / 2">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=8" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 4 / 3">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=9" alt="" />
              </figure>
            </div>
          </div>

          <div class="row">
            <div class="item" style="--ratio: 16 / 9">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=10" alt="" />
              </figure>
            </div>
            <div class="item" style="--ratio: 16 / 9">
              <figure>
                <img src="https://loremflickr.com/1024/860?random=15" alt="" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </FlexBox>
  </Container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const height = ref("auto");
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
}
img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
}
figure {
  margin: 0;
  padding: 0;
  border: 1px solid rgb(197 37 94 / 76%);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 1px 1px rgb(0 0 0 / 25%);
  background-color: #09f;
  background-image: linear-gradient(45deg, #5028eb, #1ae57b);
}
.box1 {
  background-color: #ec1561;
  color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 6px 12px 0 rgb(0 0 0 / 10%);
  .grid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .column {
      flex: 1 1 calc((100% - 1rem) / 2);
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      &:nth-child(2) {
        figure {
          flex: 1 1 calc((100% - 1rem) / 2);
          min-width: 0;
        }
      }
    }
  }
}
.box2 {
  .row {
    display: flex;
    align-items: flex-start;
    aspect-ratio: 6 / 3;
  }
  .column {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    text-shadow: 1px 1px 0 rgb(0 0 0 / 0.5);
    height: v-bind(height); // 这里很重要
    aspect-ratio: var(--ratio);
    flex: 1 1 0%;
    &:nth-child(1) {
      background-color: #8917bd;
    }
    &:nth-child(2) {
      background-color: #f46;
    }
  }
}
.box3 {
  .row {
    display: flex;
    gap: 5px;
  }
  .column {
    aspect-ratio: var(--ratio);
    flex-grow: calc(var(--ratio)); // 这里很重要
    flex-basis: 0%;
  }
  .container {
    border: 2px solid #09f;
    border-radius: 4px;
    box-shadow: 0 0 0 4px rgb(0 0 0 / 0.25);
    max-width: 50vw;
    padding: 0.5rem;
    margin: auto;
  }
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    text-shadow: 1px 1px 0 rgb(0 0 0 / 0.5);
  }

  .item:nth-child(1) {
    background-color: #8917bd;
  }
  .item:nth-child(2) {
    background-color: #f46;
  }

  .item:nth-child(3) {
    background-color: #a69;
  }
}
.box4 {
  .container {
    width: 100%;
    height: 100%;
    border: 2px solid #09f;
    border-radius: 4px;
    box-shadow: 0 0 0 4px rgb(0 0 0 / 0.25);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .row {
    display: flex;
    gap: 0.5rem;
  }
  .column {
    aspect-ratio: var(--ratio);
    flex-grow: calc(var(--ratio));
    flex-basis: 0%;
  }
  .item {
    font-size: 2rem;
    text-shadow: 1px 1px 0 rgb(0 0 0 / 0.5);
    display: flex;
  }
  figure {
    margin: 0;
    padding: 0;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgb(0 0 0 / 25%);
    background-color: #00c8ff42;
    background-image: linear-gradient(45deg, #2b177b4d, #cce51aba);
    display: flex;
    width: 100%;
  }

  figure img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 2px;
    mix-blend-mode: overlay;
  }
}
</style>
