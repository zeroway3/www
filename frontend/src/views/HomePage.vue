
<template>
  <div class="home-page">
    <div class="navigation-box">
      <div class="profile-container">
    <!-- 프로필 정보 -->
    <div class="profile">
      <label for="profile-input" class="profile-img-label">
            <img class="profile-img" :src="userInfo.image" alt="프로필 사진" />
          </label>
          <input
            id="profile-input"
            type="file"
            accept="image/*"
            @change="changeProfileImage"
            style="display: none;"
          />
      <div class="profile-details">
        <h2 class="profile-name">{{ userInfo.name }} 님</h2>
        <p class="profile-status">{{ userInfo.status }}</p>
      </div>
      <button class="shop-button" @click="goToShop">
      Go
      </button>
    </div>
  </div>

      <!-- 광고 슬라이드 -->
      <div
        class="ad-slider"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >


      
        <img :src="currentAd" alt="광고 이미지" class="ad-image" />
        <!-- 슬라이드 네비게이션 막대 -->
        <div class="pagination-bars">
          <span
            v-for="(ad, index) in adImages"
            :key="index"
            class="bar"
            :class="{ active: index === currentAdIndex }"
          ></span>
        </div>
      </div>

      <!-- 기상청 단기예보 -->
      <div class="weather-box">
        <div class="weather-info">
          <div class="today-weather">
            <p>{{ weather?.today || "정보 없음" }}</p>
          </div>
          <div class="rain-forecast">
            <p>{{ weather?.rain || "3일 이내의 비/눈 예보가 없습니다." }}</p>
          </div>
          <div class="weather-alert">
            <button class="alert-button" @click="toggleAlert">
              <font-awesome-icon
                :icon="alertEnabled ? 'bell' : 'bell-slash'"
                :class="{ enabled: alertEnabled, disabled: !alertEnabled }"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- 네이버 지도 -->
      <NaverMap
        :mapOptions="mapOptions"
        class="rounded-map"
        style="width: 100%; height: 400px"
      >
        <template v-slot:default>
          <NaverMarker
            v-for="data in datas"
            :key="data.id"
            :latitude="data.lat"
            :longitude="data.lng"
            @click="() => showPopup(data)"
          >
            <div class="marker">
              <div class="marker-icon">
                <img :src="data.imageUrl" alt="커스텀 마커" />
              </div>
              <div class="marker-arrow"></div>
            </div>
          </NaverMarker>
        </template>
      </NaverMap>

      <!-- 정보 팝업 -->
      <div v-if="popupData" class="popup">
        <div class="popup-content">
          <button class="close-button" @click="popupData = null">X</button>
          <h3>제품 정보</h3>
          <p>위치: {{ popupData.name }}</p>
          <p>위도: {{ popupData.lat }}</p>
          <p>경도: {{ popupData.lng }}</p>
          <img
            :src="popupData.imageUrl"
            alt="마커 이미지"
            class="popup-image"
          />
          <div class="action-buttons">
            <button
              class="action-button"
              @click="showReportOptions('기능 고장 신고')"
            >
              고장 신고
            </button>
            <button
              class="action-button"
              @click="showReportOptions('청소 요청')"
            >
              청소 요청
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NaverMap, NaverMarker } from "vue3-naver-maps";
import Swal from "sweetalert2";
import { mapActions } from "vuex";
import axios from "axios";
import weatherAxios from "@/axiosWeather";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowRight);

export default {
  components: {
    NaverMap,
    NaverMarker,
    FontAwesomeIcon,
  },
  data() {
    return {
      selectedLocation: "hnu",
      mapOptions: {
        center: { lat: 36.3539, lng: 127.4214 },
        zoom: 16,
      },
      locations: {
        hnu: { lat: 36.3539, lng: 127.4214 },
        makerspace: { lat: 36.3546, lng: 127.4233 },
        daejeon: { lat: 36.3504, lng: 127.3845 },
      },
      datas: [
        {
          id: 1,
          name: "한남대학교 종합운동장",
          lat: 36.3543,
          lng: 127.419,
          imageUrl: require("@/assets/wwwlogo.jpeg"),
        },
        {
          id: 2,
          name: "한남대학교 메이커스스페이스",
          lat: 36.3541,
          lng: 127.4253,
          imageUrl: require("@/assets/wwwlogo.jpeg"),
        },
        {
          id: 3,
          name: "대전시청",
          lat: 36.3504,
          lng: 127.3845,
          imageUrl: require("@/assets/wwwlogo.jpeg"),
        },
      ],
      adImages: [
        require("@/assets/adf3.jpeg"),
        require("@/assets/adf4.jpeg"),
        require("@/assets/adf1.jpeg"),
      ],
      currentAdIndex: 0,
      popupData: null,
      weather: null,
      alertEnabled: false,
      isDragging: false,
      touchStartX: null,
      touchEndX: null,
      fileAttached: false,
      userInfo: {
        image: require("@/assets/prof.jpeg"),
        name: "영식 님",
        status: "적림금 사용하러 가보기",
      },
    };
  },
  computed: {
    currentAd() {
      return this.adImages[this.currentAdIndex];
    },
  },
  methods: {
    ...mapActions(["addReport"]),
    async fetchWeather() {
      const serviceKey = "XEa7BTZ7ZMxqQCg482IIMtEZa6VrcnMM6GTmK26ZO8nThpY1v5Og70vIkgH4Ce%2B0AjZwa39omHBbOxj5I0jJLQ%3D%3D";

      const baseDate = this.getCurrentDate();
      const baseTime = "0500";
      const nx = 68;
      const ny = 100;

      const url = `/api/weather/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

      
      
      try {
        const response = await weatherAxios.get(url); // 기본 axios 사용
        const items = response.data.response?.body?.items?.item || [];
        const skyData = items.find((item) => item.category === "SKY");
        const skyMap = { 1: "맑음 🌤️", 3: "구름 많음 ⛅", 4: "흐림 ☁️" };
        const todayWeather = skyMap[skyData?.fcstValue] || "맑음 🌤️";

        let rainForecast = null;
        for (let day = 0; day < 3; day++) {
          const targetDate = this.getFutureDate(day);
          const rainData = items.filter(
            (item) =>
              item.category === "PTY" &&
              Number(item.fcstValue) > 0 &&
              item.fcstDate === targetDate
          );

          if (rainData.length > 0) {
            rainForecast = `${
              day === 0 ? "오늘" : `${day}일 뒤`
            } 비/눈 예보가 있습니다.`;
            break;
          }
        }

        console.log("기상청 API 응답 데이터:", response.data);
        this.weather = {
          today: todayWeather,
          rain: rainForecast || "3일 이내의 비/눈 예보가 없습니다.",
        };
      } catch (error) {
        console.error("API 요청 실패: ", error);
        this.weather = {
          today: "구름 많음 ⛅",
        };
        console.error("API 요청 실패:", error.response ? error.response.data : error.message);
      }
    },
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

        // 가져온 사용자 정보 반영
        this.userInfo.name = response.data.name || "사용자";
        const savedImage = localStorage.getItem("profileImage"); // LocalStorage에서 저장된 이미지 가져오기
        this.userInfo.image = savedImage || response.data.profileImage || this.userInfo.image;
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
        alert("사용자 정보를 불러오는 중 문제가 발생했습니다.");
      }
    },
    getCurrentDate() {
      const today = new Date();
      return `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
        today.getDate()
      ).padStart(2, "0")}`;
    },
    getFutureDate(days) {
      const today = new Date();
      today.setDate(today.getDate() + days);
      return `${today.getFullYear()}${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(today.getDate()).padStart(2, "0")}`;
    },
    toggleAlert() {
      this.alertEnabled = !this.alertEnabled;
      alert(this.alertEnabled ? "알림을 받습니다." : "알림을 받지 않습니다.");
    },
    showPopup(data) {
      if (data) {
        this.popupData = data;
      }
    },
    showReportOptions(type) {
      Swal.fire({
        title: '사진을 촬영하거나 업로드하세요',
        html: `
          <button id="cameraButton" class="swal2-confirm swal2-styled" style="margin: 10px;">카메라 촬영</button>
          <input type="file" id="fileInput" accept="image/*" capture="environment" style="display: block; margin-top: 10px;">
        `,
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        didOpen: () => {
          const cameraButton = Swal.getPopup().querySelector('#cameraButton');
          const fileInput = Swal.getPopup().querySelector('#fileInput');

          cameraButton.addEventListener('click', () => {
            fileInput.click(); // 카메라 촬영을 위해 input 클릭
          });

          fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            this.fileAttached = !!file;
            if (file) {
              alert(`파일 첨부됨: ${file.name}`);
            }
          });
        }
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.fileAttached) {
            this.addReport({ type });
            Swal.fire('신고 완료', `${type}이(가) 승인되면 리워드가 적립됩니다.`, 'success');
            this.popupData = false;
          } else {
            Swal.fire('사진 첨부 필요', '제품을 촬영해주세요!', 'warning');
          }
          this.fileAttached = false; // 상태 초기화
        }
      });
    },
    nextSlide() {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.adImages.length;
    },
    previousSlide() {
      this.currentAdIndex =
        (this.currentAdIndex - 1 + this.adImages.length) % this.adImages.length;
    },
    onTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },
    onTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;
    },
    onTouchEnd() {
      const swipeDistance = this.touchEndX - this.touchStartX;
      if (swipeDistance > 50) {
        this.previousSlide();
      } else if (swipeDistance < -50) {
        this.nextSlide();
      }
    },
    onDragStart(event) {
      this.isDragging = true;
      this.touchStartX = event.clientX;
    },
    onDragMove(event) {
      if (this.isDragging) {
        this.touchEndX = event.clientX;
      }
    },
    onDragEnd() {
      if (this.isDragging) {
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (swipeDistance > 50) {
          this.previousSlide();
        } else if (swipeDistance < -50) {
          this.nextSlide();
        }
        this.isDragging = false;
      }
    },
    goToShop() {
      this.$router.push("/shoppage");
    },
    changeProfileImage(event) {
      const file = event.target.files[0]; // 파일 입력값 가져오기
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userInfo.image = e.target.result; // 이미지 미리보기
          localStorage.setItem("profileImage", e.target.result); // LocalStorage에 저장
        };
        reader.readAsDataURL(file); // 파일을 Data URL로 읽기
      }
    },
  },
  mounted() {
    this.fetchWeather();
    this.fetchUserInfo();
  },
};
</script>


<style scoped>
.weather-box {
  width: 92%;
  max-width: 500px;
  height: 15px;
  margin: 20px 0;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-info {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.today-weather h3,
.rain-forecast h3 {
  font-size: 14px;
  color: #132f64;
  margin: 0;
}

.today-weather p,
.rain-forecast p {
  font-size: 12px;
  color: #777777;
}

.alert-button {
  padding: 4px 8px;
  background-color: #132f64;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.alert-button:hover {
  background-color: #004a75;
}
/* 광고 슬라이드 스타일 */
.ad-slider {
  width: 100%;
  max-width: 500px;
  height: 150px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .ad-slider {
    height: 120px;
  }
}

/* 슬라이드 네비게이션 막대 */
.pagination-bars {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.bar {
  width: 20px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: background-color 0.3s;
  border-radius: 2px;
}
/* 나머지 배경색 스타일 */
.home-page {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.bar.active {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 지도 모서리를 둥글게 만드는 스타일 */
.rounded-map {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.marker {
  position: relative;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  border: 2px solid #132f64;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  padding: 5px;
}

.marker-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}

.marker-icon img {
  width: 90%;
  height: 90%;
  object-fit: cover;
}

.marker-arrow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #132f64;
}

.popup {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  width: 250px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-image {
  width: 80px;
  height: 80px;
  margin: 10px 0;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #132f64;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  color: #132f64;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.action-button {
  padding: 5px 10px;
  background-color: #ffffff;
  color: #132f64;
  border: 2px solid #132f64;
  border-radius: 8px;
  cursor: pointer;
}

.report-text {
  width: 100%;
  text-align: left;
}

.text-with-icon {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.report-text h2 {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.report-text p {
  font-size: 12px;
  color: #777777;
  text-align: left;
  margin-top: 8px;
}

.reward-icon {
  width: 50px;
  height: 50px;
  margin-left: 8px;
}

.rounded-box {
  width: 100%;
  border-radius: 10px;
  padding: 15px;
  background-color: #f0f2f5;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-select {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #132f64;
  justify-content: center;
  width: 100%;
}

.location-select label {
  font-weight: bold;
}

.select-wrapper {
  position: relative;
  width: 200px;
}

.select-wrapper select {
  appearance: none;
  width: 100%;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #0065a1;
  background-color: #ffffff;
  color: #132f64;
  cursor: pointer;
  transition: background-color 0.3s;
}

.profile-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 15px;
  max-width: 400px;
  margin: auto;
}

.profile {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.profile-img-label {
  cursor: pointer;
}

.profile-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid #f0f0f0;
}

.profile-details {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.profile-status {
  font-size: 14px;
  color: #777;
  margin: 5px 0 0;
}

.shop-button {
  padding: 4px 8px;
  background-color: #132f64;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 30px; /* 이름/상태와 버튼 사이 간격 조정 */
}

.shop-button:hover {
  background-color: #004a75;
}
</style>

