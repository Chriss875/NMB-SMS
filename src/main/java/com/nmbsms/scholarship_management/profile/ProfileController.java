package com.nmbsms.scholarship_management.profile;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping(path="/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(null);
    }
    String email = authentication.getName();
    ProfileResponse profile = profileService.getProfile(email);
    return ResponseEntity.ok(profile);
    }

    @PutMapping("/info")
    public ResponseEntity<String> updateProfileInfo(@RequestBody ProfileDTO profileDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Authentication is required");
        }
        String email = authentication.getName();
        String result = profileService.updateProfile(profileDTO, email);
        return ResponseEntity.ok(result);
    }
}
