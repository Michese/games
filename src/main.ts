import { createApp } from 'vue';
import './style/style.scss';
import './svg.d';
import App from './App.vue';
import UUID from 'vue-uuid';

createApp(App).use(UUID).mount('#app');
