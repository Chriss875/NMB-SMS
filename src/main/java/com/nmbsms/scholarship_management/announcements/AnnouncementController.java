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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import com.nmbsms.security.JwtService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementService announcementService;
    private final JwtService jwtService;

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Announcement> createAnnouncement(
        @RequestBody AnnouncementRequestDTO announcementRequestDTO,
        @RequestParam(name = "batchNo") Integer batchNo,
        @RequestParam(name="batchNo") String batchNoRaw) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
    if ("all".equalsIgnoreCase(batchNoRaw)) {
        batchNo = 3;
    }
        String adminEmail = authentication.getName();
        Announcement savedAnnouncement = announcementService.saveAnnouncement(announcementRequestDTO,adminEmail,batchNo);
        return new ResponseEntity<>(savedAnnouncement, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getAllAnnouncements(
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size,
        @RequestHeader("Authorization") String authorizationHeader){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
}
        String token = authorizationHeader.substring(7);
        Integer batchNo = jwtService.extractBatchNo(token);
        Page<Announcement> announcementPage = announcementService.getAllAnnouncements(page, size,batchNo);
        Map<String, Object> response = new HashMap<>();
        response.put("announcements", announcementPage.getContent());
        response.put("currentPage", announcementPage.getNumber());
        response.put("totalItems", announcementPage.getTotalElements());
        response.put("totalPages", announcementPage.getTotalPages());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
