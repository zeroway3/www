<template>
  <div class="page">    
    <!-- 기본 정보 섹션 -->
    <div class="section">
      <h2>기본정보</h2>
      <div class="info-row">
        <span>이름</span>
        <span>김*식</span>
        <div class="actions">
          <button @click="editInfo">수정</button>
          <button @click="deleteInfo">삭제</button>
        </div>
      </div>
      <div class="info-row">
        <span>생년월일</span>
        <span>20**-0*-3*</span>
        <div class="actions">
          <button @click="editInfo">수정</button>
          <button @click="deleteInfo">삭제</button>
        </div>
      </div>
      <div class="info-row">
        <span>휴대폰 번호</span>
        <span>010-4***-6***</span>
        <div class="actions">
          <button @click="editInfo">수정</button>
          <button @click="deleteInfo">삭제</button>
        </div>
      </div>
    </div>

    <!-- 가입 정보 섹션 -->
    <div class="section">
      <h2>가입정보</h2>
      <div class="info-row">
        <span>아이디</span>
        <span>ys000025</span>
      </div>
      <div class="info-row">
        <span>비밀번호</span>
        <button @click="resetPassword">비밀번호 재설정</button>
      </div>
      <div class="info-row">
        <span>적립시작일</span>
        <span>2024-11-13 에 가입(전환)했어요.</span>
      </div>
    </div>

    <!-- SNS 연동 섹션 -->
    <div class="section">
      <h2>SNS 연동</h2>
      <div class="info-row">
        <span>네이버</span>
        <label class="switch">
          <input type="checkbox" v-model="naverConnected" />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="info-row">
        <span>카카오</span>
        <label class="switch">
          <input type="checkbox" v-model="kakaoConnected" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      naverConnected: false,
      kakaoConnected: false
    }
  },
  methods: {
    editInfo() {
      alert("정보 수정 기능");
    },
    deleteInfo() {
      alert("정보 삭제 기능");
    },
    resetPassword() {
      alert("비밀번호 재설정 기능");
    }
  }
}
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
  transition: .4s;
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
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #4CAF50;
}
input:checked + .slider:before {
  transform: translateX(14px);
}
</style>
