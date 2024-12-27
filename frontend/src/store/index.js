import { createStore } from "vuex";
import axios from "@/axios"; // API 요청을 위한 axios


export default createStore({
  state: {
    // 기존 상태
    totalReports: 3,
    malfunctionReports: 2,
    cleaningRequests: 1,
    pointsHistory: [
      { date: "2024-12-2", type: "기능 고장 신고", points: 200, time: "15:30" },
      { date: "2024-12-5", type: "청소 요청", points: 50, time: "11:20" },
      { date: "2024-12-9", type: "기능 고장 신고", points: 200, time: "09:10" },
    ],
    lastReport: null, // 최근 신고 정보 저장

    // 추가된 상태 (사용자 정보)
    userInfo: {
      name: "",
      profileImage: "",
      status: "적립금 사용하러 가보기",
    },
  },
  mutations: {
    // 기존 뮤테이션
    ADD_REPORT(state, { type, points }) {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0].slice(0, 5);

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
      state.lastReport = null;
    },

    // 추가된 뮤테이션 (사용자 정보 업데이트)
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {
    // 기존 액션
    addReport({ commit }, { type }) {
      const points = type === "기능 고장 신고" ? 200 : 50;
      commit("ADD_REPORT", { type, points });
    },
    clearLastReport({ commit }) {
      commit("CLEAR_LAST_REPORT");
    },

    // 추가된 액션 (서버에서 사용자 정보 가져오기)
    async fetchUserInfo({ commit }) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userInfo = {
          name: response.data.name || "사용자",
          profileImage: response.data.profileImage || require("@/assets/rain.png"),
          status: "적립금 사용하러 가보기", // 기본 상태
        };

        commit("SET_USER_INFO", userInfo); // 사용자 정보 업데이트
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error.message);
      }
    },
  },
  getters: {
    // 기존 게터
    totalPoints(state) {
      return state.malfunctionReports * 200 + state.cleaningRequests * 50;
    },

    // 추가된 게터 (사용자 정보)
    getUserInfo(state) {
      return state.userInfo;
    },
  },
});

