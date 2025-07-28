package com.nmbsms.scholarship_management.signUp;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import jakarta.persistence.CascadeType;

import com.nmbsms.scholarship_management.settings.NotificationPreferences;
import com.nmbsms.scholarship_management.settings.Notifications;
import java.util.List;
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
    @Column(name="email",unique = true)
    private String email;
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
    private String enrollmentStatus;
    private UserRoles role;
    private String feeControlNumber;
    private LocalDateTime feeControlNumberSubmittedAt;
    private String feePaymentStatus;
    private String nhifControlNumber;
    private LocalDateTime nhifControlNumberSubmittedAt;
    private String nhifPaymentStatus;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private NotificationPreferences notificationPreferences;
    @OneToMany(mappedBy="user", cascade = CascadeType.ALL)
    private List<Notifications> notifications;
}
