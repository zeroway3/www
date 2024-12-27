

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import(/* webpackChunkName: "HomePage" */ '../views/HomePage.vue'),
  },
  {
    path: '/product',
    name: 'ProductPage',
    component: () => import(/* webpackChunkName: "ProductPage" */ '../views/ProductPage.vue'),
  },
  {
    path: '/benefits',
    name: 'BenefitsPage',
    component: () => import(/* webpackChunkName: "BenefitsPage" */ '../views/BenefitsPage.vue'),
  },
  {
    path: '/my',
    name: 'MyPage',
    component: () => import(/* webpackChunkName: "MyPage" */ '../views/MyPage.vue'),
  },
  {
    path: '/mainlogin',
    name: 'MainLogin',
    component: () => import(/* webpackChunkName: "MainLogin" */ '../views/MainLogin.vue'),
  },
  {
    path: '/Registerpage',
    name: 'Registerpage',
    component: () => import(/* webpackChunkName: "Registerpage" */ '../views/RegisterPage.vue'),
  },
  {
    path: '/loginpage',
    name: 'Loginpage',
    component: () => import(/* webpackChunkName: "Loginpage" */ '../views/LoginPage.vue'),
  },
  {
    path: '/shoppage',
    name: 'shoppage',
    component: () => import(/* webpackChunkName: "Loginpage" */ '../views/ShopPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드: 토큰이 없으면 mainlogin 페이지로 리다이렉트
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (!token && to.path !== "/mainlogin" && to.path !== "/registerpage") {
    // 토큰이 없고 접근하려는 페이지가 mainlogin이 아니면 리다이렉트
    next("/mainlogin");
  } else {
    next(); // 토큰이 있거나 mainlogin 페이지에 접근하는 경우
  }
});

export default router;

