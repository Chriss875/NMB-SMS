package com.nmbsms.scholarship_management.home;
import com.nmbsms.scholarship_management.announcements.Announcement;
import com.nmbsms.scholarship_management.payment.PaymentHistoryDTO;
import lombok.*;
import org.springframework.data.domain.Page;
import java.util.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private Page<Announcement> announcements;
    private List<PaymentHistoryDTO> payments;
    private List<String> resultStatus;
    private String enrollmentStatus;
}
