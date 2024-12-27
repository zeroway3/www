package com.devs.www.service;

import com.devs.www.model.User;
import com.devs.www.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 데이터베이스에서 사용자 정보 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        // UserDetails 객체 반환
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword()) // 데이터베이스에서 가져온 암호화된 비밀번호
                .roles("USER") // 실제로는 사용자 역할 정보를 DB에서 가져와야 함
                .build();
    }
}

