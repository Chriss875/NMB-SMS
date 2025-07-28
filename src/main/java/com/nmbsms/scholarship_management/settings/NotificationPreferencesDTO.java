package com.nmbsms.scholarship_management.settings;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationPreferencesDTO {
    private boolean receiveAnnouncements;
    private boolean receivePaymentUpdates;
}
