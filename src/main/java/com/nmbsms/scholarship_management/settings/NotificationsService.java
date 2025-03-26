package com.nmbsms.scholarship_management.settings;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.nmbsms.scholarship_management.signUp.SignUp;
import java.time.LocalDateTime;



@Service
@RequiredArgsConstructor
public class NotificationsService {
    private final NotificationRepository notificationsRepository;
    private final NotificationPreferencesService notificationPreferencesService;

    public void notifyUserOfPaymentStatusChange(SignUp user, String message) {
        NotificationPreferences preferences= notificationPreferencesService.getPreferences(user.getEmail());
        if(preferences.isReceivePaymentUpdates()) {
            Notifications notification = new Notifications(user.getId(),user,message,LocalDateTime.now(),false);
            notificationsRepository.save(notification);
            sendEmail(user.getEmail(), message);
        }
    }

    private void sendEmail(String email, String message) {
        System.out.println("Sending email to " + email + ": " + message);
    }
}
