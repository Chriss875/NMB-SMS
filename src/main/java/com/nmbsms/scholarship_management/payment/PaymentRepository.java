package com.nmbsms.scholarship_management.payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional <Payment> findByEmail(String email);

}

