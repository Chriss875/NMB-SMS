package com.nmbsms.scholarship_management.signUp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;


@Repository
public interface SignUpRepository extends JpaRepository<SignUp, Long> {
    Optional<SignUp> findByEmail(String email);
    Optional<SignUp> findByEmailAndToken(String email, String token);
}
