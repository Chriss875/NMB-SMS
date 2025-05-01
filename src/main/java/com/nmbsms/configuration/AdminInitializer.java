package com.nmbsms.configuration;

import com.nmbsms.scholarship_management.signUp.SignUp;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import com.nmbsms.scholarship_management.signUp.UserRoles;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    @Autowired
    private SignUpRepository signUpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        createAdminIfNotExists(
            "nyamasawa@nmbsms.com",
            "Nyamasawa",
            "admin1Password123!",
            "1234567890",
            "Female"
        );
        createAdminIfNotExists(
            "jasmine@nmbsms.com",
            "Jasmine",
            "admin2Password456!",
            "0987654321",
            "Female"
        );
    }

    @Transactional
    private void createAdminIfNotExists(String email, String name, String rawPassword, String phoneNumber, String sex) {
        try {
            if (signUpRepository.findByEmail(email).isEmpty()) {
                SignUp admin = new SignUp();
                admin.setEmail(email);
                admin.setName(name);
                admin.setPassword(passwordEncoder.encode(rawPassword));
                admin.setRole(UserRoles.ADMIN);
                admin.setBatchNo(null);
                admin.setPhoneNumber(phoneNumber);
                admin.setUniversityName(null);
                admin.setUniversityRegistrationId(null);
                admin.setCourseProgrammeName(null);
                admin.setEnrolledYear(null);
                admin.setEnrollmentStatus(null);
                admin.setFeeControlNumber(null);
                admin.setFeeControlNumberSubmittedAt(null);
                admin.setFeePaymentStatus(null);
                admin.setNhifControlNumber(null);
                admin.setNhifControlNumberSubmittedAt(null);
                admin.setNhifPaymentStatus(null);
                admin.setSex(sex);
                admin.setToken(null);

                signUpRepository.save(admin);
                logger.info("Created admin: {} with password: {}", email, rawPassword);
            } else {
                logger.info("Admin already exists: {}", email);
            }
        } catch (Exception e) {
            logger.error("Failed to create admin {}: {}", email, e.getMessage());
        }
    }
}