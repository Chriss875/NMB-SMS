package com.nmbsms.scholarship_management.signUp;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotSubmittedDTO {
    private String name;
    private String email;
    private String phoneNumber;
    private String universityName;
    private Integer batchNo;
    
}
