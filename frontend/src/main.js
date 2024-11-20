import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createNaverMap } from 'vue3-naver-maps';
import './registerServiceWorker'

createApp(App)
  .use(router)
  .use(store)
  .use(createNaverMap, {
    clientId: '9q7kq26g3r',
    category: 'ncp',
  })
  .mount('#app');
