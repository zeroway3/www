<template>
  <div class="main">
    <div class="overlay">
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 아이디(이메일) 입력 -->
        <div class="input-group">
          <input type="email" id="email" v-model="email" placeholder="이메일 입력" required />
        </div>
        <!-- 비밀번호 입력 -->
        <div class="input-group">
          <input type="password" id="password" v-model="password" placeholder="비밀번호 입력" required />
        </div>
        <!-- 로그인 버튼 -->
        <button type="submit" class="login-button">로그인 하기</button>
      </form>
      <!-- 회원가입 및 카카오톡 버튼 -->
      <div class="additional-buttons">
        <button @click="goToRegister" class="register-button">회원가입</button>
        <button class="kakao-button">🗨️카카오톡</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios"; // axios를 설정한 모듈 경로에 맞게 수정

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("/api/users/login", {
          email: this.email,
          password: this.password,
        });

        // 로그인 성공 시
        console.log("로그인 성공:", response.data);

        // JWT 토큰 처리 (필요 시 저장)
        const token = response.data.token; // 백엔드가 토큰을 반환한다고 가정
        localStorage.setItem("token", token);

        // 로그인 성공 후 페이지 이동
        this.$router.push("/loginpage"); // 적절한 라우팅 경로로 수정
      } catch (error) {
        console.error("로그인 실패:", error.response?.data || error.message);
        alert(error.response?.data || "로그인에 실패했습니다.");
      }
    },
    goToRegister() {
      this.$router.push("/registerpage"); // 회원가입 페이지로 이동
    },
  },
};
</script>

<style scoped>
/* 배경 이미지와 투명도 설정 */
.main {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/loginpage3.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 투명한 오버레이 효과 */
.overlay {
  background-color: rgba(0, 0, 0, 0.1); /* 투명도 60% */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

/* 폼 스타일 */
.login-form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: black;
}

.input-group label {
  font-size: 14px;
}

.input-group input {
  padding: 10px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0); /* 투명도 60% */
  border: 1px solid black;
  border-radius: 5px;
  outline: none;
}

/* 로그인 버튼 스타일 */
.login-button {
  background-color: navy;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-button:hover {
  transform: scale(1.00);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* 추가 버튼 스타일 */
.additional-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
}

.register-button {
  background-color: white; /* 투명도 60% */
  color: black;
  border: none;
  padding: 10px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.kakao-button {
  background-color: rgba(0, 0, 0, 0);
  color: black;
  border: 1px solid black;
  padding: 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
}


</style>

