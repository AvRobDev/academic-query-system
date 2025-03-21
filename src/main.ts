import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { useAuthStore } from '@/stores/auth.store';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);
app.use(Toast);

// Restaura el estado de autenticación al cargar la aplicación
const authStore = useAuthStore();
authStore.restoreAuthState();

app.mount('#app');
