package com.nmbsms.scholarship_management.announcements;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementRequestDTO {
    private String title;
    private String content;
}
