

<template>
  <div class="page">
    <!-- 월별 적립금 현황 -->
    <div class="section">
      <div class="header-row">
        <span class="points-label">{{ selectedMonth }}월 적립금 현황</span>
        <input type="month" v-model="selectedMonth" class="month-selector" />
      </div>
      <div class="points">
        <span>{{ totalPoints }}p</span>
      </div>
    </div>

    <!-- 신고 현황 -->
    <div class="section">
      <h2>신고 현황</h2>
      <div class="info-row highlight">
        <span><font-awesome-icon icon="exclamation-circle" /> 신고한 횟수</span>
        <span>{{ totalReports }}회</span>
      </div>
      <div class="info-row small">
        <span><font-awesome-icon icon="tools" /> 기능 고장 신고</span>
        <span>{{ malfunctionReports }}회</span>
        <span><font-awesome-icon icon="broom" /> 청소 요청</span>
        <span>{{ cleaningRequests }}회</span>
      </div>
    </div>

    <!-- 적립 내역 -->
    <div class="section">
      <h2>적립 내역</h2>
      <div v-for="(entry, index) in pointsHistory" :key="index" class="points-row">
        <div class="points-date">
          <span>{{ entry.date }}</span>
          <span class="points-type">{{ entry.type }}: {{ entry.points }}p</span>
        </div>
        <small class="points-time">{{ entry.time }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faTools, faBroom } from '@fortawesome/free-solid-svg-icons';
import { mapState, mapGetters, mapActions } from 'vuex';

library.add(faExclamationCircle, faTools, faBroom);

export default {
  components: {
    FontAwesomeIcon
  },
  computed: {
    ...mapState(['totalReports', 'malfunctionReports', 'cleaningRequests', 'pointsHistory', 'lastReport']),
    ...mapGetters(['totalPoints']),
  },
  methods: {
    ...mapActions(['clearLastReport']),
  },
  watch: {
    // 혜택 뷰로 진입할 때 lastReport 상태가 있는 경우 알림 표시
    lastReport(newReport) {
      if (newReport) {
        Swal.fire({
          title: '적립 완료!',
          text: `${newReport.type}신고가 승인되어 ${newReport.points}포인트가 적립되었습니다.`,
          icon: 'success',
          confirmButtonText: '확인'
        }).then(() => {
          this.clearLastReport(); // 알림 후 초기화
        });
      }
    },
  },
  data() {
    return {
      selectedMonth: "2024-12", // 기본 선택된 월
    };
  },
  created() {
    // 컴포넌트 로드시 바로 알림이 필요한 경우
    if (this.lastReport) {
      Swal.fire({
        title: '적립 완료!',
        text: `${this.lastReport.type}로 ${this.lastReport.points}포인트가 적립되었습니다.`,
        icon: 'success',
        confirmButtonText: '확인'
      }).then(() => {
        this.clearLastReport(); // 알림 후 초기화
      });
    }
  }
};
</script>

<style scoped>
/* 스타일은 기존 스타일 그대로 사용 */
.page {
  padding: 20px;
  text-align: left;
  font-family: Arial, sans-serif;
}

.section {
  margin-top: 20px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.points-label {
  font-weight: bold;
  color: #000; /* 진한 검정색 */
}

.month-selector {
  padding: 5px;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.points {
  font-size: 2em;
  color: #000; /* 진한 검정색 */
  font-weight: bold;
  text-align: left;
  margin-top: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.highlight {
  font-size: 1.2em;
  font-weight: bold;
  color: #2e7d32; /* 초록색으로 변경 */
}

.small {
  font-size: 0.9em;
  color: #333;
}

.points-row {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.points-date {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.points-type {
  color: #333;
  font-size: 0.9em;
}

.points-time {
  display: block;
  color: #666;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>

