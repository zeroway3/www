<template>
  <div class="main">
    <div class="overlay">
      <form class="register-form" @submit.prevent="handleRegister">
        <!-- 아이디(이메일) 입력 및 중복확인 -->
        <div class="input-group">
          <div class="email-check">
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="이메일 입력"
            />
            <button type="button" @click="checkEmail" class="check-button">
              중복확인
            </button>
          </div>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="input-group">
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호 입력"
          />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="input-group">
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="비밀번호 확인"
          />
        </div>

        <!-- 이름 입력 -->
        <div class="input-group">
          <input type="text" id="name" v-model="name" placeholder="이름 입력" />
        </div>

        <!-- 생년월일 입력 -->
        <div class="input-group">
          <input
            type="text"
            id="birthdate"
            v-model="birthdate"
            placeholder="예: 19900101"
            maxlength="8"
          />
        </div>

        <!-- 성별 체크 -->
        <div class="input-group">
          <div class="gender-check">
            <label>
              <input type="radio" value="male" v-model="gender" />
              남성
            </label>
            <label>
              <input type="radio" value="female" v-model="gender" />
              여성
            </label>
          </div>
        </div>

        <!-- 동의 약관 -->
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="termsAgreed" />
            동의 약관에 동의합니다.
          </label>
        </div>

        <!-- 회원가입 버튼 -->
        <button type="submit" class="register-button">회원가입 하기</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      birthdate: "",
      gender: "",
      termsAgreed: false,
    };
  },
  methods: {
    // 이메일 중복 확인
    async checkEmail() {
      if (!this.email) {
        alert("이메일을 입력해주세요.");
        return;
      }
      try {
        const response = await axios.get("/api/users/check-email", {
          params: { email: this.email },
        });
        alert(response.data); // 성공 메시지
      } catch (error) {
        const errorMessage = error.response?.data || "중복 확인에 실패했습니다.";
        alert(errorMessage);
      }
    },
    // 회원가입 처리
    async handleRegister() {
      // 입력 검증
      if (!this.termsAgreed) {
        alert("동의 약관에 동의해주세요.");
        return;
      }
      if (this.password !== this.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (!this.email || !this.password || !this.name || !this.birthdate) {
        alert("모든 필드를 입력해주세요.");
        return;
      }
      try {
        // 회원가입 API 호출
        await axios.post("/api/users/register", {
          email: this.email,
          password: this.password,
          name: this.name,
          birthdate: this.birthdate,
          gender: this.gender,
        });
        alert("회원가입 성공!");
        this.$router.push("/loginpage"); // 로그인 페이지로 이동
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "회원가입 실패!";
        alert(errorMessage);
      }
    },
  },
};
</script>



<style scoped>
/* 배경 및 오버레이 */
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

.overlay {
  background-color: rgba(0, 0, 0, 0.2); /* 투명도 60% */
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
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 14px;
  margin-bottom: 5px;
}

.input-group input[type="text"],
.input-group input[type="email"],
.input-group input[type="password"] {
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0); /* 투명도 60% */
  border: 1px solid black;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 이메일 중복 확인 */
.email-check {
  display: flex;
  gap: 10px;
}

.check-button {
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  width: 100px;
  border: none;
  padding: 10px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
}

/* 성별 체크 스타일 */
.gender-check {
  display: flex;
  gap: 15px;
}

.gender-check label {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 회원가입 버튼 */
.register-button {
  background-color: navy;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.register-button:hover {
  background-color: darkblue;
}
</style>

