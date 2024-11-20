<template>
  <div class="home-page">
    <div class="navigation-box">
      <!-- 광고 슬라이드 -->
      <div class="ad-slider"
           @mousedown="onDragStart"
           @mousemove="onDragMove"
           @mouseup="onDragEnd"
           @mouseleave="onDragEnd"
           @touchstart="onTouchStart"
           @touchmove="onTouchMove"
           @touchend="onTouchEnd">
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

      <!-- 네이버 지도 -->
      <NaverMap :mapOptions="mapOptions" class="rounded-map" style="width: 100%; height: 400px;">
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
          <img :src="popupData.imageUrl" alt="마커 이미지" class="popup-image" />
          <div class="action-buttons">
              <button class="action-button" @click="showReportOptions('기능 고장 신고')">제품 고장 신고</button>
              <button class="action-button" @click="showReportOptions('청소 요청')">청소 요청</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NaverMap, NaverMarker } from 'vue3-naver-maps';
import Swal from 'sweetalert2';
import { mapActions } from 'vuex';

export default {
  components: {
    NaverMap,
    NaverMarker,
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
        { id: 1, name: "한남대학교 종합운동장", lat: 36.3543, lng: 127.4190, imageUrl: require('@/assets/wwwlogo.jpeg') },
        { id: 2, name: "한남대학교 메이커스스페이스", lat: 36.3541, lng: 127.4253, imageUrl: require('@/assets/wwwlogo.jpeg') },
        { id: 3, name: "대전시청", lat: 36.3504, lng: 127.3845, imageUrl: require('@/assets/wwwlogo.jpeg') },
      ],
      popupData: null,
      adImages: [require('@/assets/adf1.jpeg'), require('@/assets/adf4.jpeg'),require('@/assets/adf3.jpeg')],
      currentAdIndex: 0,
      touchStartX: 0,
      touchEndX: 0,
      isDragging: false,
      fileAttached: false, // 파일 첨부 상태
    };
  },
  computed: {
    currentAd() {
      return this.adImages[this.currentAdIndex];
    }
  },
  methods: {
    ...mapActions(['addReport']),
    showPopup(data) {
      if (data) {
        this.popupData = data; // 데이터를 popupData에 할당하여 팝업에 표시
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
      this.currentAdIndex = (this.currentAdIndex - 1 + this.adImages.length) % this.adImages.length;
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
    }
  },
};
</script>

<style lang="scss" scoped>
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

/* 나머지 스타일 */
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
  border: 2px solid #132f64;
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
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.action-button {
  padding: 5px 10px;
  background-color: #132f64;
  color: #ffffff;
  border: none;
  border-radius: 4px;
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
</style>
