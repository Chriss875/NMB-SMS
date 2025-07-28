package com.nmbsms.scholarship_management.signUp;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SignUpConfiguration {
    @Bean
    public Integer minPasswordLength(){
        return 8;
    }


    
}

