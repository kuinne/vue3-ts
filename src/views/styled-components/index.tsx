import { defineComponent } from "vue";
import { styled } from "@vvibe/vue-styled-components";

export default defineComponent({
  setup() {
    return () => <Container></Container>;
  },
});

const Container = styled.div`
  background-color: #ccc;
  width: 100%;
  height: 100%;
`;
