<template>
  <Container>
    <FlexBox height="600px" class="flex-box">
      <template #header>
        <Toggle
          v-model="alignItems"
          label="align-item: stretch/flex-start"
          :values="['stretch', 'flex-start']"
        ></Toggle>
      </template>
      <div class="cards">
        <Card
          title="Bandwidth responsive web design."
          desc="Twitter stock equity vesting period learning curve launch party pitch innovator series A financing churn rate handshake."
        />
        <Card title="hello" />
        <Card title="hello" />
      </div>
    </FlexBox>
  </Container>
</template>

<script setup lang="tsx">
import { defineComponent, useCssModule, ref } from "vue";
const styles = useCssModule();
const Card = ({ title, desc }: any) => {
  return (
    <div class={styles["card"]}>
      <figure class={styles["figure"]}>
        <img
          class={styles["img"]}
          src="https://loremflickr.com/640/480?random=1"
          alt="缩略图"
        />
      </figure>
      <h3 class={styles["title"]}>{title}</h3>
      <p class={styles["desc"]} contenteditable>
        {desc}
      </p>
      <button class={styles["button"]}>Button</button>
    </div>
  );
};

const alignItems = ref("stretch");
</script>
<style lang="scss" scoped>
:deep(.flex-box) {
  align-items: center;
  justify-content: center;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: v-bind(alignItems);
}
</style>

<style lang="scss" module>
.card {
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  /* flex: 1 1 200px; */
  width: 200px;

  .figure {
    margin: 0;
    background-color: #b1dfdb;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    overflow: hidden;
    .img {
      max-width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      object-position: center;
      border-radius: 4px 4px 0 0;
      mix-blend-mode: multiply;
      transform-origin: center;
      transform: scale3d(1, 1, 1);
      transition: all 0.2s ease-in-out;
    }
  }
  .title {
    font-size: 1.25em;
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
  .desc {
    font-size: 12px;
    line-height: 1.625;
    color: #467570;
    font-weight: 300;
    margin-bottom: 1rem;
    flex-grow: 1;
    padding: 0 1rem;
  }
  .button {
    padding: 10px 18px 8px;
    min-height: 44px;
    font-size: 0.865em;
    letter-spacing: 0.1em;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: none;
    color: #fff;
    border-radius: 3px;
    background: #009888;
    transition: all 0.275s;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: none 0;
    margin: 1rem;
  }
}
</style>
