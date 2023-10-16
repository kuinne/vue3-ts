import { defineComponent } from "vue";
import MainLayout from "./MainLayout.vue";
import SubLayout from "./SubLayout.vue";
// const MainLayout = defineComponent({
//   setup(props, { slots }) {
//     return () => (
//       <div>
//         <h1>MainLayout</h1>
//         {slots?.default?.()}
//       </div>
//     );
//   },
// });

// const SubLayout = defineComponent({
//   setup(props, { slots }) {
//     return () => (
//       <div>
//         <h1>SubLayout</h1>
//         {slots?.default?.()}
//       </div>
//     );
//   },
// });

export default {
  MainLayout,
  SubLayout,
};
