package com.nmbsms.scholarship_management.signUp;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentPaymentStatusDTO {
    private String name;
    private String feePaymentStatus;
    private String nhifPaymentStatus;
    private Integer batchNo;
}
