package com.nmbsms.scholarship_management.home;

import com.nmbsms.scholarship_management.announcements.AnnouncementService;
import com.nmbsms.scholarship_management.payment.PaymentService;
import com.nmbsms.scholarship_management.results.ResultService;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import jakarta.persistence.EntityNotFoundException;
import com.nmbsms.scholarship_management.signUp.SignUp;
import lombok.*;
import org.springframework.stereotype.Service;
import com.nmbsms.scholarship_management.announcements.Announcement;
import org.springframework.data.domain.Page;
import java.util.List;
import com.nmbsms.scholarship_management.payment.PaymentHistoryDTO;
import java.util.Optional;
import com.nmbsms.scholarship_management.signUp.SignUpService;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final AnnouncementService announcementService;
    private final PaymentService paymentService;
    private final ResultService resultService;
    private final SignUpRepository signUpRepository;
    private final SignUpService  signUpService;


    public DashboardDTO getDashboardData(String email) {
        DashboardDTO dashboardData = new DashboardDTO();
        Optional<SignUp> signUp = signUpRepository.findByEmail(email);
        if (signUp.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }
        Page<Announcement> announcements=announcementService.getAllAnnouncements(0,3,0);
        dashboardData.setAnnouncements(announcements);

        List<PaymentHistoryDTO> payments = paymentService.getPaymentHistory(email).getBody();
        dashboardData.setPayments(payments);

        List<String> resultStatus = resultService.getResultStatus(email);
        dashboardData.setResultStatus(resultStatus);

        String enrollmentStatus= signUpService.getEnrollmentStatus(email);
        dashboardData.setEnrollmentStatus(enrollmentStatus);
        return dashboardData;
    }
}
