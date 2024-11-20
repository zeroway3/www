import { createStore } from 'vuex';

export default createStore({
  state: {
    totalReports: 3,
    malfunctionReports: 2,
    cleaningRequests: 1,
    pointsHistory: [
      { date: "2024-11-2", type: "기능 고장 신고", points: 200, time: "15:30" },
      { date: "2024-11-5", type: "청소 요청", points: 50, time: "11:20" },
      { date: "2024-11-9", type: "기능 고장 신고", points: 200, time: "09:10" },
    ],
    lastReport: null, // 최근 신고 정보 저장
  },
  mutations: {
    ADD_REPORT(state, { type, points }) {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0].slice(0, 5);

      if (type === "기능 고장 신고") {
        state.malfunctionReports++;
      } else if (type === "청소 요청") {
        state.cleaningRequests++;
      }
      state.totalReports++;
      state.pointsHistory.push({ date, type, points, time });

      // 최근 신고 정보 업데이트
      state.lastReport = { type, points };
    },
    CLEAR_LAST_REPORT(state) {
      state.lastReport = null; // 알림 후 최근 신고 정보 초기화
    }
  },
  actions: {
    addReport({ commit }, { type }) {
      const points = type === "기능 고장 신고" ? 200 : 50;
      commit('ADD_REPORT', { type, points });
    },
    clearLastReport({ commit }) {
      commit('CLEAR_LAST_REPORT');
    }
  },
  getters: {
    totalPoints(state) {
      return state.malfunctionReports * 200 + state.cleaningRequests * 50;
    },
  },
});
