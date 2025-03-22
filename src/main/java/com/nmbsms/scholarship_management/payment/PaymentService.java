package com.nmbsms.scholarship_management.payment;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import com.nmbsms.scholarship_management.signUp.SignUp;
import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final SignUpRepository signUpRepository;
    private static final Pattern CONTROL_NUMBER_PATTERN = Pattern.compile("^\\d{12}$");


    PaymentDTO paymentDTO = new PaymentDTO();

    @Transactional
    public ResponseEntity<String> submitFeeControlNumber(PaymentDTO paymentDTO, String email) {
        String feeControlNumber = paymentDTO.getFeeControlNumber();
        
        
        if (feeControlNumber == null || feeControlNumber.trim().isEmpty()) {
            throw new NullPointerException("Fee control number cannot be empty");
        }
        if (!CONTROL_NUMBER_PATTERN.matcher(feeControlNumber).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Fee control number must be exactly 12 digits.");
        }
        Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new EntityNotFoundException("User not Found");
        }

        Optional<SignUp> controlNumber = signUpRepository.findByEmail(email);
        if (controlNumber.isPresent()) {
            SignUp signUp = controlNumber.get();
            signUp.setFeeControlNumber(paymentDTO.getFeeControlNumber());
            signUpRepository.save(signUp);
        }
        return ResponseEntity.ok("University fee control number submitted successfully");
    }

    @Transactional
    public ResponseEntity<String> submitNhifControlNumber(PaymentDTO paymentDTO, String email) {
        String nhifControlNumber = paymentDTO.getNhifControlNumber();

        if (nhifControlNumber == null || nhifControlNumber.trim().isEmpty()) {
            throw new NullPointerException("Nhif control number cannot be empty");
        }
        if (!CONTROL_NUMBER_PATTERN.matcher(nhifControlNumber).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("NHIF control number must be exactly 12 digits.");
        }
        Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new EntityNotFoundException("User not found");
        }

        Optional<SignUp> controlNumber = signUpRepository.findByEmail(email);
        if (controlNumber.isPresent()) {
            SignUp signUp = controlNumber.get();
            signUp.setNhifControlNumber(paymentDTO.getNhifControlNumber());
            signUpRepository.save(signUp);
        }
        return ResponseEntity.ok("Nhif control number submitted successfully");
    }
}
