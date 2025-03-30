package com.nmbsms.scholarship_management.announcements;
import lombok.*;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


@Service
@RequiredArgsConstructor
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    public Announcement saveAnnouncement(AnnouncementRequestDTO announcementRequestDTO,String email) {
        Announcement announcement = new Announcement();
        announcement.setContent(announcementRequestDTO.getContent());
        announcement.setTitle(announcementRequestDTO.getTitle());
        announcement.setSenderName(email);
        announcementRepository.save(announcement);
        return announcement;
    }

    public List<Announcement> getAllAnnouncements(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Announcement> announcementPage = announcementRepository.findAll(pageable);
        return announcementPage.getContent();
    }
    
}
