import axios from "axios";

// 기상청 API를 위한 axios 인스턴스 생성
const weatherAxios = axios.create({
    baseURL: "http://localhost:8080", // 프록시를 통해 기상청 API로 라우팅됨
  headers: {
    "Content-Type": "application/json",
  },
});

// Authorization 헤더 제거
weatherAxios.interceptors.request.use((config) => {
  delete config.headers.Authorization;
  return config;
});

export default weatherAxios;

