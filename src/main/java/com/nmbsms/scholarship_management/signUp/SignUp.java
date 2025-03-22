package com.nmbsms.scholarship_management.signUp;
import jakarta.persistence.Id;
import lombok.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sign_up")
public class SignUp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true,nullable=false)
    private String email;
    @Column(nullable=true)
    private String password;
    private String token;
    private String name;
    private String sex;
    private String phoneNumber;
    private String universityName;
    private String universityRegistrationId;
    private String courseProgrammeName;
    private String enrolledYear;
    private Integer batchNo;
    private String avatar;
    private String enrollmentStatus;
    private boolean profileCompleted;
    private UserRoles role;
    private String feeControlNumber;
    private String nhifControlNumber;
}
