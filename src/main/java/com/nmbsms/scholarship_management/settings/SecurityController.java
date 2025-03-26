package com.nmbsms.scholarship_management.settings;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


@RestController
@RequiredArgsConstructor
@RequestMapping(path="/settings")
public class SecurityController {
    private final SecurityService securityService;
    
    @PostMapping("/security")
    public ResponseEntity<String> changePassword(@RequestBody SecurityDTO securityDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Authentication is required");
        }
        String email = authentication.getName();
        securityService.changePassword(email, securityDTO);
        return ResponseEntity.ok("Password changed successfully");
    }
}
