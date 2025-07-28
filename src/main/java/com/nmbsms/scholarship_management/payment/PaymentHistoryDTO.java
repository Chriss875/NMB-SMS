package com.nmbsms.scholarship_management.payment;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentHistoryDTO {
    private String id;
    private String type;
    private String controlNumber;
    private String createdAt;
    private String status;
    private String description;
    
}
