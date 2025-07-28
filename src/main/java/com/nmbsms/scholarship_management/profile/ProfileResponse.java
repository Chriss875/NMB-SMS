package com.nmbsms.scholarship_management.profile;
import lombok.Data;
import com.nmbsms.scholarship_management.signUp.UserRoles;

@Data
public class ProfileResponse {
    private long id;
    private UserRoles role;
    private String email;
    private String name;
    private String sex;
    private String phoneNumber;
    private String universityName;
    private String universityRegistrationId;
    private String courseProgrammeName;
    private String enrolledYear;
    private Integer batchNo;
    private String enrollmentStatus;

    
}
