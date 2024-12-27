
<template>
  <div class="shop-page">
    <!-- 상점 타이틀 -->
    <h1 class="shop-title">Ego drain 상점 리스트</h1>

    <!-- 상품 목록 -->
    <div class="product-list">
      <div
        class="product-item"
        v-for="(product, index) in products"
        :key="index"
      >
        <div class="product-image-wrapper">
          <img :src="product.image" alt="상품 이미지" class="product-image" />
        </div>
        <div class="product-details">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-price">₩{{ product.price.toLocaleString() }}</p>
          <p class="product-description">{{ product.description }}</p>
          <button
            class="buy-button"
            :disabled="userPoints < product.price"
            @click="buyProduct(product)"
          >
            {{ userPoints >= product.price ? "구매하기" : "포인트 부족" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userPoints: 5000, 
      products: [
        {
          name: "Cinnamoroll Doll",
          price: 15000,
          description: "귀여운 시나모롤 인형",
          image: require("@/assets/present1.jpeg"),
        },
        {
          name: "ちいかわ",
          price: 15000,
          description: "귀여운 치이카와 인형",
          image: require("@/assets/present2.jpeg"),
        },
        {
          name: "Joke bear Doll",
          price: 10000,
          description: "시크한 농담곰 인형",
          image: require("@/assets/present3.jpeg"),
        },
        {
          name: "Chunbae Doll",
          price: 20000,
          description: "춘배 인형",
          image: require("@/assets/present4.jpeg"),
        },
        {
          name: "天使 ちいかわ ",
          price: 12000,
          description: "천사 치이카와 인형",
          image: require("@/assets/present5.jpeg"),
        },
        {
          name: "Gromit Doll",
          price: 10000,
          description: "그로밋 인형 세트",
          image: require("@/assets/present6.jpeg"),
        },
      ],
    };
  },
  methods: {
    buyProduct(product) {
      if (this.userPoints >= product.price) {
        this.userPoints -= product.price; // 포인트 차감
        alert(`${product.name}을(를) 구매했습니다! 남은 적립금: ${this.userPoints} P`);
      } else {
        alert("적립금이 부족합니다!");
      }
    },
  },
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.shop-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  background-color: #f4f4f4;
}

/* 타이틀 스타일 */
.shop-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #132f64;
}

/* 상품 리스트 스타일 */
.product-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 한 줄에 2개씩 배치 */
  gap: 20px; /* 간격 */
}

/* 상품 아이템 스타일 */
.product-item {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden; /* 이미지가 넘치지 않도록 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 상품 이미지 래퍼 */
.product-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f9f9f9;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-item:hover .product-image {
  transform: scale(1.05); /* 이미지 확대 */
}

/* 상품 정보 스타일 */
.product-details {
  padding: 15px;
  text-align: center;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #e63946;
  margin-bottom: 10px;
}

.product-description {
  font-size: 14px;
  color: #777;
  margin-bottom: 15px;
}

/* 구매 버튼 스타일 */
.buy-button {
  width: 100%;
  padding: 10px;
  background-color: #132f64;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buy-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.buy-button:hover:enabled {
  background-color: #004a75;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .product-list {
    grid-template-columns: 1fr; /* 한 줄에 하나씩 */
  }
}

@media (max-width: 480px) {
  .product-list {
    grid-template-columns: 1fr; /* 한 줄에 하나씩 */
    gap: 15px; /* 간격을 약간 줄임 */
  }

  .product-item {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 조정 */
  }

  .product-image-wrapper {
    height: 150px; /* 이미지 높이를 줄임 */
  }

  .product-name {
    font-size: 16px; /* 텍스트 크기 조정 */
  }

  .product-price {
    font-size: 14px;
  }

  .product-description {
    font-size: 12px;
  }

  .buy-button {
    font-size: 12px; /* 버튼 텍스트 크기 조정 */
    padding: 8px;
  }
}

</style>

