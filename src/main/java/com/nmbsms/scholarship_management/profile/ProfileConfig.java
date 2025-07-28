package com.nmbsms.scholarship_management.profile;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProfileConfig {
    @Bean
    public String uploadDir() {
        return "uploads/avatars/";
    }
}