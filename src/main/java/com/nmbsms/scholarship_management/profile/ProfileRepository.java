package com.nmbsms.scholarship_management.profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import com.nmbsms.scholarship_management.signUp.SignUp;

@Repository
public interface ProfileRepository extends JpaRepository<SignUp, Long> {
    Optional<SignUp> findByEmail(String email);
}