
<template>
  <div class="page" v-if="userInfo.account.email">
    <!-- 기본 정보 섹션 -->
    <div class="section">
      <h2>기본 정보</h2>
      <div class="info-row" v-for="(value, key) in userInfo.basic" :key="key">
        <span>{{ key }}</span>
        <span>{{ value }}</span>
        <div class="actions">
          <button @click="editInfo(key)">수정</button>
          <button @click="deleteInfo(key)">삭제</button>
        </div>
      </div>
    </div>

    <!-- 가입 정보 섹션 -->
    <div class="section">
      <h2>가입 정보</h2>
      <div class="info-row">
        <span>이메일</span>
        <span>{{ userInfo.account.email }}</span>
      </div>
      <div class="info-row">
        <span>비밀번호</span>
        <button @click="resetPassword">비밀번호 재설정</button>
      </div>
      <div class="info-row">
        <span>가입일</span>
        <span>{{ userInfo.account.joinDate }}</span>
      </div>
    </div>
  </div>
  <div class="page" v-if="userInfo && userInfo.account && userInfo.account.email">
  <!-- 데이터 렌더링 -->
  </div>
  <div v-else>
    <p>사용자 정보를 불러오는 중입니다...</p>
  </div>
</template>



  
<script>
import axios from "@/axios";

export default {
  data() {
    return {
      userInfo: {
        basic: {
          이름: "",
          생년월일: "",
          "휴대폰 번호": "",
        },
        account: {
          email: "",
          joinDate: "",
        },
        sns: {
          naver: false,
          kakao: false,
        },
      },
      token: null, // JWT 토큰 저장
    };
  },
  methods: {
    async fetchUserInfo() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    const response = await axios.get("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API 응답 데이터:", response.data); // 응답 데이터 확인

    this.userInfo = {
      account: {
        email: response.data.email || "",
        joinDate: response.data.joinDate || "",
      },
      basic: {
        이름: response.data.name || "",
        생년월일: response.data.birthdate || "",
        "휴대폰 번호": response.data.phoneNumber || "",
      },
    };
    console.log("업데이트된 userInfo:", this.userInfo); // 업데이트 확인
  } catch (error) {
    console.error("사용자 정보 불러오기 실패:", error.response ? error.response.data : error.message);
    alert("사용자 정보를 불러오는 중 문제가 발생했습니다. 다시 로그인해주세요.");
    localStorage.removeItem("token");
    this.$router.push("/login");
  }
},


    // 사용자 정보 수정
    editInfo(key) {
      alert(`${key} 수정 기능`);
      // 필요에 따라 모달 또는 새로운 페이지를 열어 정보를 수정
    },

    // 사용자 정보 삭제
    deleteInfo(key) {
      if (confirm(`${key} 정보를 삭제하시겠습니까?`)) {
        // 정보 삭제 로직 추가
        alert(`${key} 정보가 삭제되었습니다.`);
      }
    },

    // 비밀번호 재설정
    resetPassword() {
      alert("비밀번호 재설정 기능을 구현하세요.");
      // 비밀번호 재설정을 위한 추가 로직 필요
    },

    // 로그아웃
    logout() {
      localStorage.removeItem("jwtToken"); // 토큰 삭제
      this.$router.push("/login"); // 로그인 페이지로 이동
    },
  },
  mounted() {
    this.fetchUserInfo(); // 페이지 로드 시 사용자 정보 가져오기
  },
};
</script>


  
  <style scoped>
  .page {
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  .section {
    margin-top: 20px;
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
  }
  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
  }
  .actions {
    display: flex;
    gap: 10px;
  }
  button {
    padding: 5px 10px;
    font-size: 0.9em;
    color: #333;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #e0e0e0;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #4caf50;
  }
  input:checked + .slider:before {
    transform: translateX(14px);
  }
  </style>
  
