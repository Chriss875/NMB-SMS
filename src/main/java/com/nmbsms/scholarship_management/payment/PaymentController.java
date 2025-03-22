package com.nmbsms.scholarship_management.payment;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/submit-fee")
    public ResponseEntity<String> submitFeeControlNumber(@RequestBody PaymentDTO paymentDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Authentication is required");
        }
        String email = authentication.getName();
        return paymentService.submitFeeControlNumber(paymentDTO, email);
    }

    @PostMapping("/submit-nhif")
    public ResponseEntity<String> submitNhifPayment(@RequestBody PaymentDTO paymentDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Authentication is required");
        }
        String email = authentication.getName();
        return paymentService.submitNhifControlNumber(paymentDTO, email);
    }
}