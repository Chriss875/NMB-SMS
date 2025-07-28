package com.nmbsms.scholarship_management.settings;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SecurityDTO {
    private String currentPassword;
    private String newPassword;
    
}
