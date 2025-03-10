package com.nmbsms.scholarship_management.profile;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.nmbsms.security.JwtService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService, JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(@RequestHeader("Authorization") String authHeader){
        String token= authHeader.substring(7);
        String email= jwtService.extractEmail(token);
        ProfileDTO profile=profileService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<String> updateProfile(
        @RequestHeader("Authorization") String authHeader,
        @RequestPart("profile")@Valid ProfileDTO profileDTO,
        @RequestPart("avatar") MultipartFile avatarFile){
            String token= authHeader.substring(7);
            String email= jwtService.extractEmail(token);
            profileDTO.setEmail(email);
            try{
                String result= profileService.updateProfile(profileDTO, email, avatarFile);
                return ResponseEntity.ok(result);
            }catch(Exception e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile");
            }
    }
}
