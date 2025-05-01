package com.nmbsms.scholarship_management.signUp;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String email;
    private UserRoles role;
    private long id;
}