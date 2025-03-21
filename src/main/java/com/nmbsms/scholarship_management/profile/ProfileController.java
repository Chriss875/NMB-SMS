package com.nmbsms.scholarship_management.profile;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import com.nmbsms.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping(path="/api/profile")
public class ProfileController {
    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService, JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();
    ProfileResponse profile = profileService.getProfile(email);
    return ResponseEntity.ok(profile);
    }

    @PutMapping("/info")
    public ResponseEntity<String> updateProfileInfo(
        @RequestHeader(value="Authorization",required=false) String authHeader,
        @RequestPart("profile")@Valid ProfileResponse profileDTO){
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Authentication is required");
    }
    String email = authentication.getName();
    profileDTO.setEmail(email);

    try {
        String result = profileService.updateProfile(profileDTO, email, null);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile info");
    }
    
        }

    @PutMapping("/avatar")
    public ResponseEntity<String> updateAvatar(
        @RequestHeader("Authorization") String authHeader,
        @RequestPart("avatar") MultipartFile avatarFile) {
    try {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        ProfileResponse emptyDTO = new ProfileResponse();
        emptyDTO.setEmail(email);
        String result = profileService.updateProfile(emptyDTO, email, avatarFile);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update avatar");
    }
    }
}
