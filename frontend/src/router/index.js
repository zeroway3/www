import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProductPage from '../views/ProductPage.vue';
import BenefitsPage from '../views/BenefitsPage.vue';
import MyPage from '../views/MyPage.vue';

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/product', name: 'ProductPage', component: ProductPage },
  { path: '/benefits', name: 'BenefitsPage', component: BenefitsPage },
  { path: '/my', name: 'MyPage', component: MyPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
