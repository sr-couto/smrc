import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/jetbrains-mono';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import router from './router'
import VueDOMPurifyHTML from 'vue-dompurify-html';
const app = createApp(App)
app.use(createPinia())

app.use(autoAnimatePlugin)
app.use(router)
app.use(VueDOMPurifyHTML);
app.mount('#app')
