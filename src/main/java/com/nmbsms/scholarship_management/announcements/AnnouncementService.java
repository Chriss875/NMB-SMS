package com.nmbsms.scholarship_management.announcements;
import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    public Announcement saveAnnouncement(AnnouncementRequestDTO announcementRequestDTO,String email,Integer batchNo) {
        Announcement announcement = new Announcement();
        announcement.setContent(announcementRequestDTO.getContent());
        announcement.setTitle(announcementRequestDTO.getTitle());
        announcement.setSenderEmail(email);
        announcement.setBatchNo(batchNo);
        announcementRepository.save(announcement);
        return announcement;
    }

    public Page<Announcement> getAllAnnouncements(int page, int size,Integer batchNo) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<Integer> batchNos = new ArrayList<>();
        batchNos.add(batchNo);
        return announcementRepository.findAllByBatchNoIn(batchNos,pageable);
    }
}
