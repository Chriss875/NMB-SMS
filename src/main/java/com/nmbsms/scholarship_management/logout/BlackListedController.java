package com.nmbsms.scholarship_management.logout;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;


@RestController
@RequiredArgsConstructor
@RequestMapping(path="/api/logout")
public class BlackListedController {
    private final LogoutService logoutService;

    @PostMapping
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid or missing Authorization header");
        }

        String token = authHeader.substring(7);
        logoutService.logout(token);
        return ResponseEntity.ok("Logged out successfully");
    }
}