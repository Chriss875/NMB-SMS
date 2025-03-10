package com.nmbsms.scholarship_management.profile;
import lombok.Data;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProfileDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Sex is required")
    private String sex;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "University name is required")
    private String universityName;

    @NotBlank(message = "University registration id is required")
    private String universityRegistrationId;

    @NotBlank(message = "Course programme name is required")
    private String courseProgrammeName;

    @NotBlank(message = "Enrolled year is required")
    @Min(value = 2022, message = "Enrolled year must be 2022 or later")
    @Max(value = 2025, message = "Enrolled year must be 2025 or earlier")
    private String enrolledYear;

    @NotBlank(message = "Batch number is required")
    @Min(value = 1, message = "Batch number must be 1 or later")
    private int batchNo;

    private MultipartFile avatar;

    private String enrollmentStatus;

    
}
