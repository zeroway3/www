import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createNaverMap } from 'vue3-naver-maps';
import './registerServiceWorker'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import "normalize.css";

library.add(faBell, faBellSlash);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(store)
  .use(createNaverMap, {
    clientId: '9q7kq26g3r',
    category: 'ncp',
  })
  .mount('#app');

