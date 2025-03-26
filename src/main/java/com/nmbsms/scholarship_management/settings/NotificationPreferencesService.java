package com.nmbsms.scholarship_management.settings;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.nmbsms.scholarship_management.signUp.SignUp;
import com.nmbsms.scholarship_management.signUp.SignUpRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class NotificationPreferencesService {
    private final NotificationPreferencesRepository notificationPreferencesRepository;
    private final SignUpRepository signUpRepository;

    public NotificationPreferences getPreferences(String email) {
        return notificationPreferencesRepository.findByUserEmail(email)
        .orElseGet(() -> {
            SignUp user = signUpRepository.findByEmail(email)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
            return new NotificationPreferences(user.getId(),user, false, false);
        });
    }
    public void updatePreferences(NotificationPreferences notificationPreferences){
        notificationPreferencesRepository.save(notificationPreferences);
    }
}
