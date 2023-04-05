<template>
  <Container flexDirection="column">
    <FlexBox>
      <div class="wrapper box1">
        <div class="grid">
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
          <div class="column">1 of 12</div>
        </div>

        <div class="grid">
          <div class="column">1 of 6</div>
          <div class="column">1 of 6</div>
          <div class="column">1 of 6</div>
          <div class="column">1 of 6</div>
          <div class="column">1 of 6</div>
          <div class="column">1 of 6</div>
        </div>

        <div class="grid">
          <div class="column">1 of 4</div>
          <div class="column">1 of 4</div>
          <div class="column">1 of 4</div>
          <div class="column">1 of 4</div>
        </div>

        <div class="grid">
          <div class="column">1 of 3</div>
          <div class="column">1 of 3</div>
          <div class="column">1 of 3</div>
        </div>

        <div class="grid">
          <div class="column">1 of 2</div>
          <div class="column">1 of 2</div>
        </div>
      </div>
    </FlexBox>
    <FlexBox>
      <div class="wrapper box2">
        <div class="grid">
          <div class="row">
            <div class="column">Auto</div>
            <div class="column">Auto</div>
          </div>
          <div class="row">
            <div class="column">Auto</div>
            <div class="column">Auto</div>
            <div class="column">Auto</div>
          </div>
          <div class="row">
            <div class="column">Auto</div>
            <div class="column">Auto</div>
            <div class="column">Auto</div>
            <div class="column">Auto</div>
          </div>
        </div>
      </div>
    </FlexBox>
    <FlexBox>
      <div class="wrapper box3">
        <div class="grid">
          <div class="row">
            <div class="column fixed" style="--flex-basis: 50%">50%</div>
            <div class="column">Auto</div>
            <div class="column">Auto</div>
          </div>
          <div class="row">
            <div class="column fixed" style="--flex-basis: 33.33%">33.33%</div>
            <div class="column">Auto</div>
          </div>
          <div class="row">
            <div class="column fixed" style="--flex-basis: 25%">25%</div>
            <div class="column">Auto</div>
            <div class="column fixed" style="--flex-basis: 33.33%">33.33%</div>
          </div>
        </div>
      </div>
    </FlexBox>
  </Container>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 10px;
}
.box1 {
  .grid {
    display: flex;
    gap: 1rem;
  }
  .column {
    flex: 1 1 0%;
    min-width: 0;
  }
  .column {
    border-radius: 2px;
    background-color: #fff;
    color: #557;
    padding: 0.25em 0.5em;
    white-space: nowrap;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    min-height: 36px;
    text-shadow: 1px 1px 0 rgb(0 0 0 / 0.15);
    box-shadow: 0 0 0.12em 0.012em rgb(0 0 0 / 0.25);
  }
}

.box2 {
  .grid {
    width: 100%;
    height: 100%;
    background-color: #ffc200;
    color: #ffc200;
    border-radius: 6px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 6px 12px 0 rgb(0 0 0 / 10%);
    padding: 2rem;
  }

  .column {
    border-radius: 4px;
    background-color: #fff;
    font-weight: 500;
    font-size: 0.75em;
    min-height: 36px;
    padding: 0.2em 0.5em;
    justify-content: center;
    align-items: center;
    display: inline-flex;
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: flex;
    gap: 1rem;
  }

  .column {
    flex: 1 1 var(--flex-basis, 0%);
    min-width: 0;
  }
}

.box3 {
  .grid {
    width: 100%;
    height: 100%;
    background-color: #ffc200;
    color: #ffc200;
    border-radius: 6px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 6px 12px 0 rgb(0 0 0 / 10%);
    padding: 2rem;
  }

  .column {
    border-radius: 4px;
    background-color: #fff;
    font-weight: 500;
    font-size: 0.75em;
    min-height: 36px;
    padding: 0.2em 0.5em;
    justify-content: center;
    align-items: center;
    display: inline-flex;
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: flex;
    gap: 1rem;
  }

  .column {
    flex: 1 1 var(--flex-basis, 0%);
    min-width: 0;
  }
  .column.fixed {
    flex: 0 0 var(--flex-basis);
  }
}
</style>
