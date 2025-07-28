package com.nmbsms.scholarship_management.payment;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {

    private String feeControlNumber;
    private String nhifControlNumber;
    
}
