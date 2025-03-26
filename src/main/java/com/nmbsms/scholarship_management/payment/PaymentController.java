package com.nmbsms.scholarship_management.payment;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Comparator;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="/api/payment")
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

    @GetMapping("/history")
    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }
        String email = authentication.getName();
        ResponseEntity<List<PaymentHistoryDTO>> response = paymentService.getPaymentHistory(email);
        List<PaymentHistoryDTO> paymentHistory = response.getBody();
        if (paymentHistory != null) {
            paymentHistory.sort(Comparator.comparing(PaymentHistoryDTO::getCreatedAt).reversed());
        }
        return response;
    }

    @PostMapping("/update-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updatePaymentStatus(@RequestParam String email, @RequestParam String paymentType, @RequestParam String newStatus) {
        return paymentService.updatePaymentStatus(email, paymentType, newStatus);
}
}