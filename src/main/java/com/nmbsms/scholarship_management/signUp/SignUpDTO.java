package com.nmbsms.scholarship_management.signUp;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpDTO {
    @NotBlank(message="Email is mandatory")
    @Email
    private String email;

    @NotBlank(message="Paasword cannot be blank")
    private String password;

    private String confirmPassword;
    private String token;
    private String name;
    private String sex;
    private String phoneNumber;
    private String universityName;
    private String universityRegistrationId;
    private String courseProgrammeName;
    private String enrolledYear;
    private int batchNo;
    
}
