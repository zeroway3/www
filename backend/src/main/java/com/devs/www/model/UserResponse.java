package com.devs.www.model;

import lombok.Getter;

@Getter
public class UserResponse {
    private String email;
    private String name;
    private String birthdate;
    private String gender;

    public UserResponse(User user) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.birthdate = user.getBirthdate();
        this.gender = user.getGender();
    }
}

