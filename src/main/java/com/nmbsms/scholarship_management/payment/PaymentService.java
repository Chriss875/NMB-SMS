package com.nmbsms.scholarship_management.payment;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import java.util.UUID;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import com.nmbsms.scholarship_management.settings.NotificationsService;
import com.nmbsms.scholarship_management.signUp.SignUp;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final NotificationsService notificationsService;
    private final SignUpRepository signUpRepository;
    private static final Pattern CONTROL_NUMBER_PATTERN = Pattern.compile("^\\d{12}$");
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");



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
            signUp.setFeeControlNumberSubmittedAt(LocalDateTime.now());
            signUp.setFeePaymentStatus("UNPAID");
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
            signUp.setNhifControlNumberSubmittedAt(LocalDateTime.now());
            signUp.setNhifPaymentStatus("UNPAID");
            signUpRepository.save(signUp);
        }
        return ResponseEntity.ok("Nhif control number submitted successfully");
    }

    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistory(String email) {
        Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new EntityNotFoundException("User not found");
        }
        SignUp signUp = userOptional.get();
        List<PaymentHistoryDTO> paymentHistory = new ArrayList<>();
        if(signUp.getFeeControlNumber() != null){
            String createdAt = signUp.getFeeControlNumberSubmittedAt().format(ISO_FORMATTER);
            paymentHistory.add(new PaymentHistoryDTO(
                UUID.randomUUID().toString(),
                "Fee Control Number",
                signUp.getFeeControlNumber(),
                createdAt,
                signUp.getFeePaymentStatus(),
                "University Fee Payment"
            ));
        }
        if(signUp.getNhifControlNumber() != null){
            String createdAt = signUp.getNhifControlNumberSubmittedAt().format(ISO_FORMATTER);
            paymentHistory.add(new PaymentHistoryDTO(
                UUID.randomUUID().toString(),
                "Nhif Control Number",
                signUp.getNhifControlNumber(),
                createdAt,
                signUp.getNhifPaymentStatus(),
                "NHIF Payment"
            ));
        }
        return ResponseEntity.ok(paymentHistory);
    }

    @Transactional
    public ResponseEntity<String> updatePaymentStatus(String email, String paymentType, String newStatus) {
        Optional<SignUp> userOptional = signUpRepository.findByEmail(email);
        if(!userOptional.isPresent()){
            throw new EntityNotFoundException("User not found");
        }
        SignUp signUp = userOptional.get();
        boolean isFeePayment = paymentType.equalsIgnoreCase("Fee");
        String oldStatus;
        if(isFeePayment){
            if(signUp.getFeeControlNumber() == null){
                throw new EntityNotFoundException("No fee control number submitted for this user");
            }
            oldStatus = signUp.getFeePaymentStatus();
            signUp.setFeePaymentStatus(newStatus);
        }else if(paymentType.equalsIgnoreCase("Nhif")){
            if(signUp.getNhifControlNumber() == null){
                throw new EntityNotFoundException("No nhif control number submitted for this user");
            }
            oldStatus = signUp.getNhifPaymentStatus();
            signUp.setNhifPaymentStatus(newStatus);
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid payment type");
        }
        signUpRepository.save(signUp);
    if(oldStatus.equals("Submitted")&& newStatus.equals("Paid")){
        String message= isFeePayment ? "University Fee Payment" : "NHIF Payment";
        notificationsService.notifyUserOfPaymentStatusChange(signUp,message);
    }
    return ResponseEntity.ok("Payment status updated successfully");
}
}
