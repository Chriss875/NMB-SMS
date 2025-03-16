package com.nmbsms.scholarship_management.signUp;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import org.springframework.http.HttpHeaders;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class SignUpController {
    private final SignUpService signupService;

    public SignUpController(SignUpService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/signup/initial")
    public ResponseEntity<String> initialSignUp(@RequestBody SignUpDTO signUpDTO){
        String result= signupService.initialSignUp(signUpDTO);
        if(result.contains("Proceed to token verification")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/signup/verify-token")
    public ResponseEntity<String> verifyToken(@RequestParam String email, @RequestParam String token){
        String result= signupService.verifyToken(email,token);
        if(result.contains("Token verified successfully")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/signup/complete")
    public ResponseEntity<String> completeSignUp(@RequestBody SignUpDTO signUpDTO){
        String result= signupService.completeSignUp(signUpDTO);
        if(result.contains("Profile created successfully")){
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
    
    ResponseCookie jwtCookie = ResponseCookie.from("jwt", result)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(24 * 60 * 60)
        .sameSite("Strict")
        .build();
    Map<String, String> response = new HashMap<>();
    response.put("message", "Login successful");
    
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(response);
}
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword){
        String result= signupService.resetPassword(email,newPassword);
        if(result.contains("Password reset successfully")){
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

}
