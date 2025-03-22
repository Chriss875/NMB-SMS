package com.nmbsms.scholarship_management.logout;
import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "blacklisted_tokens")
public class BlackListedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String token;
    private long expiryDate;
    
}
