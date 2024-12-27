export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
  
    // JWT 유효성 검사 (옵션)
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // 토큰 디코딩
      const expiration = payload.exp * 1000;
      return Date.now() < expiration; // 토큰이 만료되지 않았는지 확인
    } catch (error) {
      return false;
    }
  };
  
