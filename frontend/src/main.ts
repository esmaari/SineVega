import './style.css'; // varsa global stiller
import './assets/scss/main.scss'; // burada Bootstrap SCSS geliyor
import 'bootstrap-icons/font/bootstrap-icons.css';


import { createApp } from 'vue';
import { createPinia } from 'pinia'

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia()
app.use(router);
app.use(pinia);
app.mount('#app');

