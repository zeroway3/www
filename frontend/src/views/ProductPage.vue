

<template>
  <div id="product-carousel">
    <!-- 제품 영상 구간 -->
    <div class="section-container">
      <p class="section-title">제품 영상을 소개합니다.</p>
      <div class="video-ad">
        <video preload="metadata" autoplay muted loop playsinline>
          <source src="@/assets/productFinal.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
    
    <!-- 슬라이드 구간 -->
    <div class="section-container">
      <p class="section-title">아래 그림과 같을 때 신고해요</p>
      <swiper
        :slides-per-view="2"
        :space-between="10"
        :centered-slides="true"
        :autoplay="{ delay: 2400 }"
        loop
        effect="coverflow"
        :coverflow-effect="{
          rotate: 30,
          stretch: 0,
          depth: 150,
          modifier: 1.5,
          slideShadows: true
        }"
        @slideChange="updateActiveIndex"
      >
        <swiper-slide
          v-for="(image, index) in productImages"
          :key="index"
          class="swiper-slide-zoom"
          @click="handleImageClick(index)"
        >
          <img
            :src="image.src"
            alt="Product Image"
            class="product-image"
            :class="{ expanded: selectedImageIndex === index && activeIndex === index }"
          />
        </swiper-slide>
      </swiper>
    </div>

    <!-- 선택된 이미지 텍스트 표시 -->
    <div v-if="selectedImageIndex !== null" class="image-details">
      <p>{{ productImages[selectedImageIndex].text }}</p>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      activeIndex: 0,
      selectedImageIndex: null,
      productImages: [
      { src: require('@/assets/feature1.png'), text: "제품에 나뭇잎이나 쓰레기가 들어가서       작동을 안할 때" },
        { src: require('@/assets/feature2.png'), text: "제품 덮개가 비가 오지 않는데 내려가 있을 때" },
        { src: require('@/assets/feature3.png'), text: "제품 덮개가 자리를 이탈했을 때 " },

      ]
    }
  },
  methods: {
    updateActiveIndex(swiper) {
      this.activeIndex = swiper.realIndex
      this.selectedImageIndex = null
    },
    handleImageClick(index) {
      if (index === this.activeIndex) {
        this.selectedImageIndex = index
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

body {
  background-color: #dcdcdc; /* 기본 배경색을 회색으로 */
  color: #333;
}

#product-carousel {
  background-color: #f8f8f8;
  padding: 20px;
}

/* 구간 컨테이너 스타일 */
.section-container {
  background-color: #ffffff; /* 섹션의 배경색은 흰색 유지 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin: 20px auto;
  max-width: 90%;
  text-align: left;
}

/* 구간 제목 스타일 */
.section-title {
  font-family: 'Jua', sans-serif;
  font-size: 18px;
  color: #132f64;
  margin-bottom: 15px;
}

/* 제품 이미지 스타일 */
.product-image {
  max-width: 90%;
  max-height: 300px;
  margin: 0 auto;
  display: block;
  border-radius: 5px;
  margin-top: 25px;
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}
.swiper-slide-zoom.swiper-slide-active .product-image {
  transform: scale(1.3);
}
.product-image.expanded {
  transform: scale(1.6);
}

/* 비디오 광고 스타일 */
.video-ad {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.video-ad video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

/* 선택된 이미지 텍스트 표시 스타일 */
.image-details {
  font-family: 'Jua', sans-serif;
  margin-top: 20px;
  padding: 20px;
  max-width: 90%;
  background: #f4f4f4;
  color: #333;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.image-details p {
  font-size: 1em;
  margin: 0;
}
.selected-image {
  max-width: 100px;
  margin: 10px auto;
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .product-image {
    max-height: 200px;
  }
  .image-details {
    padding: 15px;
  }
}
</style>

