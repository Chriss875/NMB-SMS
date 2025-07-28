package com.nmbsms.scholarship_management.profile;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileDTO {
    private long id;
    private String email;
    private String name;
    private String sex;
    private String phoneNumber;
    private String universityName;
    private String universityRegistrationId;
    private String courseProgrammeName;
    private String enrolledYear;
    private Integer batchNo;
}
