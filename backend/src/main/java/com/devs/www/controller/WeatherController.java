package com.devs.www.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Value("${weather.service-key}")
    private String serviceKey;

    @GetMapping("/getVilageFcst")
    public ResponseEntity<?> getWeatherData(@RequestParam Map<String, String> params) {
        String apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
        RestTemplate restTemplate = new RestTemplate();

        // API 요청 URL에 파라미터 추가
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("serviceKey", serviceKey); // 서비스 키 추가
        params.forEach(uriBuilder::queryParam);

        try {
            // 기상청 API 호출
            ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            // API 호출 실패 시
            return ResponseEntity.status(500).body("API 요청 실패: " + e.getMessage());
        }
    }
}

