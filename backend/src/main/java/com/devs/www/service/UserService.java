package com.devs.www.service;

import com.devs.www.model.User;
import com.devs.www.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 이메일을 통해 사용자 정보 조회
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // 비밀번호 암호화
        return userRepository.save(user);
    }

    public boolean checkEmail(String email) {
        return userRepository.findByEmail(email).isEmpty();
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("이메일이 존재하지 않습니다."));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }
    
}

