package com.nmbsms.scholarship_management.configuration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

@Component
@ConfigurationProperties(prefix = "jwt")
@Data
public class Jwtproperties {
    private String secret;
    private Long expiration;
}
