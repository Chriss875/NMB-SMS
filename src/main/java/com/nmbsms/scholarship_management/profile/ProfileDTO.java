package com.nmbsms.scholarship_management.profile;
import lombok.Data;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProfileDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    private String name;
    private String sex;
    private String phoneNumber;
    private String universityName;
    private String universityRegistrationId;
    private String courseProgrammeName;
    @Min(value = 2022, message = "Enrolled year must be 2022 or later")
    @Max(value = 2025, message = "Enrolled year must be 2025 or earlier")
    private String enrolledYear;
    private Integer batchNo;
    private MultipartFile avatar;
    private String enrollmentStatus;

    
}
