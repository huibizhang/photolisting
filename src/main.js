import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);

app.directive("focus", {
  updated(el, binding, vnode, prevVnode) {
    // console.log(el, binding);
    if (binding.value) el.focus();
  },
});

app.mount("#app");
