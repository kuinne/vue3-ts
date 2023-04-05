<template>
  <Container>
    <FlexBox height="80vh">
      <body class="wrapper">
        <header>
          <h1>W3cplus</h1>
          <nav>
            <ul>
              <li>
                <a href="">home</a>
              </li>
              <li>
                <a href="">blog</a>
              </li>
              <li>
                <a href="">about</a>
              </li>
              <li>
                <a href="">contact</a>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <h2>现代 Web 布局技术</h2>
            <p>
              使用 CSS Flexbox 技术构建圣杯布局（Holy Grail
              Layout）。圣杯布局是一种经典的 Web
              布局技术!其主要特征，一个三列布局，且内容先行！
            </p>
          </article>
          <aside>
            <h3>左侧边栏</h3>
          </aside>
          <aside>
            <h3>右侧边栏</h3>
          </aside>
        </main>
        <footer>
          <ul>
            <li>
              <a href="">home</a>
            </li>
            <li>
              <a href="">blog</a>
            </li>
            <li>
              <a href="">about</a>
            </li>
            <li>
              <a href="">contact</a>
            </li>
          </ul>
        </footer>
      </body>
    </FlexBox>
  </Container>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #f90;
  display: flex;
  flex-direction: column;
  gap: 1px;
  header,
  footer,
  aside,
  article {
    background-color: #fff;
    color: #f90;
  }
  h1,
  h2,
  h3 {
    color: #f90;
  }

  header,
  footer {
    padding: 1vw 20px;
    font-size: 0.8rem;
  }

  aside,
  article {
    padding: 20px;
  }

  ul {
    list-style: none outside none;
  }

  h2 + p {
    margin-top: 1rem;
    line-height: 1.65;
    font-size: 0.8em;
  }

  header h1 {
    text-transform: uppercase;
    white-space: nowrap;
    margin: 0;
  }

  a {
    color: #f90;
    text-decoration: none;
  }

  ul {
    display: flex;
    gap: 18px;
    align-items: center;
  }

  ul a {
    display: block;
    padding: 0.35em 0.5em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  body {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  main {
    flex: 1 1 0%;
    min-height: 0;

    display: flex;
    gap: 1px;
  }

  aside:nth-of-type(1) {
    order: -1;
    min-width: 220px;
    max-width: 220px;
  }

  aside:nth-of-type(2) {
    min-width: 320px;
    max-width: 320px;
  }

  article {
    flex: 1 1 0%;
    min-width: 0;
  }

  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  footer {
    display: flex;
    justify-content: center;
  }
}
</style>
