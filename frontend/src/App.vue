<template>
  <div class="app">
    <!-- 로그인 화면 -->
    <div
      v-if="isLoading"
      class="login-screen"
      :class="{ fadeOut: isFadingOut }"
    >
      <img src="@/assets/www_logor.png" alt="로고" class="loading-logo" />
    </div>

    <!-- 메인 콘텐츠 (로그인 완료 후 표시) -->
    <div v-else>
      <!-- 상단 네비게이션 바 -->
      <header class="top-nav">
        <img src="@/assets/wwwlogo.jpeg" alt="팀 로고" class="logo-image" />
        <div class="menu-icon" @click="toggleMenu">☰</div>
      </header>

      <!-- 사이드 메뉴 -->
      <div v-if="isMenuOpen" class="side-menu-overlay" @click="toggleMenu">
        <div class="side-menu" @click.stop>
          <div class="side-menu-content">
            <div class="profile-section">
              <p class="username">김영식 님</p>
              <button class="logout-button">로그아웃</button>
            </div>
            <div class="menu-category">
              <h3>😊 MY</h3>
              <ul>
                <li>내정보</li>
                <li>내카드</li>
                <li>적립내역</li>
                <li>지급내역</li>
                <li>회원탈퇴</li>
              </ul>
            </div>
            <div class="menu-category">
              <h3>사업소개</h3>
              <ul>
                <li>이용안내</li>
                <li>공지사항</li>
                <li>문의하기</li>
                <li>이용약관</li>
                <li>설정</li>
              </ul>
            </div>
            <button class="close-button" @click="toggleMenu">✖</button>
          </div>
        </div>
      </div>

      <!-- 중앙 컨텐츠 영역 -->
      <div class="main-content">
        <router-view />
      </div>

      <!-- 하단 네비게이션 바 -->
      <nav class="bottom-nav">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <FontAwesomeIcon icon="home" />
          <span>홈</span>
        </router-link>
        <router-link to="/product" class="nav-item" :class="{ active: $route.path === '/product' }">
          <FontAwesomeIcon icon="box-open" />
          <span>제품 소개</span>
        </router-link>
        <router-link to="/benefits" class="nav-item" :class="{ active: $route.path === '/benefits' }">
          <FontAwesomeIcon icon="gift" />
          <span>혜택</span>
        </router-link>
        <router-link to="/my" class="nav-item" :class="{ active: $route.path === '/my' }">
          <FontAwesomeIcon icon="user" />
          <span>MY</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faBoxOpen, faGift, faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faBoxOpen, faGift, faUser);

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      isLoading: true, // 로딩 상태
      isFadingOut: false, // 페이드아웃 애니메이션 상태
      isMenuOpen: false,
    };
  },
  mounted() {
    // 1.5초 후 페이드아웃 실행 후 메인 화면으로 전환
    setTimeout(() => {
      this.isFadingOut = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 600); // 페이드아웃 애니메이션 지속 시간
    }, 1500);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
/* 로그인 화면 스타일 */
.login-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #132f64;
  color: #ffffff;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: 2px solid #132f64;
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.login-screen.fadeOut {
  opacity: 0;
  transform: scale(1.1);
}

.loading-logo {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}

/* 메인 앱 스타일 */
.app {
  max-width: 430px;
  margin: 0 auto;
  overflow: hidden;
}

.top-nav {
  width: 93%;
  max-width: 430px;
  height: 60px;
  background-color: #ffffff;
  color: #132f64;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-bottom: 2px solid #e0e0e0;
}

.logo-image {
  width: 50px;
  height: 50px;
}

.menu-icon {
  font-size: 48px;
  cursor: pointer;
}

.side-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.side-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #ffffff;
  color: #000000;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 2001;
  overflow-y: auto;
}

.side-menu-content {
  padding: 20px;
}

.profile-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.username {
  font-weight: bold;
  font-size: 16px;
}

.logout-button {
  background-color: #132f64;
  color: #ffffff;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.menu-category h3 {
  font-size: 14px;
  margin-top: 20px;
}

.menu-category ul {
  list-style: none;
  padding: 0;
}

.menu-category li {
  padding: 10px 0;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: #132f64;
}

.main-content {
  padding-top: 80px;
  padding-bottom: 80px;
  max-width: 430px;
  margin: 0 auto;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 430px;
  background-color: #132f64;
  padding: 15px 0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
  left: 50%;
  transform: translateX(-50%);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.nav-item {
  text-decoration: none;
  color: gray;
  font-size: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-item.active {
  color: white;
}

.nav-item span {
  font-size: 10px;
  margin-top: 5px;
}

.nav-item svg {
  font-size: 18px;
  margin-bottom: 3px;
}
</style>
