package com.nmbsms.scholarship_management.payment;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import jakarta.transaction.Transactional;
import com.nmbsms.scholarship_management.signUp.SignUp;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class PaymentService {
    private final SignUpRepository signUpRepository;
    private final PaymentRepository paymentRepository;
    private static final Pattern CONTROL_NUMBER_PATTERN = Pattern.compile("^\\d{12}$");

    public PaymentService(SignUpRepository signUpRepository, PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
        this.signUpRepository = signUpRepository;
    }

    PaymentDTO paymentDTO = new PaymentDTO();

    @Transactional
    public ResponseEntity<String> submitFeeControlNumber(PaymentDTO paymentDTO, String email) {
        String feeControlNumber = paymentDTO.getFeeControlNumber();
        
        
        if (feeControlNumber == null || feeControlNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Fee control number cannot be empty.");
        }
        if (!CONTROL_NUMBER_PATTERN.matcher(feeControlNumber).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Fee control number must be exactly 12 digits.");
        }

        Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }
        SignUp user = userOptional.get();

        Optional<Payment> existingControlNumber = paymentRepository.findByEmail(email);
        if (existingControlNumber.isPresent()) {
            Payment payment = existingControlNumber.get();
            payment.setFeeControlNumber(paymentDTO.getFeeControlNumber());
            paymentRepository.save(payment);
        } else {
            Payment newPayment = new Payment();
            newPayment.setEmail(email);
            newPayment.setName(user.getName());
            newPayment.setFeeControlNumber(paymentDTO.getFeeControlNumber());
            paymentRepository.save(newPayment);
        }
        return ResponseEntity.ok("University fee control number submitted successfully");
    }

    @Transactional
    public ResponseEntity<String> submitNhifControlNumber(PaymentDTO paymentDTO, String email) {
        String nhifControlNumber = paymentDTO.getNhifControlNumber();

        if (nhifControlNumber == null || nhifControlNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Nhif control number cannot be empty.");
        }
        if (!CONTROL_NUMBER_PATTERN.matcher(nhifControlNumber).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("NHIF control number must be exactly 12 digits.");
        }

        Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        }
        SignUp user = userOptional.get();

        Optional<Payment> existingControlNumber = paymentRepository.findByEmail(email);
        if (existingControlNumber.isPresent()) {
            Payment payment = existingControlNumber.get();
            payment.setNhifControlNumber(paymentDTO.getNhifControlNumber());
            paymentRepository.save(payment);
        } else {
            Payment newPayment = new Payment();
            newPayment.setEmail(email);
            newPayment.setName(user.getName());
            newPayment.setNhifControlNumber(paymentDTO.getNhifControlNumber());
            paymentRepository.save(newPayment);
            paymentRepository.save(newPayment);
        }
        return ResponseEntity.ok("Nhif control number submitted successfully");
    }
}