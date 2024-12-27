package com.devs.www.filter;

import com.devs.www.service.CustomUserDetailsService;
import com.devs.www.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.equals("/api/users/register") ||
               path.equals("/api/users/login") ||
               path.equals("/api/users/check-email");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authorizationHeader = request.getHeader("Authorization");

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String email = jwtUtil.extractEmail(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    if (jwtUtil.validateToken(token)) {
                        var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("JWT 필터 처리 중 예외 발생: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "JWT 인증 실패");
        }
    }
}

