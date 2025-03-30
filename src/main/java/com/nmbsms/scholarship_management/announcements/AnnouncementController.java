package com.nmbsms.scholarship_management.announcements;
import org.springframework.web.bind.annotation.*;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
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
    public ResponseEntity<List<Announcement>> getAllAnnouncements(
        @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
        List<Announcement> announcements = announcementService.getAllAnnouncements(page,size);
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }
}