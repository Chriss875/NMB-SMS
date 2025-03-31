package com.nmbsms.scholarship_management.announcements;
import org.springframework.web.bind.annotation.*;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    @PostMapping("/admin")
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody AnnouncementRequestDTO announcementRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
        String adminName = authentication.getName();
        Announcement savedAnnouncement = announcementService.saveAnnouncement(announcementRequestDTO,adminName);
        return new ResponseEntity<>(savedAnnouncement, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getAllAnnouncements(
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size){
            Page<Announcement> announcementPage = announcementService.getAllAnnouncements(page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("announcements", announcementPage.getContent());
        response.put("currentPage", announcementPage.getNumber());
        response.put("totalItems", announcementPage.getTotalElements());
        response.put("totalPages", announcementPage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
