

package com.devs.www.service;

import com.devs.www.model.User;
import com.devs.www.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User login(String email, String rawPassword) {
        // findByEmail 사용
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));
        
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return user; // 로그인 성공
    }
}

