package com.nmbsms.scholarship_management.signUp;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class SignUpController {

    private final SignUpService signupService;

    public SignUpController(SignUpService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/signup/initial")
    public ResponseEntity<String> initialSignUp(@RequestBody SignUpDTO signUpDTO) {
        String result = signupService.initialSignUp(signUpDTO);
        if (result.contains("Authorization successful")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/signup/set-password")
    public ResponseEntity<String> setPassword(@RequestBody SignUpDTO signUpDTO) {
        String result = signupService.setPassword(signUpDTO);
        if (result.contains("Password set successfully")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/signup/complete")
    public ResponseEntity<String> completeSignUp(@RequestBody SignUpDTO signUpDTO) {
        String result = signupService.completeSignUp(signUpDTO);
        if (result.contains("Profile created successfully")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        String result = signupService.login(loginDTO);
        if (result.equals("Invalid credentials")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid credentials"));
        }

        // Get user details from the service
        Optional<SignUp> userOptional = signupService.getUserByEmail(loginDTO.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "User not found after authentication"));
        }

        SignUp user = userOptional.get();

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", result)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("email", user.getEmail());
        userData.put("name", user.getName());
        userData.put("role", "student");
        userData.put("profileCompleted", user.getName() != null && !user.getName().isEmpty());
        response.put("user", userData);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        String result = signupService.resetPassword(email, newPassword);
        if (result.contains("Password reset successfully")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}