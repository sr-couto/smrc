import { createApp } from "vue";
import { createPinia } from "pinia";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "./assets/main.css";
import App from "./App.vue";
import router from "./router";
import VueDOMPurifyHTML from "vue-dompurify-html";

const app = createApp(App);
app.use(createPinia());
app.use(autoAnimatePlugin);
app.use(router);
app.use(VueDOMPurifyHTML);

app.mount("#app");
