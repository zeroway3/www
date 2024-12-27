

package com.devs.www.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    // 모든 경로를 index.html로 리다이렉트
    @GetMapping("/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }

    // 루트 경로도 index.html로 리다이렉트
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }
}

