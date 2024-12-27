package com.devs.www.controller;

import com.devs.www.model.User;
import com.devs.www.model.UserResponse;
import com.devs.www.service.UserService;
import com.devs.www.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil; // JwtUtil 의존성 추가

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            // 사용자 인증 (이메일과 비밀번호 확인)
            User authenticatedUser = userService.authenticate(user.getEmail(), user.getPassword());
            
            // 인증된 사용자의 이메일로 JWT 토큰 생성
            String token = jwtUtil.generateToken(authenticatedUser.getEmail());

            // 토큰과 사용자 정보를 응답으로 반환
            return ResponseEntity.ok().body(new LoginResponse(authenticatedUser, token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isAvailable = userService.checkEmail(email);
        if (isAvailable) {
            return ResponseEntity.ok("이메일 사용 가능합니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }
    }

    @GetMapping("/me")
public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
    try {
        // Authorization 헤더가 없거나 형식이 잘못된 경우 처리
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization 헤더가 필요합니다.");
        }

        // "Bearer " 제거
        token = token.substring(7);

        // 토큰 유효성 검증
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 만료되었거나 유효하지 않습니다.");
        }

        // JWT에서 이메일 추출
        String email = jwtUtil.extractEmail(token);
        System.out.println("JWT에서 추출된 이메일: " + email);

        // 이메일로 사용자 조회
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
        System.out.println("조회된 사용자: " + user);

        // 사용자 정보를 DTO로 반환
        UserResponse userResponse = new UserResponse(user);
        return ResponseEntity.ok(userResponse);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
    }
}


    static class LoginResponse {
        private String email;
        private String name;
        private String token;

        public LoginResponse(User user, String token) {
            this.email = user.getEmail();
            this.name = user.getName();
            this.token = token;
        }

        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getToken() { return token; }
    }
}

