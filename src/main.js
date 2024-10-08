import { createApp } from "vue";
import { createPinia } from "pinia";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "./assets/main.css";
import "./assets/driver.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(createPinia());
app.use(autoAnimatePlugin);
app.use(router);

app.mount("#app");
