package com.nmbsms.scholarship_management.settings;
import org.springframework.web.bind.annotation.*;
import com.nmbsms.scholarship_management.signUp.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.http.HttpStatus;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="api/settings")
public class SettingsController {
    private final NotificationPreferencesService notificationPreferencesService;
    private final SignUpRepository signUpRepository;
    private final SecurityService securityService;

    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreferences> getPreferences() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String email = authentication.getName();
        NotificationPreferences notificationPreferences = notificationPreferencesService.getPreferences(email);
        return ResponseEntity.ok(notificationPreferences);
    }

    @PostMapping("/update-notifications")
    public ResponseEntity<NotificationPreferencesDTO> updateNotificationSettings(
            @RequestBody NotificationPreferencesDTO notificationPreferencesDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        NotificationPreferences preferences = notificationPreferencesService.getPreferences(email);
        preferences.setReceiveAnnouncements(notificationPreferencesDTO.isReceiveAnnouncements());
        preferences.setReceivePaymentUpdates(notificationPreferencesDTO.isReceivePaymentUpdates());
        notificationPreferencesService.updatePreferences(preferences);
        return ResponseEntity.ok(notificationPreferencesDTO);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notifications>> getNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        SignUp user = signUpRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        List<Notifications> notifications = user.getNotifications();
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/security")
    public ResponseEntity<String> changePassword(@RequestBody SecurityDTO securityDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Authentication is required");
        }
        String email = authentication.getName();
        securityService.changePassword(email, securityDTO);
        return ResponseEntity.ok("Password changed successfully");
    }
}
