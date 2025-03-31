package com.nmbsms.scholarship_management.home;

import com.nmbsms.scholarship_management.announcements.AnnouncementService;
import com.nmbsms.scholarship_management.payment.PaymentService;
import com.nmbsms.scholarship_management.results.Results;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import jakarta.persistence.EntityNotFoundException;
import com.nmbsms.scholarship_management.signUp.SignUp;
import lombok.*;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import com.nmbsms.scholarship_management.announcements.Announcement;
import org.springframework.data.domain.Page;
import java.util.List;
import com.nmbsms.scholarship_management.payment.PaymentHistoryDTO;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final AnnouncementService announcementService;
    private final PaymentService paymentService;
    private final Results result;
    private final SignUpRepository signUpRepository;

    public Map<String, Object> getDashboardData(String email) {
        Optional<SignUp> signUp = signUpRepository.findByEmail(email);
        if (signUp.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        Map<String, Object> dashboardData = new HashMap<>();
        Page<Announcement> announcements=announcementService.getAllAnnouncements(0,3);
        dashboardData.put("announcements", announcements);

        List<PaymentHistoryDTO> payments = paymentService.getPaymentHistory(email).getBody();
        dashboardData.put("payments", payments);

        String resultStatus = result.getStatus();
        dashboardData.put("resultStatus", resultStatus);
        return dashboardData;
    }
}
