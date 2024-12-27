import axios from "axios";

// 기본 설정: 현재 호스트 정보를 동적으로 설정
axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:8081`; // Spring Boot 서버의 네트워크 주소
axios.defaults.headers.post["Content-Type"] = "application/json";

// 요청 인터셉터 추가
axios.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem("token");
    if (token) {
      // Authorization 헤더에 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (옵션)
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 발생 시 처리 (예: 로그인 페이지로 이동)
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;

